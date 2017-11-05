let YEAR='2017'
let MONTH='09'
let DAY='30'
let CITY='Beijing'
let dateValue=YEAR + MONTH + DAY

let btns =$('input[type="submit"]')
let availabel_seats=0
btns.each(function(i, btn){
	btn = $(btn)
	if(!btn.attr('class') && btn.attr('onclick')){
		if(btn.attr('onclick').indexOf(dateValue)>0){
			availabel_seats +=1
		}
	}
})

if(availabel_seats>0){
	alert('还有考位：'+availabel_seats)
}else{
	// alert('已经没有考位了')
	setTimeout(function(){
		location.reload(true)
	}, 10*1000)
}