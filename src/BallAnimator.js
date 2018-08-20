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
    //the container for the prime balls
    var primeBallsContainer;
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
    //the list of prime balls generated in one animation.
    var primeBalls;
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
    * @param {string} primeBallsContainerID HTML id of the container for the prime balls found at the end of one animation.
    * @param {number} gridLines How many lines the ball grid should have.
    * @param {Array<string>} colorsToUse The list of colors to be used. They will be applied in the provided order.
    * @param {number} colorInterval The number of ball that should appear with one of the colors in the list of colors to use, before switching over to the next color.
    */
    this.init = function (howManyBalls, ballsContainerID, primeBallsContainerID, gridLines, colorsToUse, colorInterval) {
        generator = new BallGenerator(colorInterval, gridLines);
        numberBalls = howManyBalls;
        ballsContainer = ballsContainerID;
        primeBallsContainer = primeBallsContainerID;
        lines = gridLines;
        colorSequence = colorsToUse;
        interval = colorInterval;
        //cleans the ball container to restart the animation
        var containerNode = document.getElementById(ballsContainerID);
        while (containerNode.firstChild) {
            containerNode.removeChild(containerNode.firstChild);
        }
        //clear the last results
        let resultsContainer = document.getElementById(primeBallsContainer);
        while (resultsContainer.firstChild) {
            resultsContainer.removeChild(resultsContainer.firstChild);
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
                assembleBallGrid(balls, gridLines, ballsContainerID, 50, 50, "ball", 1, -1, 1);
            } else {
                alert("Number of balls requested is not valid.");
            }
        });
    }

    /**
     * Assembles a new element to add to the document with a ball.
     * @param {Ball} ball The ball object of the ball element to create.
     * @param {number} x The style.left property of the document element to create.
     * @param {number} y The style.top property of the document element to create.
     * @param {string} className The class name the element create should be given.
     * @param {number} width The desired width for the ball on screen, in pixels.
     * @param {number} height The desired height for the ball on screen, in pixels.
     */
    function assembleBallElement(ball, x, y, className, width, height) {
        //creating the ball element and giving it the look specified on the ball variables
        var ballDiv = document.createElement("div");
        ballDiv.className = className;
        ballDiv.id = ball.id;
        var bImg = document.createElement("img");
        bImg.setAttribute("src", ball.image);
        bImg.setAttribute("height", height);
        bImg.setAttribute("width", width);
        ballDiv.appendChild(bImg);
        ballDiv.style.left = x + 'px';
        ballDiv.style.top = y + 'px';
        ball.x = x;
        ball.startX = x;
        //add the ball number
        var numberElem = document.createElement("div");
        numberElem.className = "ballNumber";
        numberElem.innerHTML += ball.number;
        ballDiv.appendChild(numberElem);
        return ballDiv;
    }


    /**
     * Assembles a grid of balls and adds it to the document. The number of lines, the container of the list, the size of the balls and even the corner of the grid the list should start at can be specified.
     * @param {number} ballsList The number of balls the grid will have.
     * @param {number} gridLines The number of lines the grid requires. The number of columns is automatically adapted. Use 0 if the grid should adapt to the container.
     * @param {string} ballsContainerID The HTML id of the container for the ball grid.
     * @param {number} ballWidth The desired width for a ball.
     * @param {number} ballHeight The desired Height for a ball.
     * @param {string} ballClass The HTML class name for the ball elements in the grid.
     * @param {number} startLine The line the balls list should start at in the grid. 1 is the top line, -1 is the bottom line.
     * @param {number} startColumn The column the balls list should start at in the grid. 1 is the leftmost, -1 is the rightmost.
     * @param {number} assemblingDirecion The direction the grid should be assembled in. 0 is horizontal and no matter where the start point is the grid will be assembled line by line. 1 is vertical and no matter where the start point is the grid will be assembled column by column.
     */
    function assembleBallGrid(ballsList, gridLines, ballsContainerID, ballWidth, ballHeight, ballClass, startLine, startColumn, assemblingDirecion) {
        var howManyBalls = ballsList.length;
        let container = document.getElementById(ballsContainerID);
        var columnsNotRounded;
        var columns;
        if (gridLines > 0) { //if the number of lines was specified
            //placing the balls in a grid with ballWidth px by ballHeight px squares
            //the balls are placed in the order they are contained in the ballsList and start at (startLine, startColumn)
            columnsNotRounded = howManyBalls / gridLines;
            columns = Math.round(howManyBalls / gridLines);
            //if the number of balls required does not allow for a complete last column, but the rounding ignores this
            //an extra column needs to be added, but this one will be an incomplete one with less than gridLines balls
            if (columnsNotRounded > columns) columns++;
        }else{ //if the number of lines was not specified, the grid will adapt to the container
            let containerWidth = container.offsetWidth;
            columnsNotRounded = containerWidth/ballWidth;
            columns = Math.round(containerWidth/ballWidth);

            //if there's not enough space for a full ball at the end of the line we remove one column
            if(columnsNotRounded < columns) columns--;
        }

        //the horizontal distance, in pixels, the first ball should be placed in the container
        var xpx;
        if (startColumn == -1) {
            xpx = columns * ballWidth;
        } else {
            xpx = 0 - ballWidth;
        }

        //the vertical distance, in pixels, the first ball should be placed in the container
        var ypx;
        if (startLine == -1) {
            ypx = gridLines * ballHeight;
        } else {
            ypx = 0 - ballHeight;
        }

        for (let index = 0; index < howManyBalls; index++) {
            if (assemblingDirecion == 0) { //horizontal assembly
                //if the assembly is made line by line
                if (index % columns == 0) {
                    if (startColumn == 1) {
                        xpx = 0;
                    } else {
                        xpx = ballWidth * columns;
                    }
                    ypx += startLine * ballHeight;
                } else {
                    xpx += startColumn * ballWidth;
                }
            } else { //vertical assembly
                //if the assembly is made column by column
                if (index % gridLines == 0) {
                    if (startLine == 1) {
                        ypx = 0;
                    } else {
                        ypx = ballHeight * gridLines;
                    }
                    xpx += startColumn * ballWidth;
                } else {
                    ypx += startLine * ballHeight;
                }
            }
            //assembling the div for a ball
            var div = assembleBallElement(ballsList[index], xpx, ypx, ballClass, ballWidth, ballHeight);
            container.appendChild(div);
        }
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
            animator.init(numberBalls, ballsContainer, primeBallsContainer, lines, colorSequence, interval);
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
                //if the time fraction is resulting in a point previous to the current point in the animation
                if (balltimeFraction < 0) balltimeFraction = 0;

                let ballProgress = timmingFunction(balltimeFraction);
                if (ballProgress >= ball.animationProgress) ball.animationProgress = ballProgress;
                drawFunction(balls[index], index);

            }

            //if the animation has ran for the intended duration
            if (timeFraction < 1) {
                if (playing) requestAnimationFrame(animate);
            } else {
                //add the prime balls to the results container
                if (primeBalls && primeBalls.length > 0) {
                    assembleBallGrid(primeBalls, 0, primeBallsContainer, 50, 50, "ball", 1, 1, 0);
                }
                primeBalls = null;
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
                    if (primeBalls == null) primeBalls = new Array();
                    primeBalls.push(ball);
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


//FUNCTIONS USED IN THE INTERVAL METHOD OF ANIMATION - NOT ACCURATE AND NO LONGER IN USE
/*
this.play = function (animator) {
    if (!playing) {
        playing = true;
        playAnimation(animator);
    } else {
        playing = false;
        stopAnimation();
    }
}

function playAnimation(animator) {
    if (finished) {
        animator.init(numberBalls, ballsContainer, lines, colorSequence, interval);
    }
    finished = false;
    if (!timer) timer = setInterval(animate, 20);
}

function animate() {
    for (let index = 0; index < balls.length; index++) {
        const element = balls[index];
        drawBall(element, index);
    }
}

function stopAnimation() {
    if (!timer) return false;
    clearInterval(timer);
    timer = null;
    playing = false;
}

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
*/
