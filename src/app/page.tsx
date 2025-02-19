"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Check, Github } from 'lucide-react';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { translations, type LocaleKey } from '@/i18n/locales';

const AppleJWSGenerator = () => {
  const [locale, setLocale] = useState<LocaleKey>('zh-TW');
  const [files, setFiles] = useState<{
    leafCert: File | null;
    intermediateCert: File | null;
    rootCert: File | null;
    privateKey: File | null;
  }>({
    leafCert: null,
    intermediateCert: null,
    rootCert: null,
    privateKey: null,
  });
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const t = translations[locale];

  // Base64Url encoding function
  const base64UrlEncode = (str: string | ArrayBuffer): string => {
    let base64 = '';
    if (typeof str === 'string') {
      base64 = btoa(str);
    } else {
      const bytes = new Uint8Array(str);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      base64 = btoa(binary);
    }
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // Read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Format PEM certificate by removing headers, footers, and whitespace
  const formatCertificate = (cert: string): string => {
    return cert
      .replace(/-----BEGIN CERTIFICATE-----/, '')
      .replace(/-----END CERTIFICATE-----/, '')
      .replace(/\s/g, '');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    const file = event.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const generateJWS = async () => {
    try {
      setError('');
      
      // Check if all files are uploaded
      if (!files.leafCert || !files.intermediateCert || !files.rootCert || !files.privateKey) {
        throw new Error('請上傳所有必要的檔案');
      }

      // Read and format certificates
      const certChain = await Promise.all([
        readFileAsText(files.leafCert).then(formatCertificate),
        readFileAsText(files.intermediateCert).then(formatCertificate),
        readFileAsText(files.rootCert).then(formatCertificate),
      ]);

      // Create header
      const header = {
        alg: 'ES256',
        x5c: certChain
      };

      // Convert header and payload to base64url
      const headerBase64 = base64UrlEncode(JSON.stringify(header));
      const payloadBase64 = base64UrlEncode(payload);
      const dataToSign = `${headerBase64}.${payloadBase64}`;

      // Read private key
      const privateKeyContent = await readFileAsText(files.privateKey);
      
      // Use Web Crypto API to import private key and sign
      const privateKeyDer = window.atob(privateKeyContent
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, ''));
      
      const keyData = new Uint8Array(privateKeyDer.length)
        .map((_, i) => privateKeyDer.charCodeAt(i));

      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        keyData,
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        false,
        ['sign']
      );

      // Sign the data
      const signature = await window.crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' },
        },
        privateKey,
        new TextEncoder().encode(dataToSign)
      );

      const signatureBase64 = base64UrlEncode(signature);
      const jws = `${headerBase64}.${payloadBase64}.${signatureBase64}`;
      
      setResult(jws);
    } catch (err) {
      setError(err instanceof Error ? err.message : '處理過程發生錯誤');
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center relative">
          <div className="absolute right-4 top-4 flex gap-2">
            <LocaleSwitcher currentLocale={locale} onLocaleChange={setLocale} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open('https://github.com/felaray/AppleJWSGenerator', '_blank')}
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.certificates}</h3>
              <div className="space-y-3">
                {[
                  { type: 'leafCert', label: 'Leaf Certificate (PEM)' },
                  { type: 'intermediateCert', label: 'Intermediate Certificate (PEM)' },
                  { type: 'rootCert', label: 'Root Certificate (PEM)' },
                  { type: 'privateKey', label: 'Private Key (P8/PEM)' }
                ].map((item) => (
                  <div key={item.type} className="relative">
                    <div className="border-2 border-dashed rounded-lg p-3 hover:border-primary/50 transition-colors">
                      <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {files[item.type as keyof typeof files]?.name || t.dropOrClick}
                        </span>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, item.type as keyof typeof files)}
                          accept=".pem,.cert,.crt,.p8"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.payloadAndResult}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Payload (JSON)</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        try {
                          const formatted = JSON.stringify(JSON.parse(payload), null, 2);
                          setPayload(formatted);
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                    >
                      {t.formatJson}
                    </Button>
                  </div>
                  <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="w-full h-[150px] p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary/50 font-mono"
                    placeholder={t.inputJson}
                  />
                </div>

                <Button 
                  onClick={generateJWS}
                  className="w-full h-12 text-base"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {t.generateJws}
                </Button>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.generatedJws}</label>
                    <textarea
                      value={result}
                      readOnly
                      className="w-full h-[150px] p-3 text-sm bg-muted rounded-lg font-mono"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="default"
                        size="sm"
                        className={`flex-1 transition-all duration-200 ${copied ? 'bg-green-600' : ''}`}
                        onClick={() => handleCopy(result)}
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t.copied}
                          </>
                        ) : (
                          t.copy
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`https://jwt.io/#debugger-io?token=${result}`, '_blank')}
                      >
                        {t.viewInJwtIo}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppleJWSGenerator;