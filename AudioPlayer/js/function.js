/**
 * Created by oliver on 6/21/16.
 */
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
            },pulse);
            console.log(this);
        } else {
            audio.pause();
            audio.currentTime = 0;
            $this.removeClass('playing').removeClass('pulsing');
            console.log(this);
            clearInterval(this.timer);
            // console.log(timer);
        }
            console.log(this.timer);

        function pulsing() {
                $this.addClass('pulsing');
            setTimeout(function () {
                $this.removeClass('pulsing');
            },pulse-100);
        }
    })
});