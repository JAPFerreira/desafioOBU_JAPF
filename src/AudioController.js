/**
 * Creates a new Audio Controller for the ball animation.
 */
function AudioController() {

    //The events that trigger a sound clip. Each has a sound file associated.
    const audioEvents = {
        "NON-PRIME": {
            "src": "./assets/sound/non-prime.mp3",
            "id": "non-prime-sound"
        },
        "PRIME": {
            "src": "./assets/sound/prime.mp3",
            "id": "prime-sound"
        }
    }


    //max number of audio channels to use
    const channels = 10;
    //the audio channels list
    var audioChannels;

    /**
     * Initializes the audio channels and audio objects in preparation to play sounds.
     */
    this.init = function () {
        //setup the audio channels
        audioChannels = [];
        for (let index = 0; index < channels; index++) {
            audioChannels[index] = new Array();
            audioChannels[index]['channel'] = new Audio();
            audioChannels[index]['finished'] = -1;
        }
    }

    /**
     * Plays the sound associated with a given event.
     * @param {string} event The event id from events.
     */
    this.play = function (event) {
        //chack all available channels to find one that's free
        for (let index = 0; index < audioChannels.length; index++) {
            var now = new Date();
            //check if channel has finnished playing
            if (audioChannels[index]['finished'] < now.getTime()) {
                audioChannels[index]['finished'] = now.getTime() + document.getElementById(audioEvents[event]["id"]).duration * 1000;
                audioChannels[index]['channel'].src = document.getElementById(audioEvents[event]["id"]).src;
                audioChannels[index]['channel'].load();
                audioChannels[index]['channel'].play();
                break;
            }
        }
    }

    /**
     * Stops the audio playback.
     */
    this.stop = function () {

    }

}