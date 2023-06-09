### 環境下載

-   須先下載 node js [https://nodejs.org/en], 測試時是用 node v18

1. npm install express --save
2. npm install firebase-admin --save
3. npm install firebase --save

or

npm i

#### 密鑰取得方式

-   (ex: nccu-swap-firebase-adminsdk-3ga3a-df3a1b1462.json 取得方式)

```
在 Firebase 控制台中，點選「設定（Settings）」圖示，然後選擇「專案設定（Project Settings）」。
在專案設定頁面中，切換到「服務帳戶（Service Accounts）」選項卡。
滾動到「Firebase Admin SDK」部分，然後點選「產生新的私密金鑰（Generate New Private Key）」。
系統會下載一個名為 serviceAccountKey.json 的金鑰檔案到您的電腦中。
```

#### 運行

npm start

#### 功能使用

開啟swap後，點選右上角'公佈欄'
點擊"查看交換資訊"，可更新最新交換資訊
透過輸入框可新增一筆資料進入firebase realtime database
