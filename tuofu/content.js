console.log('hello, I am contentJS');
var uName = '8532088';
var pwd = 'syd@85433650';
function imgBase64(img, callback){
	var canvas=document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	var dataURL = canvas.toDataURL("image/png");
	callback(dataURL);
}



function listenImgLoad(){
	var img = $("#imgVerifycode");
	var vcodeInput = $('#input_vcode');
	var nameInput = $('#id_username');
	var pwdInput = $('#id_pwd');
	img.attr("crossOrigin", "anonymous");
	img.load(function(){
		imgBase64(this, function(dataURL){
			chrome.runtime.sendMessage({imgUrl:dataURL, type:'recognizeVerifyCode'}, function(response){
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
	var vcodeInput = $('#input_vcode');
	var loginBtn = $('#id_login');
	var val = '';
	vcodeInput.change(function(){
		val = vcodeInput.val();
		console.log('will login');
		if(val.length==4){
			//验证码输入完毕，开始登录
			// confirm(val + ' Right?');
			// loginBtn.click();

			setTimeout(function(){
				loginBtn.click();
			}, 2000);
		};
	});
}

function bindAll(){
	///绑定监听事件
	listenImgLoad();
	listenVcodeUpdate();
}

// var xhr = new XHLHttpRequest();
// console.log(xhr);
// $('#imgVerifycode').load(listenImgLoad)
bindAll();
$("#input_vcode").focus();
