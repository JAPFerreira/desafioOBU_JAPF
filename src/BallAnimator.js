/**
 * Creates a new Animator, responsible for controlling the animation of the balls. Requests their creation and adds them to the document.
 */
function BallAnimator() {
    //the duration of the ball animation in milliseconds.
    var animationDuration;
    //maximum travel distance of a ball.
    var ballTravelDistance = 300;
    //the distance a ball should travel before the next ball starts moving.
    var ballDistance = 25;

    //the container the ball will be animated in.
    var ballsContainer;
    //the number of lines the grid of ball will have.
    var lines;
    //the color sequence to be used.
    var colorSequence;
    //number of balls this animator manages and animates.
    var numberBalls;
    //how many balls of one color before changing to another.
    var interval;

    //the ball generator used to create the Ball objects.
    var generator;
    //the list of balls in the animation.
    var balls;
    //the animation timer.
    var timer;
    //whether the lattest animation has finished or not.
    var finished = false;
    //whether this animator is playing an animation or not.
    var playing = false;

    //the audio cotroller for the animation sounds.
    var audioController;

    audioController = new AudioController();
    audioController.init();
    /**
    * Initiates the animator, creating the balls and placing them on screen.
    * @param {number} howManyBalls The number of balls the animator should animate.
    * @param {string} ballsContainerID HTML id name of the ball animation container.
    * @param {number} gridLines How many lines the ball grid should have.
    * @param {Array<string>} colorsToUse The list of colors to be used. They will be applied in the provided order.
    * @param {number} colorInterval The number of ball that should appear with one of the colors in the list of colors to use, before switching over to the next color.
    */
    this.init = function (howManyBalls, ballsContainerID, gridLines, colorsToUse, colorInterval) {
        generator = new BallGenerator(colorInterval, gridLines);
        numberBalls = howManyBalls;
        ballsContainer = ballsContainerID;
        lines = gridLines;
        colorSequence = colorsToUse;
        interval = colorInterval;
        //cleans the ball container to restart the animation
        var containerNode = document.getElementById(ballsContainerID);
        while (containerNode.firstChild) {
            containerNode.removeChild(containerNode.firstChild);
        }
        generator.createBalls(howManyBalls, colorsToUse, function (ballsCreated) {
            if (ballsCreated) {
                balls = ballsCreated;

                //placing the balls in a grid with 50px-50px squares
                //the balls are placed in the order they are contained in the balls list and start at the right most column
                let columnsNotRounded = howManyBalls / gridLines;
                let columns = Math.round(howManyBalls / gridLines);
                //if the number of balls required does not allow for a complete last column, but the rounding ignores this
                //an extra column needs to be added, but this one will be an incomplete one with less than gridLines balls
                if (columnsNotRounded > columns) columns++;
                let container = document.getElementById(ballsContainerID);

                //the horizontal distance in pixels the balls need to be placed at starting at the rightmost column
                var xpx = columns * 50;
                //the vertical distance in pixels the balls need to be placed at
                var ypx = 0;
                for (let index = 0; index < howManyBalls; index++) {
                    if (index % gridLines == 0) {
                        xpx -= 50;
                        ypx = 0;
                    }
                    //assembling the div for a ball
                    var div = document.createElement("div");
                    div.className = "ball";
                    div.id = balls[index].id;
                    var bImg = document.createElement("img");
                    bImg.setAttribute("src", balls[index].image);
                    bImg.setAttribute("height", "50");
                    bImg.setAttribute("width", "50");
                    div.appendChild(bImg);
                    div.style.left = xpx + 'px';
                    div.style.top = ypx + 'px';
                    balls[index].x = xpx;
                    //add the ball number
                    var numberElem = document.createElement("div");
                    numberElem.className = "ballNumber";
                    numberElem.innerHTML += balls[index].number;
                    div.appendChild(numberElem);
                    container.appendChild(div);
                    ypx += 50;
                }
            } else {
                alert("Number of balls requested is not valid.");
            }
        });
    }


    /**
     * Plays and Stops the animation of all the balls.
     */
    this.play = function (animator) {
        if (!playing) {
            playing = true;
            playAnimation(animator);
        } else {
            playing = false;
            stopAnimation();
        }
    }

    /**
    * Starts and restarts the animation process.
    */
    playAnimation = function (animator) {
        if (finished) {
            animator.init(numberBalls, ballsContainer, lines, colorSequence, interval);
        }
        finished = false;
        if (!timer) timer = setInterval(this.animate, 20);
    }

    /**
    * Redraws every ball to its new position. Each ball decides whether it should be redrawn or not.
    */
    animate = function () {
        for (let index = 0; index < balls.length; index++) {
            const element = balls[index];
            drawBall(element, index);
        }
    }

    /**
    * Stops/Pauses the animation process.
    */
    stopAnimation = function () {
        if (!timer) return false;
        clearInterval(timer);
        timer = null;
        playing = false;
    }

    /**
    * Animates a new frame of a ball's animation.
    * @param {Ball} ball The ball to animate.
    * @param {number} index The index of the ball in the balls list.
    */
    drawBall = function (ball, index) {
        var elem = document.getElementById(ball.id);
        //if the previous ball has departed or this one is the first one AND it has not yet arrived at its destination.
        if ((index - 1 < 0 || balls[index - 1].departed) && !ball.arrived) {
            if (ball.distanceTraveled == ballTravelDistance - 1) {
                ball.arrived = true;
                //play prime number sound else play normal sound;
                if (isPrime(ball.number)) {
                    audioController.play("PRIME");
                } else {
                    audioController.play("NON-PRIME");
                }
            }
            elem.style.left = ball.x + 1 + 'px';
            ball.distanceTraveled++;
            if (!ball.departed && ball.distanceTraveled > ballDistance) ball.departed = true;
            ball.x++;
        }
        //if the last ball has just arrived at its destination we stop the animation.
        if (index == balls.length - 1) {
            if (ball.arrived) {
                stopAnimation();
                finished = true;
            }
        }
    }

}


/**
 * Utility function to determine if a given number is prime.
 * @param {number} number The number to check if it is prime.
 */
function isPrime(number) {
    for (var i = 2; i < number; i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return number > 1;
}




/**
 * Animates all the balls on screen. The balls themselves decide whether they sould be redrawn or not.
 * @param timing The function to calculate the time progression on the animation. For how long, percentage wise, has the animation been occuring.
 * @param draw The function to redraw all the balls.
 * @param duration How long the animation should take in milliseconds. 
 */
function animateBalls(timing, draw, duration) {
    let startTime = performance.now();
    requestAnimationFrame(function animate(time) {
        // timeFraction goes from 0 to 1. It represents the fraction of the total time the animation should last that has been used.
        let timeFraction = (time - startTime) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // calculate the current animation state. How much of the animation has been completed.
        // Defines the time/distance curve for the ball animation movement. 
        //Uses a Reversed Power of N relation to create a movement that's faster in the begining and gradually slows down.
        let progress = function (timeFraction) {
            return 1 - Math.pow(1 - timeFraction, 2);
        }

        for (let index = 0; index < that.balls.length; index++) {
            drawBall(progress);
        }

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}
