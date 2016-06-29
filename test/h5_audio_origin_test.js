/**
 * Created by oliver on 6/20/16.
 */
var RequestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame,analyser,ctx,canvas1,canvas2;
var AudioContext = window.AudioContext||window.webkitAudioContext, context = new AudioContext();
var audio = new Audio();
audio.src = '123.mp3';
audio.controls=true;
audio.loop=true;
audio.autoplay=false;

window.addEventListener('load',initMp3Player,false);
function initMp3Player() {
    document.getElementById('audio_box').appendChild(audio);
    canvas1 = document.getElementById('analyser2');
    canvas2 = document.getElementById('analyser1');
    analyser = context.createAnalyser();
    ctx = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLoop();
}
function frameLoop() {
    RequestAnimationFrame(frameLoop);
    var dataArr = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArr);
    ctx.clearRect(0,0,canvas1.width,canvas1.height);
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
    ctx.fillStyle = ctx2.fillStyle = '#0cf';
    var bars = 300;
    for (var i =0;i<bars;i++){
        bar_x=i*1;
        bar_width=2;
        bar_height=-(dataArr[i]/2);
        ctx.fillRect(bar_x,canvas1.height,bar_width,bar_height);
        ctx2.fillRect((bars - bar_x),canvas2.height,bar_width,bar_height);
    }
}
// function initMp3Player(){
//     document.getElementById('audio_box').appendChild(audio);
//     canvas = document.getElementById('analyser');
//     context = new AudioContext();
//     analyser = context.createAnalyser();
//     ctx = canvas.getContext('2d');
//     //loadFile(audio.src,context);
//
//     source = context.createMediaElementSource(audio);
//     source.connect(analyser);
//     analyser.connect(context.destination);
//     frameLooper();
// }
// function frameLooper(){
//     RequestAnimationFrame(frameLooper);
//     dataArr = new Uint8Array(analyser.frequencyBinCount);
//     analyser.getByteFrequencyData(dataArr);
//     //console.log(dataArr);
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     ctx.fillStyle = '#0cf';
//     bars = 100;
//     for (var i =0;i<bars;i++){
//         bar_x=i*3;
//         bar_width = 2;
//         bar_height=-(dataArr[i]/2)
//         ctx.fillRect(bar_x,canvas.height,bar_width,bar_height)
//     }
// }
// function loadFile(url,context){
//     var xreq = new XMLHttpRequest();
//     xreq.open('GET',url,true);
//     //xreq.setRequestHeader('Access-Control-Allow-Origin','tm3dfds.gangqinpu.com');
//     xreq.responseType = 'arraybuffer';
//     xreq.onload=function(res){
//         console.log(xreq.response);
//         context.decodeAudioData(this.response,function (buffer) {
//             source=context.createBufferSource();
//             source.buffer = buffer;
//             console.log(buffer);
//             source.connect(analyser);
//             analyser.connect(context.destination);
//             frameLooper();
//         }.bind(this),function (err) {
//             console.log(err);
//         });
//
//     };
//     xreq.onerror = function(err){
//         console.log(xreq);
//     }
//     xreq.send();
// }

