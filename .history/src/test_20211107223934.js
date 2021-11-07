/*
 * @Author: your name
 * @Date: 2021-11-07 22:39:33
 * @LastEditTime: 2021-11-07 22:39:33
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /bilibili-send-barrage/src/test.js
 */
const BiliBiliSendBarrage = require('./app.js');

// 設定配置
const server = new BiliBiliSendBarrage({
    ROOMID: 9329583, 
    CSRF: 'e87c38cd65e10ef7c9a2b5edba82d6e5',
    COOKIE: '_uuid=D52BFD58-1E97-7F80-3EF4-5EA77C3C30E914699infoc;sid=71yrq0dr;buvid3=B997C0BC-0942-4F20-AF9F-FB3729DEF6B913445infoc;DedeUserID=291883246;DedeUserID__ckMd5=b758a9898056a02a;SESSDATA=4ec29659%2C1638844031%2Ce24c1*61;bili_jct=e87c38cd65e10ef7c9a2b5edba82d6e5;LIVE_BUVID=AUTO2916250727829126;PVID=2;_dfcaptcha=626c24d93b706dae685bafa406fc1f9d'
});
 

 
// 監聽事件
server.addListener(msg => console.log(msg));
 
// 發送彈幕
server.send('Hello BiliBili');