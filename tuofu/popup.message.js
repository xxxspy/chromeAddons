let message={}

// <p class="bg-primary">...</p>
// <p class="bg-success">...</p>
// <p class="bg-info">...</p>
// <p class="bg-warning">...</p>
// <p class="bg-danger">...</p>
message._message=(type, content)=>{
	let clsName = 'bg-'+type;
	let msgP=$('#message')
	let duration = 3000;
	msgP.addClass(clsName)
	msgP.html(content)
	msgP.show()
	setTimeout(function(){
		msgP.removeClass(clsName)
		msgP.html("")
		msgP.hide()
	}, duration)
}

message.primary=(content)=>{
	message._message('primary', content)
}

message.success = (content)=>{
	message._message('success', content)
}
message.info = (content)=>{
	message._message('info', content)
}
message.warning = (content)=>{
	message._message('warning', content)
}
message.danger = (content)=>{
	message._message('danger', content)
}

///////////////////////////////////////
let progress={
	proDiv: $('#progress-div-id'),
	proBar: $('#progress-bar-id')
}
progress.show = ()=>{
	progress.proDiv.show()
}

progress.hide=()=>{
	progress.proDiv.hide()
}

progress.progress=(step)=>{
	let outterWidth=parseInt(progress.proDiv.css('width'));
	step = step || 1;
	step = parseInt(step / 100 * outterWidth)
	let now = progress.proBar.css('width')
	now = now ? parseInt(now):0
	now = now + step;
	progress.proBar.css('width', now + "px")
}

progress.setValue=(value)=>{
	if (typeof(value)=="string"){
		value = value.endWidth('%') ? value: value + '%';
	}else{
		value = value + '%'
	}
	progress.proBar.css('width', value )
}
