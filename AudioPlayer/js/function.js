/**
 * Created by oliver on 6/21/16.
 */
var AudioContext = window.AudioContext || window.webkitAudioContext, RequestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame, context = new AudioContext();
$(document).ready(function () {
    $('.spinner-wrap').click(function () {
        var $this = $(this), audio = $this.siblings('audio')[0], bpm = $this.siblings('audio').data('bpm'),
            pulse = (60 / bpm) * 1000;
        // console.log(pulse);
        if (audio.paused) {
            audio.play();
            $this.addClass('playing');
            this.timer = setInterval(function () {
                pulsing();
            }, pulse);
            // console.log(this);
        } else {
            audio.pause();
            audio.currentTime = 0;
            $this.removeClass('playing').removeClass('pulsing');
            clearInterval(this.timer);
            // console.log(timer);
        }

        function pulsing() {
            $this.addClass('pulsing');
            setTimeout(function () {
                $this.removeClass('pulsing');
            }, pulse - 100);
        }
    });
    var audio = $('audio')[0], canvas1 = document.getElementById('analyser1'), canvas2 = document.getElementById('analyser2'), analyser = context.createAnalyser();
    ctx1 = canvas1.getContext('2d'), ctx2 = canvas2.getContext('2d');
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLoop();
    function frameLoop() {
        RequestAnimationFrame(frameLoop);
        var dataArr = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArr);
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx1.fillStyle = ctx2.fillStyle = '#ad4df7';
        var bars = canvas1.width, bar_x, bar_width = 1, bar_height;
        for (var i = 0; i < bars; i++) {
            bar_x = i;
            bar_height = -(dataArr[i] / 2);
            ctx2.fillRect(bar_x, canvas1.height, bar_width, bar_height);
            ctx1.fillRect((bars - bar_x), canvas2.height, bar_width, bar_height);
        }
    }
});
