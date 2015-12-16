window.onload = function(){
    var arr = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',0:'日'};
    var tianshu = [31,28,31,30,31,30,31,31,30,31,30,31];
    var pre = document.getElementById('pre');
    var next = document.getElementById('next');
    var cels = document.getElementsByClassName('xiao');
    var dates = document.getElementById('dates');
    var daytime = document.getElementById('daytime');
    var days = document.getElementById('days');
    var anpai = document.getElementById('anpai');
    var today=new Date();

    var ajax = function(e){
        var req = new XMLHttpRequest();
        req.open('get',e.url);
        req.send();
        req.onreadystatechange = function(){
            if(this.readyState == this.DONE && this.status == 200){
                e.success(this.response);
            }
        }

    }

    var todayday=today.getDate();
    var addClass=function(el,s){
        var tmp=el.getAttribute('class').split(' ');//分开放在数组里
        var dict={};//放已有的class
        for(var i=0;i<tmp.length;i++){
            dict[tmp[i]]=true;
        }
        if(!dict[s]){
            el.setAttribute('class',el.getAttribute('class')+' '+s);
        }
    };
    var removeClass=function(el,s){
        var tmp=el.getAttribute('class').split(' ');
        var dict={};
        for(var i=0;i<tmp.length;i++){
            dict[tmp[i]]=true;
        }
        delete dict[s];
        var ns='';
        for(var name in dict){
            ns+=' '+name;
        }
        el.setAttribute('class',ns);
    };

    var isrunnian=function(year){
        if(year%4==0&&year%100!=0||year%400==0){
            return true;
        }else{
            return false;
        }
    };
    //先设置一个假数用来引出如何算当前的目标年月日
    var previousDay=function(){
        var currentyear=today.getFullYear(),
            currentmonth=today.getMonth(),
            currentdate=today.getDate();
        var targetyear,targetmonth,targetdate,
            targetdate=currentdate-1;
        if(targetdate==0){
            targetyear=currentyear;
            targetmonth=currentmonth-1;//先把当前日期减1
            if(targetmonth==-1){
                targetyear=currentyear-1;
                targetmonth=11;
            }
            if(targetmonth==1){
                if(isrunnian(targetyear)){
                    tianshu[1]=29;
                }
            }
            targetdate=tianshu[targetmonth];//把固定数31换成数组中的元素
        }else{
            targetmonth=currentmonth;
            targetyear=currentyear;
        }
        today=new Date(targetyear,targetmonth,targetdate);
    };
    var shangyige;
    var ondatechange=function(e){
        if(shangyige){
            shangyige.style.color="black";
        }
        var changec=today.getDate();
        var el=document.getElementById('d'+ changec);
        //el.style.color='red';
        shangyige=el;
        dates.innerHTML=today.getDate();
        anpai.innerHTML='星期'+arr[today.getDay()];
        daytime.innerHTML=today.getFullYear()+'年'+(today.getMonth()+1)+'月'+today.getDate()+'日';
        days.innerHTML=today.getFullYear()+'年'+(today.getMonth()+1)+'月'+today.getDate()+'日'+'星期'+arr[today.getDay()];
        var asd=function(){
            return today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        }
        //console.log(asd());

        var close = document.getElementById('close');
        var big = document.getElementById('big');
        var fangda = document.getElementById('fangda');
        var leftdown = document.getElementById('leftdown');
        ajax({
            url:'http://localhost/fax?time='+asd()+'&b=2',
            success:function(res){
                leftdown.innerHTML ='';
                if( res !== 'none'){
                    var res = JSON.parse(res);
                    for(var i = 0 ; i < res.length ; i++){
                        var tu = document.createElement('div');
                        tu.setAttribute('class','imga');
                        tu.style.background ='url(./IMG/'+res[i]+')';
                        tu.style.backgroundSize = 'cover';
                        leftdown.appendChild(tu);
                        var picture = document.getElementsByClassName('imga');
                        picture[i].index = i;
                        picture[i].onclick = function(){
                            fangda.style.display = 'block';
                            big.style.background = 'url(./IMG/'+res[this.index]+')';
                            big.style.backgroundSize = 'cover';
                        }
                        close.onclick = function(){
                            fangda.style.display = 'none';
                        }
                    }
                }
            }
        });
    };


    var nextDay=function(){
        var currentyear=today.getFullYear(),
            currentmonth=today.getMonth(),
            currentdate=today.getDate();
        var targetyear,targetmonth,targetdate,
            targetdate=currentdate+1;
        if(currentmonth==1){
            if(isrunnian(currentyear)){
                tianshu[1]=29;
            }
        }
        if(targetdate>tianshu[currentmonth]){
            targetmonth=currentmonth+1;
            targetyear=currentyear;
            if(targetmonth==12){
                targetmonth=0;
                targetyear=currentyear+1;
            }
            targetdate=1;
        }else{
            targetmonth=currentmonth;
            targetyear=currentyear;
        }
        today=new Date(targetyear,targetmonth,targetdate);
    };


    var rili=function(){
        shangyige='';
        var i=0;
        //画前一个月的
        var tmp=today.getDate();
        today.setDate(1);
        var xingqi=today.getDay();
        L=xingqi==0?6:xingqi-1;
        if(today.getMonth()-1== -1){
            var lastmonthday=31;
        }else{
            var lastmonthday=tianshu[today.getMonth()-1];
        }
        today.setDate(tmp);
        for(;i<L;i++){
            cels[i].innerHTML=lastmonthday-(L-i-1);
            cels[i].style.color='#ccc';
            cels[i].removeAttribute('id');
            cels[i].setAttribute('pr',true);
        }

        //画当月的
        for(;i<tianshu[today.getMonth()]+L;i++){
            cels[i].innerHTML=i-L+1;
            cels[i].setAttribute('id','d'+(i-L+1));
            cels[i].style.color='black';
            cels[i].removeAttribute('pr',true);
            cels[i].removeAttribute('nx',true);
        }
        //画后一个月的
        var D=i;
        for(;i<42;i++){
            cels[i].setAttribute('nx',true);
            cels[i].innerHTML=i-D+1;
            cels[i].style.color='#ccc';
            cels[i].removeAttribute('id');
        }
    };
    rili();
    ondatechange();
    for(var i=0;i<cels.length;i++){
        cels[i].onclick=function(){
            var a=today.getFullYear(),
                b=today.getMonth(),
                c=today.getDate();
            if(this.hasAttribute('id')){
                today.setDate(this.innerHTML);
                ondatechange();
            }else if(this.hasAttribute('pr')){
                //根据a,b,c得到逻辑正确的x,y,z
                var z=this.innerHTML;
                var y=b-1;
                var x=a;
                today=new Date(x,y,z);
                rili();
                ondatechange();
            }else if(this.hasAttribute('nx')){
                var z=this.innerHTML;
                var y=b+1;
                var x=a;
                today=new Date(x,y,z);
                rili();
                ondatechange();
            }
        };
    }

//-----------左右点击------------
    pre.onclick = function(){
        previousDay();
        rili();
        ondatechange();
    }
    next.onclick = function(){
        nextDay();
        rili();
        ondatechange();
    }
//------------------------------------------
    var els=today.getDate();
    var el=document.getElementById('d'+ els);
    for(var i=0;i<cels.length;i++){
        el.style.color = 'red';
    }
//-------------------------------------------------------------
    var setday=document.getElementById('history');
    setday.onclick=function(){
        today=new Date();
        rili();
        ondatechange();
    }

    //--------------------------------------------
    var yuan = document.getElementById('yuan');
    var line = document.getElementById('line');
    var dangqian = document.getElementById('dangqian');
    var jisuan =function(){
        var ww = new Date();
        var h = ww.getHours();
        var m = ww.getMinutes();
        var s = ww.getSeconds();
        var shijiantiao = Number(h*3600+m*60+s)/3600;
        line.style.top = Math.floor(shijiantiao*43.1)+'px';
        yuan.style.top = Math.floor(shijiantiao*44)+'px';
        dangqian.innerHTML = h+':'+m;
    };
    setInterval(jisuan,10);
//一行代码的长度保障打印到纸上不换行 不出现横向滚动条

















}