/*!
 * app插件的主要对象，用于管理插件的整个生命周期
 */

let _stats={
	noLogin:'not-login',
	logined:'logined',
}

let _missions={
	login:'login',
}

let app={
	currentMission:null,
	currentState:null,
	_listeners:[],
	tabId:null,// current working tab id
	tab:null,
	_CODES:[],
	_DATA:{},
	status: 'closed',
};
/**
 * 删除所有事件监听
 * 关闭app打开的tab
 */
app.close=()=>{
	app.currentMission=null
	app._listeners.forEach(function(listener){
		listener.remove()
	})
	app.status='closed'
}

/**
 * @param  {base.Listener}
 */
app.addListener=(listener)=>{
	app._listeners.push(listener)
	listener.add();
}
/**
 * called when error hanpped
 * then stop the app and remove all event listeners
 */
app.error=(msg)=>{
	msg = msg || '发生错误，任务停止'
	app.close()
	chrome.notifications.create(undefined, {message:msg})
}

app.start=()=>{
	// start the message listener
	let _react = (request, sender, sendResponse)=>{
			// 监听tab发来的信息，根据type来分发处理
			console.log('get Message from ' + sender.id);
			if(request.type==='recognizeVerifyCode'){
				app.actions.recgnizeImage(request.imgUrl, function(codes_){
					sendResponse({codes:codes_, type:'code'});
					app._CODES[app.tabId]=codes_;
				});
			}if(request.type==='feedbackVerifyCode'){

			}else{
				message.danger('无法识别的消息类型：'+request.type)
			}
		return true;
	}
	let messageListener= base.Listener(chrome.runtime.onMessage, _react)
	console.log(chrome.runtime.onMessage)
	app.addListener(messageListener)
	app.addListener( base.Listener(chrome.tabs.onUpdated, app.tabUpdateRouter))
	app.status='started'
	
}

app.actions={}
app.actions.login=function(uname, pwd){
	let insertScripts=function(tab){
		if(app.tab==null && tab){
			app.tab=tab
		}
		chrome.tabs.executeScript(app.tab.id, {file: 'jquery.js'}, function(){
		});
		chrome.tabs.executeScript(app.tab.id, {file: "login.js"}, function(){
		});
	}
	if(app.tab){
		if(!tab.url.match(urls.login)){
			chrome.tabs.update(app.tab.id, {url: urls.login}, insertScripts)
		}else{
			insertScripts()
		}
	}else{
		chrome.tabs.create({url:urls.login}, insertScripts)
	}
	
}

app.actions.recgnizeImage=function(img_src, callback){
	// img_src = IMG_HOST + img_src;
	var url = apis.calculate
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
				message.error('500: 验证码识别失败');
			}
		}
	}
	xhr.onerror=()={
		app.error()
	}
	xhr.send(data);
}

app.actions.collectVerifyCodes=function(tab){

	if(app._DATA._RIGHT_CODE_COUNT==undefined){
		app._DATA._RIGHT_CODE_COUNT=0
	}

	if(tab.url.match(urls.home) !== null){
		//login successfully
		app._DATA._RIGHT_CODE_COUNT +=1
		feedback(app._CODES[tab.id])
		app._CODES[tab.id]=undefined
		if(app._DATA._MAX_RIGHT_CODE && app._DATA._RIGHT_CODE_COUNT < app._DATA._MAX_RIGHT_CODE){
			app.actions.login();
		}else{
			message.primary("达到最大正确数目：" + _RIGHT_CODE_COUNT);
			app._DATA._RIGHT_CODE_COUNT=undefined
			app._DATA._MAX_RIGHT_CODE=undefined
		}
	}else{
		//login failed
		app.actions.login()
	}
}

app.actions.inspectSeats=(tab)=>{
	if(tab.url.match(urls.seats)){
		chrome.tabs.executeScript(app.tab.id, {file: 'jquery.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'utils.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'seat.select.js'}, function(){});
		
	}else if(tab.url.match(urls.home)){
		chrome.tabs.executeScript(app.tab.id, {file: 'seat.open.js'}, function(){});
	}else{
		app.actions.login()
	}
}

app.tabUpdateRouter= function (tabId, changeInfo, tab){
	console.log(changeInfo)
	if ( tab.windowId===app.tab.windowId && tabId === app.tab.id && tab.status==="complete"){
		if(app.currentMission=='collectVerifyCodes'){
			app.actions.collectVerifyCodes()
		}if(app.currentMission=='inspectSeats'){
			app.actions.inspectSeats(tab)
		}
	}
}