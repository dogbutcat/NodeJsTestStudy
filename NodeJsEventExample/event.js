/**
 * Created by oliver on 3/30/16.
 */
/*
 const EventEmitter = require('events');
 const util = require('util');

 function MyEmitter(){
 EventEmitter.call(this);
 }

 util.inherits(MyEmitter,EventEmitter);

 const myEmitter = new MyEmitter();
 myEmitter.on('event',() => {
 console.log('an event occurred!');
 });
 myEmitter.emit('event');
 */
var http = require('http');
var fs = require('fs');
var option ={
    host:'www.h-moe.com',
    port:'80',
    path:'/',
    method:'GET',
//    headers:{
//        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.108 Safari/537.36'
//}
};
var req = http.request(option, function (res) {
    console.log('STATUS: '+res.statusCode);
    console.log('HEADERS: '+JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        fs.writeFile('/Users/oliver/Desktop/page.html',chunk, function (err) {
            if (err) throw err;
            console.log('It\'s saved !');

        })
        console.log('BODY: '+chunk);
    });
});
req.on('error', function (e) {
    console.log('problem with request: '+ e.message);
});
req.write('data\n');
//req.write('data\n');
req.end();