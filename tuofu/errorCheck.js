let check = {}
let errorHandlers = {}

check.urlDispatch=function(dispatch){
	let funcs =[];
	chrome.tabs.getCurrent(tab =>{
		if(tab.url.match(TOEFL_HOME_URL) !== null){
			funcs = dispatch[TOEFL_HOME_URL] || [];
			funcs.forEach(function(f){f()});
		}else if(tab.url.match(TOEFL_LOGIN_URL) !== null){
			funcs = dispatch[TOEFL_LOGIN_URL] || [];
			funcs.forEach(function(f){f()});
		}
	});
}


class BaseErrorHandler{
	constructor(){
	}

	condition(){
		return true;
	}

	handler(){
		return
	}

	check(){
		//执行检查并触发handler
		if(this.condition()){
			this.handler()
		}
	}
}

