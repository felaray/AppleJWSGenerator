# Apple JWS Generator

一個基於 Next.js 的 Apple JWS (JSON Web Signature) 生成工具，用於產生符合 Apple 規範的 JWS 格式。

## 📱 線上展示

Demo : https://gray-glacier-0b1b6c310.4.azurestaticapps.net/

## 🔐 安全性說明

本工具採用純前端實現，具有以下安全特性：

* 所有檔案處理和運算皆在使用者的瀏覽器中完成
* 憑證和私鑰不會上傳至任何伺服器
* 不會儲存任何敏感資訊
* 使用 Web Crypto API 進行加密操作
* 完全開源，程式碼可審查

## 功能特點

* 支援上傳憑證鏈（Leaf、Intermediate、Root 憑證）
* 支援 PKCS#8 格式的私鑰
* 使用 ES256 演算法進行簽章
* 即時錯誤提示
* 支援自定義 Payload
* 提供 Base64URL 編碼的 JWS 輸出

## 技術實現

* 使用 Web Crypto API 進行密碼學操作
* 支援 PEM 格式憑證解析
* shadcn/ui 元件庫提供現代化 UI
* TypeScript 確保型別安全
* 純前端實現，無需後端服務

## 使用說明

1. 上傳所需的憑證檔案：
   * Leaf Certificate (PEM 格式)
   * Intermediate Certificate (PEM 格式)
   * Root Certificate (PEM 格式)
   * Private Key (PKCS#8/PEM 格式)
2. 在 Payload 欄位輸入要簽署的 JSON 內容
3. 點擊 "Generate JWS" 按鈕產生簽章
4. 簽章結果會以 `header.payload.signature` 格式顯示

## 本地開發

1. Clone 專案
```bash
git clone https://github.com/felaray/AppleJWSGenerator.git
cd AppleJWSGenerator
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 啟動開發伺服器
```bash
npm run dev
# 或
yarn dev
```

在瀏覽器中開啟 `http://localhost:3000` 即可使用。

## 注意事項

* 所有檔案處理均在瀏覽器端完成，不會上傳到伺服器
* 請確保私鑰的安全性
* 支援的檔案格式：`.pem`、`.cert`、`.crt`、`.p8`
* 請確保憑證鏈的完整性和正確性

## 貢獻方式

歡迎透過 GitHub Issues 或 Pull Requests 提供意見和改進建議。

## 授權條款

MIT License
