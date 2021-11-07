'use strict';

/**
 * @param {object} configs 身份配置
 * @param {number} ROOMID 房间号码
 * @param {string} CSRF 消息校验
 * @param {string} COOKIE 身份校验
 * @param {string} message 弹幕消息
 * @param {function} callback 响应回调
*/

const [{ request }, { EventEmitter }] = [
	require('http'),
	require('events')
]

class BiliBiliSendBarrage extends EventEmitter {
	static eventTrigger = null;
	static eventListener = null;
	static globalConfigs = null;
	
	constructor(configs) {
		super(configs);

		BiliBiliSendBarrage.trigger = message => super.emit('callback', message);
		BiliBiliSendBarrage.listener = callback => super.addListener('callback', callback);

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

		BiliBiliSendBarrage.globalConfigs = Object.assign({ requestConfig }, { configs });
	}

	send(message) {
		if(message) {
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

${BiliBiliSendBarrage.globalConfigs.configs.ROOMID}
------WebKitFormBoundary8kjTT7jRU64detOB
Content-Disposition: form-data; name="csrf"

${BiliBiliSendBarrage.globalConfigs.configs.CSRF}
------WebKitFormBoundary8kjTT7jRU64detOB--
Content-Disposition: form-data; name="csrf_token"

${BiliBiliSendBarrage.globalConfigs.configs.CSRF}
------WebKitFormBoundary8kjTT7jRU64detOB--
`;

			const request = BiliBiliSendBarrage.createRequest(BiliBiliSendBarrage.globalConfigs.requestConfig);

			request.write(data);
			request.end();
		} else 
		BiliBiliSendBarrage.trigger('未提供弹幕内容');
	}
	
	addListener(callback) {
		BiliBiliSendBarrage.listener(callback);
	}
	
	static createRequest(requestConfig) {
		return request(requestConfig, socket => {
			socket.on('data', message => {
				const [result, { trigger }] = [
					JSON.parse(message),
					BiliBiliSendBarrage
				];
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
					
					default: 
						trigger(result.message);
					break;
				}
			});
		});
	}
};

module.exports = BiliBiliSendBarrage;
new BiliBiliSendBarrage()
