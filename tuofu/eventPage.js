let lastTabeId = -1;
let TOEFL_LOGIN_URL = urls.login
let TOEFL_HOME_URL = urls.home
let FEEDBACK_URL = apis.feedback
let CAL_API = apis.calculate
let _TASKS={feedback: '验证码识别反馈，获取更多标注过的训练图片'};
let TASK = 'feedback';
let _CODES={};// cache the codes for each tab, key is the tab id
let _RIGHT_COUNT = 0;
// let LISTENERS = {};
let tabLsns={};//针对tab的监听事件门
let D={};//一些共享数据，data的缩写；
D.tabId=null;
D.winId=null;


function sendMessage(){
	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		lastTabeId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabeId, "Background page started!");
	})
}

function recgnizeImage(img_src, callback){
	// img_src = IMG_HOST + img_src;
	var url = CAL_API ;
	img_src = img_src.replace("data:image/png;base64,", "");
	var data = 'img_url='+encodeURIComponent(img_src);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange=function(){
		// console.log(xhr);
		if(xhr.readyState === XMLHttpRequest.DONE && xhr.status===200){
			var resp = JSON.parse(xhr.responseText);
			if(resp['status']==='success'){
				callback(resp['codes']);
			}else{
				console.error('fail to recgnize codes');
			}
		}
	}
	xhr.send(data);
	// callback('bacd')
}

function exeLoginScripts(tab){
	D.tabId = tab.id;
	D.winId = tab.windowId;
	chrome.tabs.onUpdated.removeListener(tabLsns.update);
	

	chrome.tabs.executeScript(tab.id, {file: 'jquery.js'}, function(){
		sendMessage();
	});
	chrome.tabs.executeScript(tab.id, {file: "content.js"}, function(){
		console.log('Listerning the image...')

	});
	chrome.tabs.onUpdated.addListener(tabLsns.update);
};

chrome.browserAction.onClicked.addListener(function(){
	if(D.tabId !== null){
		// still has listeners
		removeAllListeners();

		// remove  tab
		chrome.tabs.remove(D.tabId, function(){
			D.tabId = null;
			D.winId = null;
		})
	};

	chrome.tabs.create({url:TOEFL_LOGIN_URL}, exeLoginScripts);
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	// 监听tab发来的信息，根据type来分发处理
	console.log('get Message from ' + sender.id);
	recgnizeImage(request.imgUrl, function(codes_){
		console.log('get codes: '+codes_);
		sendResponse({codes:codes_, type:'code'});
		_CODES[D.tabId]=codes_;
		console.log('set codes ..');
		console.log(_CODES);
	});
	return true;
})

function restartAtLogin(){
	if(D.tabId !== null){
		chrome.tabs.update(D.tabId, {url: TOEFL_LOGIN_URL}, exeLoginScripts);
	}else{
		// 'D.tabId is null!, can not restart at this tab.'
		chrome.tabs.getCurrent(function(tab){
			chrome.tabs.update(tab.id, {url:TOEFL_LOGIN_URL}, exeLoginScripts)
		});
	}
}

function feedback(codes, callback){
	console.log('feedback...........')
	var xhr = new XMLHttpRequest();
	var data = 'codes='+codes;
	var url = FEEDBACK_URL + '?' + data;
	xhr.open('GET', url, true);
	xhr.onreadystatechange=function(){
		// console.log(xhr);
		if(xhr.readyState === XMLHttpRequest.DONE && xhr.status===200){
			var resp = JSON.parse(xhr.responseText);
			if(resp['status']==='success'){
				console.log('success to feedback');
			}else{
				console.error('fail to feedback');
			}
		}
	}
	xhr.send();
}

tabLsns.update= function (tabId, changeInfo, tab){
	if ( tab.windowId===D.winId && tabId === D.tabId && tab.status==="complete"){
		console.log('checking url ...................')
		console.log(tab);
		console.log(tab.url);
		console.log(tab.url.match(TOEFL_HOME_URL));
		if(tab.url.match(TOEFL_HOME_URL) !== null){
			// yes ,logined sucessfully
			// alert('congratulations!')
			_RIGHT_COUNT += 1;
			console.log('yes find...................')
			console.log('check _CODES')
			console.log(_CODES)
			console.log(tab.id)
			feedback(_CODES[tab.id]);
			_CODES[tabId]=undefined;
			// chrome.tabs.onUpdated.removeListener(tabLsns.update);s
			
			// if(confirm('Rights codes! Continue?') && _RIGHT_COUNT < 10){
			if( _RIGHT_COUNT < 100){
				console.log('try agian.')
				restartAtLogin();
			}else{
				alert("达到最大正确数目：" + _RIGHT_COUNT);
				removeAllListeners();
				console.log('mission droped.')
			}
		}else if(tab.url.match(TOEFL_LOGIN_URL) !== null){
			// no, wrong verifying codes
			// if(confirm('Obviously, wrong codes! Continue?')){
			console.log('no not right ........................')
			if(true){
				console.log('try agian.')
				exeLoginScripts(tab);
			}else{
				removeAllListeners();
				console.log('mission droped.')
			}
		}
	}
}

function removeAllListeners(){
	chrome.tabs.onUpdated.removeListener(tabLsns.update);
}

chrome.windows.onRemoved.addListener(function(wid){
	// 当窗口关闭时，我们应当关闭所有的监听事件
	if(wid === D.winId){
		removeAllListeners();
		D.winId = null;
		D.tabId = null;
		console.log('All Listeners closed!');
	}
})

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
	if(tabId===D.tabId){
		console.log('Tab is closed, diable all listeners.')
		removeAllListeners();
	}
})

