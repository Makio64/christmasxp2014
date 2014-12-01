var Audio = (function(){

    function Audio(){
        this.sound = new buzz.sound( "assets/sounds/train", {
            formats: [ "wav" ],
            volume: 0
        });
        this.duration = 3115;
        this.sound.play()
            .fadeTo(3)
            .loop();

        this.tunnelSound = new buzz.sound('assets/sounds/wind3', {
            formats: ['wav'],
            volume: 0
        });
        this.tunnelDuration = 3115;
        this.tunnelSound.play()
            .loop();
    }

    Audio.prototype.startTunnel = function() {
        // this.tunnelSound.fadeTo(5, 300)
    };

    Audio.prototype.stopTunnel = function() {
        // this.tunnelSound.fadeTo(0, 500)  
    };

    Audio.prototype.update = function() {
        if(this.sound.getTime() > 3.00) {
            this.sound.setTime(0);
        }
        if(this.tunnelSound.getTime() > 5.63) {
            this.tunnelSound.setTime(0);
        }
    };

    return Audio;

})();