/**
 * Creates a new Animator, responsible for controlling the animation of the balls. Requests their creation and adds them to the document.
 * @param {number} totalAnimationDuration The amount of time, in milliseconds, this animator should take to complete the ball animation.
 * @param {number} ballTravelDistance The distance, in pixels, each ball shoul travel during the ball animation.
 * @param {number} ballAnimationDuration The amount of time, in milliseconds, a single ball should take to complete its animation.
 */
function BallAnimator(totalAnimationDuration, ballTravelDistance, ballAnimationDuration) {
    //the duration of the ball animation in milliseconds.
    var totalAnimationDuration = totalAnimationDuration;
    //maximum travel distance of a ball.
    var ballTravelDistance = ballTravelDistance;
    //the time one ball should take to complete its animation.
    var ballAnimationDuration = ballAnimationDuration;
    //the distance a ball must travel befor allowing another to start moving in the interval animation method
    var interBallDistance = 20;
    //the last point in time the animation was started
    var lastAnimationStartTime;
    //id of the request used in the frame request animation method
    this.frameRequestId = null;
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
    //timer to used in interval animation
    var timer;
    //speed of a ball in px per frame
    var speed = 2;
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

                //this is the difference between the total animation time and the animation time of a single ball
                var firstBallAnimationTimeDifference = totalAnimationDuration - ballAnimationDuration;
                //this determines the difference between the departure time of different balls and ensures that each ball can start its animation at its own point in time
                //while maintaining the total duration of the animation to the specified time. All balls start at a different time, but the total animation time stays the same no matter the value.
                var departureInterval = firstBallAnimationTimeDifference / balls.length - 1;
                for (let index = 0; index < balls.length; index++) {
                    let ball = balls[index];
                    ball.departureTime = index * departureInterval;
                }

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
                    balls[index].startX = xpx;
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

    //FUNCTION USED IN THE FRAME REQUEST METHOD OF ANIMATION
    /**
     * Plays and Stops the animaion of the balls with the frame request method.
     * @param {BallAnimator} animator The animator instance working on the animation. 
     */
    this.playFR = function (animator) {
        if (!playing) {
            playAnimationFR(animator);
        } else {
            playing = false;
        }
    }


    /**
     * Starts and Restarts the animation process with the frame request method.
     * @param {BallAnimator} animator The animator instance working on the animation. 
     */
    function playAnimationFR(animator) {
        if (finished) {
            animator.init(numberBalls, ballsContainer, lines, colorSequence, interval);
            finished = false;
        }
        playing = true;
        animator.frameRequestId = animateFR(ballMovementTiming, drawBallFR);
    }


    /**
    * Animates all the balls on screen with frame requests. The balls themselves decide whether they sould be redrawn or not.
    * @param {Function} drawFunction The function to redraw all the balls. It's called with drawFunction(progress, ball, index), where progress is the fraction of the animation that has been completed, ball is the ball object to animate and index it its index in the balls list.
    * @param {number} duration How long the animation should take in milliseconds.
    */
    function animateFR(timmingFunction, drawFunction) {
        var startTime = performance.now();
        requestAnimationFrame(function animate(requestTimeStamp) {
            // timeFraction goes from 0 to 1. The time between requesting the animation frame and actually getting it is time where the animation should have played
            let timeFraction = (requestTimeStamp - startTime) / totalAnimationDuration;

            //if we're at the end of the animation's duration
            if (timeFraction > 1) timeFraction = 1;
            animationProgress = timeFraction;

            //redraw all the balls
            for (let index = 0; index < balls.length; index++) {
                let ball = balls[index];

                //determine the time fraction for the animation of each ball
                let balltimeFraction = (requestTimeStamp - (startTime + ball.departureTime)) / ballAnimationDuration;

                //if we're at the end of the ball animation's duration
                if (balltimeFraction > 1) balltimeFraction = 1;
                if (balltimeFraction < 0) balltimeFraction = 0;

                let ballProgress = timmingFunction(balltimeFraction);
                if(ballProgress>=ball.animationProgress) ball.animationProgress = ballProgress;
                drawFunction(balls[index], index);

            }

            //if the animation has run for the intended duration
            if (timeFraction < 1) {
                if (playing) requestAnimationFrame(animate);
            } else {
                finished = true;
                playing = false;
            }
        });
    }

    /**
     * Calculates the progress according to the time fraction of the animation of a ball. Creates a accelerating movement in the first half of the animation and a slowing movement in the second half.
     * @param {number} timeFraction The time fraction, between 0 and 1, representing how much of the animation has been completed.
     */
    function ballMovementTiming(timeFraction) {
        if (timeFraction <= 0.5) { // first half of the animation
            return (1 - Math.sin(Math.acos(2 * timeFraction))) / 2;
        } else { // second half of the animation
            return (2 - (1 - Math.sin(Math.acos(2 * (1 - timeFraction))))) / 2;
        }
    }


    /**
     * Animates a new frame of a ball's animation for the Frame Request method of animation.
     * @param {Ball} ball The ball to animate.
     * @param {number} index The index of the ball in the balls list.
     */
    function drawBallFR(ball, index) {
        var elem = document.getElementById(ball.id);
        //if the previous ball has departed or this one is the first one AND it has not yet arrived at its destination we let it move.
        if ((index - 1 < 0 || balls[index - 1].departed) && !ball.arrived) {
            if (ball.animationProgress == 1) {
                ball.arrived = true;

                //readjusting for any slight missalignments
                elem.style.left = (ball.startX + ballTravelDistance) + 'px';

                //play prime number sound else play normal sound;
                if (isPrime(ball.number)) {
                    audioController.play("PRIME");
                } else {
                    audioController.play("NON-PRIME");
                }
            } else {
                //place the ball a distance related to the current progress of this ball's animatioon and not before its starting horizontal position
                elem.style.left = ball.startX + ball.animationProgress * ballTravelDistance + 'px';
                ball.distanceTraveled = ball.animationProgress * ballTravelDistance;
                //if this ball has been animated for long enoug to allow another ball to move
                if (!ball.departed && ball.animationProgress > 0) ball.departed = true;
            }

        }
    }


    //FUNCTIONS USED IN THE INTERVAL METHOD OF ANIMATION
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
    function playAnimation(animator) {
        if (finished) {
            animator.init(numberBalls, ballsContainer, lines, colorSequence, interval);
        }
        finished = false;
        if (!timer) timer = setInterval(animate, 20);
    }

    /**
    * Redraws every ball to its new position. Each ball decides whether it should be redrawn or not.
    */
    function animate() {
        for (let index = 0; index < balls.length; index++) {
            const element = balls[index];
            drawBall(element, index);
        }
    }

    /**
    * Stops/Pauses the animation process.
    */
    function stopAnimation() {
        if (!timer) return false;
        clearInterval(timer);
        timer = null;
        playing = false;
    }

    /**
    * Animates a new frame of a ball's animation for the Interval method of animation.
    * @param {Ball} ball The ball to animate.
    * @param {number} index The index of the ball in the balls list.
    */
    function drawBall(ball, index) {
        var elem = document.getElementById(ball.id);
        //if the previous ball has departed or this one is the first one AND it has not yet arrived at its destination we let it move.
        if ((index - 1 < 0 || balls[index - 1].departed) && !ball.arrived) {
            if (ball.distanceTraveled > ballTravelDistance) {
                ball.arrived = true;
                //readjust the ball's position if it has gone over the maximum travel distance
                elem.style.left = (ball.startX + ball.ballTravelDistance) + 'px';
                ball.distanceTraveled++;
                //play prime number sound else play normal sound;
                if (isPrime(ball.number)) {
                    audioController.play("PRIME");
                } else {
                    audioController.play("NON-PRIME");
                }
            } else {
                elem.style.left = ball.x + speed + 'px';
                ball.x += speed;
                ball.distanceTraveled += speed;
                //if this ball has bee animated for long enoug to allow another ball to move
                if (!ball.departed && ball.distanceTraveled >= interBallDistance) ball.departed = true;
            }

        }
        //if the last ball has arrived at its destination we stop the animation.
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
