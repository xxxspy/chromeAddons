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
	currentJob:null, // subMission of Mission
	currentState:null,
	_listeners:[],
	tabId:null,// current working tab id
	tab:null,
	notificationId:null,
	minorTab:false,
	_CODES:[],
	_DATA:{},
	status: 'closed',
	msgListener:null,
};
/**
 * 删除所有事件监听
 * 关闭app打开的tab
 */
app.close=()=>{
	app._listeners.forEach(function(listener){
		listener.remove()
	})
	app._listeners=[]
	app.currentMission=null
	app.status='closed'
	app.minorTab=false
}

app.tabUpdate=(callback)=>{
	if(app.tab){
		chrome.tabs.query({'id': app.tab.id}, function (tabs) {
		    app.tab= tabs[0]
		  	if(callback){
		  		callback()
		  	}
		})
	}
}

/**
 * called when error hanpped
 * then stop the app and remove all event listeners
 */
app.error=(msg)=>{
	msg = msg || '发生错误，任务停止'
	if(typeof(msg)!='string'){
		msg=JSON.stringify(msg)
	}
	console.log(msg)
	app.close()
	chrome.notifications.create(app.notificationId, {message:msg, 
													type:'basic', 
													title:'Error', 
													iconUrl:'btn.ico'},
		(notificationId)=>{
		app.notificationId=notificationId
	})
}

/**
 * @param  {base.Listener}
 */
app.addListener=(listener)=>{
	app._listeners.push(listener)
	listener.add();
}

app.start=()=>{
	// start the message listener
	let _msg_router = (request, sender, sendResponse)=>{
			// 监听tab发来的信息，根据type来分发处理
			console.log('get Message from ' + sender.id);
			console.log(request)
			if(request.type==='recognizeVerifyCode'){
				app.actions.recgnizeImage(request.imgUrl, function(codes_){
					sendResponse({codes:codes_, type:'code'});
					app._CODES[app.tabId]=codes_;
				});
			}else if(request.type==='switch'){
				if(request.content=='minorTab'){
					console.log('minnorTab is true')
					app.minorTab=true
				}
				sendResponse({type:'switch'})
			}else if(request.type==='feedbackVerifyCode'){
				console.error('not impleted yet')
			}else if(request.type==='mission'){
				app.currentMission=request.content
				if(app.currentMission!='stop'){
					app.status='started'
					app.actions.login()
				}else{
					app.close()
				}
			}else{
				message.danger('无法识别的消息类型：'+request.type)
			}
		return true;
	}
	//msgListener will be open forever
	//no matter app is closed
	app.msgListener= base.Listener(chrome.runtime.onMessage, _msg_router)
	app.msgListener.add()

	// app.addListener(messageListener)
	app.addListener( base.Listener(chrome.tabs.onUpdated, app.tabUpdateRouter))
	app.status='started'
}

app.actions={}
app.actions.startMission=(mission)=>{
	app.currentMission=mission
	app.actions.login()
}

app._addTabCloseHandler=(tab)=>{
	let _close=(tabId, removeInfo)=>{
		if(tabId==tab.id){
			console.log('tab closed')
			app.close()
		}
		console.log('chrome.tabs.onRemoved')
	}
	let listener=base.Listener(chrome.tabs.onRemoved, _close)
	app.addListener(listener)
}

app.actions.login=function(uname, pwd){
	app.minorTab=false
	console.log('will login..................................')
	let insertScripts=function(tab){
		console.log('inject login scripts>>>>>>>>>>>>>>>>>>>>>')
		console.log(app.tab)
		console.log(tab)
		if(app.tab==null && tab){
			app.tab=tab
			app._addTabCloseHandler(tab)
		}
		chrome.tabs.executeScript(app.tab.id, {file: 'jquery.js'}, function(){
			console.log('jquery injected')
		});
		chrome.tabs.executeScript(app.tab.id, {file: "login.js"}, function(){
			console.log('login.js injected')
		});
	}
	if(app.tab){
		if(app.checkPage(app.tab)!==pageTitles.login){
			// console.log(app.checkPage(app.tab))
			console.log('update page')
			chrome.tabs.update(app.tab.id, {url: urls.login})
			insertScripts()
		}else{
			console.log('not update page')
			insertScripts()
		}
	}else{
		console.log('create new tag>>>>>>>>>>>>>>>>>>>>>')
		chrome.tabs.create({url:urls.login}, insertScripts)
	}

	app.checkTab=function(){
		if(app.currentJob!='login'){
			return
		}
		if(app.checkPage(app.tab)==pageTitles.home){
			app.minorTab=false
			app.checkTab=null
			console.log('login success')
			alert('login success')
		}else if(app.checkPage(app.tab)==pageTitles.login || app.tab.url.indexOf(urls.login)>=0){
			app.actions.login()
			app.minorTab=true
		}else{
			console.log(app.tab)
		}
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
	xhr.onerror=function(){
		app.error('获取验证码错误！')
	}
	xhr.send(data);
}

app.actions.collectVerifyCodes=function(tab){

	if(app._DATA._RIGHT_CODE_COUNT==undefined){
		app._DATA._RIGHT_CODE_COUNT=0
	}

	if(tab.url.match(urls.home) !== null || app.checkPage(tab)==pageTitles.home){
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
		console.log('login failed , login again')
		app.actions.login()
	}
}

app.actions.inspectSeats=(tab)=>{
	console.log('head of inspectSeats')
	cp=app.checkPage
	if(cp(tab)==pageTitles.checkSeat){
		console.log('select date and address')
		app.minorTab=false
		chrome.tabs.executeScript(app.tab.id, {file: 'jquery.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'utils.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'seat.select.js'}, function(){});
	}else if(cp(tab)==pageTitles.home){
		console.log('will open seat inspect')
		// chrome.tabs.executeScript(app.tab.id, {file: 'seat.open.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file:'checkError.js'},function(){
			app.minorTab=true
			chrome.tabs.update(app.tab.id, {url: urls.seats}, function(){
				
			})
		})
	}else if(cp(tab)==pageTitles.login){
		app.actions.login(tab)
	}else if(cp(tab)==pageTitles.registerSeat){
		chrome.tabs.executeScript(app.tab.id, {file: 'jquery.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'utils.js'}, function(){});
		chrome.tabs.executeScript(app.tab.id, {file: 'seat.inspect.js'}, function(){
			console.log('injected seat.inpsect.js')
		})
	}else{
		console.log(tab)
		console.error('无法确定打开的是什么页面')
	}
}

app.tabUpdateRouter= function (tabId, changeInfo, tab){
	
	console.log(changeInfo)
	console.log(app.minorTab)
	if(app.status=='closed' || app.minorTab==false){
		// if(tab.windowId===app.tab.windowId && tabId === app.tab.id && tab.status==="complete"){
		// 	if(app.status!='closed' && app.checkTab){
		// 		console.log('check success00000000000000000000000000000000000')
		// 		app.checkTab(tab)
		// 	}	
		// }
		return
	}

	if ( tab.windowId===app.tab.windowId && tabId === app.tab.id && tab.status==="complete"){
		app.tab=tab
		console.log('tabUpdateRouter==========this should called only once===========')
		if(app.currentMission=='collectVerifyCodes'){
			console.log('collectVerifyCodes action started 8********************')
			app.actions.collectVerifyCodes()
		}else if(app.currentMission=='inspectSeats'){
			app.actions.inspectSeats(tab)
		}
	}
	// app.minorTab=false
}

app.checkPage=(tab)=>{
	console.log(tab)
	console.log('checkPage:'+tab.title)
	console.log('checkpage:' + tab.url)
	for(titleName in pageTitles){
		if(tab.title.indexOf(pageTitles[titleName])>=0){
			let r= pageTitles[titleName]
			return (r)
		}else if(tab.url.indexOf(urls.login)>=0 && !tab.title){
			return pageTitles.login
		}
	}
	// not recgnize url
	
}

app.start()
window.addEventListener('error', function(message){
	app.error(message)
}, false)

// throw 'test error'
// 
// console.error=()=>{
// 	console.log('error hanpped............................')
// }