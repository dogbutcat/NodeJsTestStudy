/**
 * Created by oliver on 4/3/16.
 */
/*
var urlparse = require('url').parse,
    http = require('http'),
    fs = require('fs');
function download(url,savefile,callback){
    console.log('download',url,'to',savefile);
    var urlinfo = urlparse(url);
    var options = {
        method:'get',
        host:urlinfo.host,
        path:urlinfo.pathname
    };
    if (urlinfo.port){
        options.port=urlinfo.port;
    }
    if (urlinfo.search){
        options.path +=urlinfo.search;
    }
    var req = http.request(options, function (res) {
        var writestream = fs.createWriteStream(savefile);
        writestream.on('close', function () {
            callback(null,res);
        });
        res.pipe(writestream);
    });
    req.end();
}*/
var urlparse = require('url').parse,
    http = require('http'),
    fs = require('fs');

/*function download(url, savefile, callback) {
    var urlInfo = urlparse(url),options={host:urlInfo.host,method:'get',path:urlInfo.pathname};
    urlInfo.port?options.port=urlInfo.port:'';
    urlInfo.search?options.pathname+=urlInfo.search:'';
    var req = http.request(options,function (res) {
        var ws = fs.createWriteStream(savefile);
        ws.on('close',function () {
            callback.call(null, null, res);
        });
        ws.on('error',function (err) {
            callback.call(null,err, res);
        })
        res.pipe(ws);
    });
    req.end();
}*/

function download(url, savefile, cb) {
    var urlInfo = urlparse(url),options = {
        host:urlInfo.host,
        method:'get',
        path:urlInfo.pathname
    };
    urlInfo.port?options.port=urlInfo.port:null;
    urlInfo.search?options.pathname+=urlInfo.search:null;
    var req = http.request(options,(res)=>{
        "use strict";
        var ws = fs.createWriteStream(savefile);
        ws.on('close',()=>cb.call(null, null, res));
        ws.on('error',(err)=>cb.call(null, err,res));
        res.pipe(ws);
    });
    req.end();
}

var url = 'http://shark.douyucdn.cn/app/douyu/js/page/room/normal/app-all.js?nv=7.61',
    savefile = function () {
        return (url.match(/[^\/][\w-]+\.js/ig).toString());
        //console.log(url.match(/[\w\.-]*[^?/]/g));
    }();

download(url,savefile, function (err, res) {
    console.log(res.statusCode,res.headers);
})
