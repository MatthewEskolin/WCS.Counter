var audioContext = null;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var current8beat;
var current6beat;


var initialFlag = -1;
var fourCount = 0;



var tempo = 60.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function (in milliseconds)
var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec) // This is calculated from lookahead, and overlaps  with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvas;
var canvasContext;// the canvas element canvasContext;          // canvasContext is the canvas' context 2D


var canvas8;
var canvasContext8;


var last16thNoteDrawn = -1; // the last "box" we drew on the screen




var notesInQueue = [];      // the notes that have been put into the web audio, and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages



// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();






function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
    // tempo value to calculate beat length.

    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time


    if (fourCount == 1) {

        if (initialFlag == 1) {

            advanceCurrent6beat();
            advanceCurrent8beat();  
        }

    }

    //countdown
    fourCount++;
    if (fourCount == 5) {
        initialFlag = 1;
        fourCount = 1;
    }

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 17) {
        current16thNote = 1;
    }
}




function advanceCurrent6beat() {

    current6beat++;
    if (current6beat == 7) {
        current6beat = 1;
    }

}

function advanceCurrent8beat() {

    current8beat++;
    if (current8beat == 9) {
        current8beat = 1;
    }


}



function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });



    if (beatNumber % 4 != 1)
        return;

    //if ((noteResolution == 1) && (beatNumber % 2))
    //    return; // we're not playing non-8th 16th notes
    //if ((noteResolution == 2) && (beatNumber % 4))
    //    return; // we're not playing non-quarter 8th notes

    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);


    if (current6beat == 6 || current8beat == 8)    // beat 0 == high pitch
        osc.frequency.value = 880.0;
    else                 // other 16th notes = low pitch
        osc.frequency.value = 220.0;

    osc.start(time);
    osc.stop(time + noteLength);
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleNote(current16thNote, nextNoteTime);
        nextNote();
    }
}

function play() {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 1;
        current6beat = 1;
        current8beat = 1;
        fourCount = 1;
        initialFlag = -1;

        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function resetCanvas(e) {
    // resize the canvas - but remember - this clears the canvas too.
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;


    canvas.width = window.innerWidth;
    canvas.height = 200;

    //make sure we scroll to the top left.
    window.scrollTo(0, 0);
}

var last6beat = -1;
var last8beat = -1;

function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0, 1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
        var x = Math.floor(canvas.width / 18);




        //the original implementation colored every 16th note, for now, we want to only color the the quarter notes...
        if (last6beat != current6beat) {


            canvasContext.clearRect(0, 0, canvas.width, canvas.height);


            for (var i = 1; i < 7; i++) {
                canvasContext.fillStyle = (current6beat == i) ?
                    ((current6beat % 6 === 1) ? "blue" : "green") : "black";
                canvasContext.fillRect(x * (i + 1), x, x / 2, x / 2);
            }


            last6beat = current6beat;
        }



        if (last8beat != current8beat) {



            canvasContext8.clearRect(0, 0, canvas8.width, canvas8.height);


            //Draw 8 Beats.
            for (var j = 1; j < 9; j++) {
                canvasContext8.fillStyle = (current8beat == j) ?
                    ((current8beat % 8 === 1) ? "blue" : "green") : "black";
                canvasContext8.fillRect(x * (j + 1), x, x / 2, x / 2);
            }





            last8beat = current8beat;
        }






        //Update Counters
        $('#spnCurrent16th').text(currentNote);
        $('#spnCurrent4').text(current6beat);
        $('#spnCurrent8').text(current8beat);





        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimFrame(draw);
}

function init() {


    var container = document.createElement('div');
    var container8 = document.createElement('div');
    
    container.className = "container";
    canvas = document.createElement('canvas');
    canvasContext = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 200;
    document.body.appendChild(container);
    container.appendChild(canvas);
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    container8.className = "container";

    canvas8 = document.createElement('canvas');
    canvasContext8 = canvas8.getContext('2d');
    canvas8.width = window.innerWidth;
    canvas8.height = 200;
    document.body.appendChild(container8);
    container8.appendChild(canvas8);
    canvasContext8.strokeStyle = "#ffffff";
    canvasContext8.lineWidth = 2;




    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = new AudioContext();

    // if we wanted to load audio files, etc., this is where we should do it.

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    requestAnimFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("/Scripts/metronomeworker.js");

    timerWorker.onmessage = function (e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({ "interval": lookahead });
}

window.addEventListener("load", init);






