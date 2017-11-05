/*!
 * 提供一些基础类和方法
 */
let base={};

/**
 * @param {function} [add] - method to add listener
 * @param {function} [remove] - method to remove listener 
 */
base.Listener=(event, react)=>{
	let ltn={}
	ltn.add=()=>{
		event.addListener(react)
	}
	ltn.remove=()=>{
		event.removeListener(react)
	}
	return ltn
}

// get warnings
let utils={}
utils.getWarning=()=>{
	return $('.'+classNames.alert).text()
}

utils.imgBase64=(img, callback)=>{
	var canvas=document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	var dataURL = canvas.toDataURL("image/png");
	callback(dataURL);
}

minorTab=()=>{
	
}