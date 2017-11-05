
let pageTitles={
	languageChoose:'教育部考试中心托福网考网上报名  NEEA TOEFL iBT Online Registration',
	login:'教育部考试中心托福网考网上报名 - 登录',
	home:'教育部考试中心托福网考网上报名 - 我的首页',
	checkSeat:'教育部考试中心托福网考网上报名 - 查找考场和考试时间',
	registerSeat:'教育部考试中心托福网考网上报名 - 注册考试 - 查看名额',

}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log('get message:')
	console.log(request)
	let send=(pageTitle){
		sendResponse({page:pageTitle, type:request.type})
	}
	if(request.type==='checkPage'){
		console.log(document.page)
		if(document.title.indexOf(pageTitles.languageChoose)>=0){
			return send(pageTitles.languageChoose)
		}else if(document){

		}
	}
})