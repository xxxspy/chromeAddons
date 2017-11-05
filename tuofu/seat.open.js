var nav=document.getElementById('leftnav')
var links = nav.getElementsByTagName('a')
var aim_link=null
links.forEach(function(a){
	if(a.getAttribute('href')=='/cn/CityAdminTable'){
		aim_link=a
	}
})

if(aim_link){
	aim_link.click()
}

console.log(a)
console.log(aim_link)
alert('seta.open.js')