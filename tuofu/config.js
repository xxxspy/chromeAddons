let urls = {};
let apis = {};
urls.host='https://toefl.etest.net.cn/';
urls.language='cn'
urls.login = urls.host+ urls.language+'/TOEFLAPP';
urls.home = urls.host + urls.language + '/MyHome';
urls.seats = urls.host + urls.language + '/CityAdminTable';
apis.host='http://127.0.0.1:3303/';
apis.feedback = apis.host + 'feedback/';
apis.calculate = apis.host + 'calculate/';

// error message
let errorMessage={}
//  You do not have enough money
errorMessage.noMoney='You do not have enough money'
errorMessage.noLogin='Please login first'
errorMessage.loginexpired='Your session has expired'
errorMessage.wrongVerifycode='VerifyCode incorrect'
errorMessage.waitQuerySeats='Please query seats in'
errorMessage.seatNotExist='您要预定的座位已经不存在了'


// classes
let classNames={}
classNames.alert='Alert'

let accounts =[('3851636', 'Ido@1220!')]

let pageTitles={
	languageChoose:'教育部考试中心托福网考网上报名  NEEA TOEFL iBT Online Registration',
	login:'教育部考试中心托福网考网上报名 - 登录',
	home:'教育部考试中心托福网考网上报名 - 我的首页',
	checkSeat:'教育部考试中心托福网考网上报名 - 查找考场和考试时间',
	registerSeat:'教育部考试中心托福网考网上报名 - 注册考试 - 查看名额',
}