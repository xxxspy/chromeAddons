var YEAR='2017'
var MONTH='09'
var DAY='30'
var CITY='Beijing'
var dateValue=YEAR + MONTH
var codeImg=$('img[onclick="location.reload();"]')
var vcodeInput=$('input[name="afCalcResult"]')
var btn=$('input[src="/images/Continue_button_cn.gif"]')
$('input[value="'+ dateValue +'"]').click()
$('input[value="'+ CITY +'"]').click()
if($('body').html().indexOf('Internal Error')>=0){
	location.reload()
}
function action(){
	console.log('action')

	codeImg.attr("crossOrigin", "anonymous");
	utils.imgBase64(codeImg[0], function(dataURL){
		
		chrome.runtime.sendMessage({imgUrl:dataURL, type:'recognizeVerifyCode'}, function(response){
			console.log('get response from recognizeVerifyCode')
			chrome.runtime.sendMessage({type:'switch', content:'minorTab'}, function(rsp){
				console.log('get response from switch')
				vcodeInput.focus();
				vcodeInput.val(response.codes);
				// setTimeout(function(){
					btn.click();
				// }, 1000);
			})
		})
	});
}

let spans=document.getElementsByClassName('Alert')
if(spans[0].textContent.indexOf('Please query seats in')>=0){
	setTimeout(function(){
		action()
	}, 31*1000)
}else{
	setTimeout(function(){
		action()
	}, 1)
}
