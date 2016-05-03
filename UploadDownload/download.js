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
function download(url,savefile,callback){
    var urlinfo = urlparse(url);
    var options = {
        host:urlinfo.host,
        method:'get',
        path:urlinfo.pathname
    };
    if(urlinfo.port){
        options.port = urlinfo.port;
    }
    if(urlinfo.search){
        options.path += urlinfo.search;
    }
    var req = http.request(options, function (res) {
        var writestream = fs.createWriteStream(savefile);
        writestream.on('close', function () {
            console.log('close',res.body);
            callback(null,res)
        });
        writestream.on('error', function (err) {
            console.log('err',err.message);
        });
        res.pipe(writestream);
    });
    req.end();
}

var url = 'http://shark.douyucdn.cn/app/douyu/js/page/room/normal/app-all.js?nv=7.20',
    savefile = function () {
        return (url.match(/[^\/][\w-]+\.js/ig).toString());
        //console.log(url.match(/[\w\.-]*[^?/]/g));
    }();

download(url,savefile, function (err, res) {
    console.log(res.statusCode,res.headers);
})
