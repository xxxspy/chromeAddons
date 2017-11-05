let savBtn=$('#save')
let nameInp=$('#username')
let pwdInp=$('#password')
let inspectBtn=$('#inspecting')
let stopIBtn=$('#stop-inspecting')
let send=(message)=>{
    chrome.runtime.sendMessage(message, function(){
        console.log('message sended')
    })
}


savBtn.click(function(){
    if(savBtn.text()=='保存'){
        if(nameInp.val() && pwdInp.val()){
            savBtn.html('编辑')
            nameInp.attr('readonly', 'readonly')
            pwdInp.attr('readonly', 'readonly')

        }else{
            message.warning('用户名和密码不能为空')
            return false
        }
    }else{
        savBtn.html('保存')
        nameInp.removeAttr('readonly')
        pwdInp.removeAttr('readonly')
    }
})

inspectBtn.click(function(){
    send({type:'mission', content:'inspectSeats'})
})

stopIBtn.click(function(){
    send({type:'mission', content:'stop'})
})