# bilibili-send-barrage

### 安裝這個依賴項
```
npm install bilibili-send-barrage --save
```

### 如何使用它，下面是一個教程和示例模板
```js
'use strict';

// 引入依賴
import BiliBiliSendBarrage from 'bilibili-send-barrage';

// 設定配置
const server = new BiliBiliSendBarrage(ROOMID, {
	CSRF: '',
	COOKIE: ''
});

/**
 * 1.訪問 https://live.bilibili.com/ 網址。
 * 2.登陸自己的 BiliBili 賬戶。
 * 3.隨便進入一個主播的直播間，然後按鍵盤上面的 F12 按鍵，打開開發者工具，切換到 Network 標籤
 * 4.在網頁直播間聊天欄發送任意內容彈幕。
 * 5.然後在 Network 標籤裡面查找 Name 屬性值為 send 的請求，點進去。
 * 6.然後在 Header 標籤獲取 Cookie 值, 在 Repview 標籤裡面獲取 csrf。
 * 7.結束
*/

// 响应監聽器
server.addListener(msg => console.log(msg));

// 發送彈幕
server.send('Hello BiliBili');
```