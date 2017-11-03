console.log($)

function _get_name(list){
    list = $(list)
    return list.find('.name>a').text()
}

function _get_first_day(){
    // 获取本周星期一的日期
    d = new Date()
    while(d.getDay()>0){
        d.setDate(d.getDate()-1)
    }
    return d
}

function _parse_date(work_ele){
    completed_time = ele.find('.completed-time').data('readable-time')
    if(completed_time){
        time = completed_time.split('+')[0]
        time = time.split('T')
        date = time[0].split('-')
        clock = time[1].split(':')
        completed_time=new Date(date[0], date[1], date[2], clock[0], clock[1])
    }
    return completed_time

}

function _get_date_range(){
    //上周的日期范围
    first_day = _get_first_day()
    range0=new Date(first_day.getTime())
    range0.setDate(range0.getDate()-7)
    range0.setHours(0)
    range1=new Date(first_day.getTime())
    range1.setDate(range1.getDate()-1)
    range1.setHours(23)
    range1.setMinuts(59)
    return [range0, range1]
}

function _get_works(list){
    todos = $(list).find('div.todo-wrap')
    work = {name:null, finished_time: null}
    rtn = []

    todos.each(function(key, ele){
        ele = $(ele)
        last_ele = null
        completed_time = ele.find('.completed-time').text()
        name = ele.find('.todo-rest').text()
        last_ele = ele
    })
}

function _expand_list(list){
    //判断list是否包含上周全部工作
    //如果没有，展开列表， 需要等待加载
    todos = $(list).find('div.todo-wrap')
    last = $(todos[todos.length - 1])
    range=_get_date_range()
    // more = [1]
    if(_parse_date(last)>range[0] ){
        more = list.find('a.link-more-completed')
        if(more.length>0){
            more.click()
            return true
        }else{
            return undefined
        }
    }
}



function get_lists(){
    var todolist=$('.todolists-wrap');
    var lists = $('.todolist.ui-sortable');
}