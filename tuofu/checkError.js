let spans=document.getElementsByClassName('Alert')
let waitTime=0
if(spans.length>0){
	// error hanppend
	if(spans[0].textContent.indexOf('You do not have enough money')>=0){
		alert('You do not have enough money.\n app stopped')
		chrome.runtime.sendMessage({type:'mission', content:'stop'}, function(rsp){
		})
	}else if(spans[0].textContent.indexOf('Please query seats in')>=0){
		// chrome.runtime.sendMessage({type:'mission', content:'wait'}, function(rsp){})
		waitTime=1000
	}
}

