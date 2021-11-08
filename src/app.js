// 啟用嚴格模式
'use strict';

/**
 * @param {object} configs 身份配置
 * @param {number} ROOMID 房间号码
 * @param {string} CSRF 消息校验
 * @param {string} COOKIE 身份校验
 * @param {string} message 弹幕消息
 * @param {function} callback 响应回调
*/

// 導入所需模塊
import { request } from 'http';
import { EventEmitter } from 'events';

// 創建主類
class BiliBiliSendBarrage extends EventEmitter {

	// 定義靜態對象
	static eventTrigger = null;
	static eventListener = null;
	static globalConfigs = null;

	// 類的初始化入口
	constructor(ROOMID, configs = {
		CSRF: null,
		COOKIE: null
	}) {
		// 遞給父類(無用)
		super(configs);

		// 綁定觸發器為全局
		BiliBiliSendBarrage.trigger = message => super.emit('callback', message);
		// 綁定監聽器為全局
		BiliBiliSendBarrage.listener = callback => super.addListener('callback', callback);

		// 定義常量請求頭
		const requestConfig = {
			"protocol": "http:",
			"host": "api.live.bilibili.com",
			"port": 80,
			"path": "/msg/send",
			"method": "POST",
			"headers": {
				"Host": "api.live.bilibili.com",
				"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Safari/537.36",
				"content-type": `multipart/form-data; boundary=----WebKitFormBoundary8kjTT7jRU64detOB`,
				"accept": "*/*",
				"origin": "https://live.bilibili.com",
				"x-requested-with": "mark.via",
				"sec-fetch-site": "same-site",
				"sec-fetch-mode": "cors",
				"sec-fetch-dest": "empty",
				"referer": "https://live.bilibili.com/",
				"accept-encoding": "gzip, deflate",
				"accept-language": "zh-TW,zh;q=0.9,en;q=0.8,zh-CN;q=0.7,ja;q=0.6,ug;q=0.5",
				"Cookie": configs.COOKIE
			}
		};
		
		// 對象合併並設置全局
		BiliBiliSendBarrage.globalConfigs = Object.assign({ requestConfig }, { ROOMID }, { configs });
	}

	// 發送消息
	send(message) {
		if(message) {

			// 定義常量數據體
			const data = `------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="bubble"

0
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="msg"

${message}
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="color"

16777215
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="mode"

1
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="fontsize"

25
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="rnd"

${new Date().getTime()}
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="roomid"

${BiliBiliSendBarrage.globalConfigs.ROOMID}
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="csrf"

${BiliBiliSendBarrage.globalConfigs.configs.CSRF}
------WebKitFormBoundary8kjTT7jRU64detOB--
Content-Disposition: form-data; name="csrf_token"

${BiliBiliSendBarrage.globalConfigs.configs.CSRF}
------WebKitFormBoundary8kjTT7jRU64detOB--
`;

			// 開始請求
			const request = BiliBiliSendBarrage.createRequest(BiliBiliSendBarrage.globalConfigs.requestConfig);

			// 寫入請求體
			request.write(data);
			// 發送請求體
			request.end();
		} else 
		BiliBiliSendBarrage.trigger('未提供弹幕内容');
	}

	// 監聽器
	addListener(callback) {
		BiliBiliSendBarrage.listener(callback);
	}

	// 靜態創建請求實例
	static createRequest(requestConfig) {

		// 返回實例
		return request(requestConfig, socket => {
			socket.on('data', message => {
				const [result, { trigger }] = [
					JSON.parse(message),
					BiliBiliSendBarrage
				];

				// 響應體狀態碼判斷
				switch(result.code) {
					case 0: 
						trigger('发送成功');
					break;

					case -101: 
						trigger(result.message);
					break;

					case -111: 
						trigger(result.message);
					break;

					case -400: 
						trigger('未提供房间号');
					break;

					case 11000: 
						trigger('當前直播間已關閉彈幕功能');
					break;

					default: 
						trigger(result);
					break;
				}
			});
		});
	}
};

// 導出模塊
export default BiliBiliSendBarrage;