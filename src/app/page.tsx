"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

const AppleJWSGenerator = () => {
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Apple JWS Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Leaf Certificate (PEM)</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'leafCert')}
            className="w-full"
            accept=".pem,.cert,.crt"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Intermediate Certificate (PEM)</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'intermediateCert')}
            className="w-full"
            accept=".pem,.cert,.crt"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Root Certificate (PEM)</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'rootCert')}
            className="w-full"
            accept=".pem,.cert,.crt"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Private Key (P8/PEM)</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'privateKey')}
            className="w-full"
            accept=".p8,.pem"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Payload (JSON)</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Enter your payload JSON here"
          />
        </div>

        <Button 
          onClick={generateJWS}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Generate JWS
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Generated JWS</label>
            <textarea
              value={result}
              readOnly
              className="w-full h-32 p-2 border rounded bg-gray-50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppleJWSGenerator;