console.log('hello, I am contentJS');
function checkPage(){
	if(location.pathname != '/cn/TOEFLAPP'){
		chrome.runtime.sendMessage({type:'switch', content:'minorTab'}, function(rsp){
			console.log('get response from switch')
			location.reload(true)
		})
	}
}
checkPage()

let uName = '8532088';
let pwd = 'syd@85433650';

let accounts =[('3851636', 'Ido@1220!')]
uName = '3851636';
pwd = 'Ido@1220!';
function imgBase64(img, callback){
	let canvas=document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	let dataURL = canvas.toDataURL("image/png");
	callback(dataURL);
}

function listenImgLoad(){
	let img = $("#imgVerifycode");
	let vcodeInput = $('#input_vcode');
	let nameInput = $('#id_username');
	let pwdInput = $('#id_pwd');
	img.attr("crossOrigin", "anonymous");
	img.load(function(){
		imgBase64(this, function(dataURL){
			
			chrome.runtime.sendMessage({imgUrl:dataURL, type:'recognizeVerifyCode'}, function(response){
				chrome.runtime.sendMessage({type:'switch', content:'minorTab'}, function(rsp){
					console.log('get response from switch')
				})
				nameInput.focus();
				nameInput.val(uName);
				vcodeInput.focus();
				pwdInput.focus();
				pwdInput.val(pwd);
				vcodeInput.val(response.codes);
				vcodeInput.change();
			})
		});
	})
}

function listenVcodeUpdate(){
	//如果验证码更新，则点击登录
	let vcodeInput = $('#input_vcode');
	let loginBtn = $('#id_login');
	let val = '';
	vcodeInput.change(function(){
		val = vcodeInput.val();
		console.log('will login');
		if(val.length==4){
			//验证码输入完毕，开始登录
			// confirm(val + ' Right?');
			loginBtn.click();

			// setTimeout(function(){
			// 	loginBtn.click();
			// }, 1000);
		};
	});
}

function bindAll(){
	///绑定监听事件
	listenImgLoad();
	listenVcodeUpdate();
}

// let xhr = new XHLHttpRequest();
// console.log(xhr);
// $('#imgVerifycode').load(listenImgLoad)
bindAll();
$("#input_vcode").focus();
console.log('login.js loaded')
console.log('page title:'+$('title').html())
