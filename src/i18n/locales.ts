export const locales = {
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',
  'ko-KR': '한국어'
} as const;

export type LocaleKey = keyof typeof locales;

export const translations = {
  'zh-TW': {
    title: 'Apple JWS Generator',
    certificates: '憑證檔案',
    dropOrClick: '點擊或拖放檔案',
    payloadAndResult: 'Payload & 結果',
    formatJson: '格式化 JSON',
    inputJson: '輸入要簽署的 JSON',
    generateJws: '產生 JWS',
    generatedJws: '產生的 JWS',
    copy: '複製 JWS',
    copied: '已複製',
    viewInJwtIo: '在 JWT.io 中檢視',
    uploadRequired: '請上傳所有必要的檔案',
    error: '處理過程發生錯誤'
  },
  'en-US': {
    title: 'Apple JWS Generator',
    certificates: 'Certificates',
    dropOrClick: 'Drop or click to upload',
    payloadAndResult: 'Payload & Result',
    formatJson: 'Format JSON',
    inputJson: 'Enter JSON to sign',
    generateJws: 'Generate JWS',
    generatedJws: 'Generated JWS',
    copy: 'Copy JWS',
    copied: 'Copied',
    viewInJwtIo: 'View in JWT.io',
    uploadRequired: 'Please upload all required files',
    error: 'An error occurred during processing'
  },
  'ja-JP': {
    title: 'Apple JWS ジェネレーター',
    certificates: '証明書',
    dropOrClick: 'クリックまたはドロップでアップロード',
    payloadAndResult: 'ペイロードと結果',
    formatJson: 'JSONフォーマット',
    inputJson: '署名するJSONを入力',
    generateJws: 'JWS生成',
    generatedJws: '生成されたJWS',
    copy: 'JWSをコピー',
    copied: 'コピー完了',
    viewInJwtIo: 'JWT.ioで確認',
    uploadRequired: '必要なファイルをすべてアップロードしてください',
    error: '処理中にエラーが発生しました'
  },
  'ko-KR': {
    title: 'Apple JWS 생성기',
    certificates: '인증서',
    dropOrClick: '클릭 또는 드래그하여 업로드',
    payloadAndResult: '페이로드 & 결과',
    formatJson: 'JSON 포맷',
    inputJson: '서명할 JSON 입력',
    generateJws: 'JWS 생성',
    generatedJws: '생성된 JWS',
    copy: 'JWS 복사',
    copied: '복사됨',
    viewInJwtIo: 'JWT.io에서 보기',
    uploadRequired: '모든 필수 파일을 업로드해주세요',
    error: '처리 중 오류가 발생했습니다'
  },
  'zh-CN': {
    title: 'Apple JWS 生成器',
    certificates: '证书文件',
    dropOrClick: '点击或拖放文件',
    payloadAndResult: 'Payload & 结果',
    formatJson: '格式化 JSON',
    inputJson: '输入要签署的 JSON',
    generateJws: '生成 JWS',
    generatedJws: '生成的 JWS',
    copy: '复制 JWS',
    copied: '已复制',
    viewInJwtIo: '在 JWT.io 中查看',
    uploadRequired: '请上传所有必要的文件',
    error: '处理过程发生错误'
  }
} as const;
