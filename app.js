var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.static('public'));
var fs = require('fs');
var photocase = {} ;
fs.readdir('./public/img/',function(err,files){
    console.log(files);	//这是一个数组
    for(var i = 0 ; i < files.length ; i ++ ){
        fs.stat('./public/img/'+files[i],(function(i){
            return	function(err,info){		//参数和信息
                var mtime = info.mtime ;
                var key  = mtime.getFullYear()+'_'+(mtime.getMonth()+1)+'_'+mtime.getDate() ;
                //console.log(key);
                if( !photocase[key] ){
                    photocase[key]=[];
                }
                photocase[key].push(files[i]);

            }
        })(i));
    }
});

app.get('/fax',function(req,res){
    //console.log(req.query.time);
    if(photocase[req.query.time]){
        res.json(photocase[req.query.time]);
    }else{
        res.send('none');
    }
});
//json   {} [] [{}] {[]}
//send   14 '我是中国人'
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');  //  /  sendFile
});

http.listen(80,function(){
    console.log('listening on *:80');
});

