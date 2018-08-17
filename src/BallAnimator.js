//the duration of the ball animation in milliseconds
var animationDuration = 3000;
//maximum travel distance of a ball
var ballTravelDistance = 300;

var timer;
/**
 * Creates a new Animator, responsible for controlling the animation of the balls. It also requests the generation of new balls.
 */
function BallAnimator(howManyColors, colorInterval, gridLines) {
    //if the ball generator should use a specific color list
    this.howManyBalls = howManyBalls;
    this.colorInterval = colorInterval;
    this.generator = new BallGenerator(howManyColors, colorInterval, gridLines);
    this.balls = null;
    this.playing = false;
}


/**
 * Initiates the animator, creating the balls and placing them on screen.
 */
BallAnimator.prototype.init = function (ballsContainerID, gridLines, colorsToUse) {
    that = this;
    this.generator.createBalls(howManyBalls, colorsToUse, function (ballsCreated) {
        if(ballsCreated){
            that.balls=ballsCreated;
        //placing the balls in a grid with 50px-50px squares
        //the balls are placed in the order they are contained in the balls list and start at the right most column

        let columnsNotRounded = howManyBalls / gridLines;
        let columns = Math.round(howManyBalls / gridLines);
        //if the number of balls required does not allow for a complete last column, but the rounding ignores this
        //an extra column needs to be added, but this one will be an incomplete one with less than gridLines balls
        if (columnsNotRounded > columns) columns++;
        let container = document.getElementById(ballsContainerID);

        //the horizontal distance in pixels the balls need to be placed at
        var xpx = columns * 50;
        //the vertical distance in pixels the balls need to be placed at
        var ypx = 0;

        for (let index = 0; index < howManyBalls; index++) {
            if (index % gridLines == 0) {
                xpx -= 50;
                ypx = 0;
            }
            var div = document.createElement("div");
            div.className = "ball";
            div.id = that.balls[index].id;
            var bImg = document.createElement("img");
            bImg.setAttribute("src", that.balls[index].image);
            bImg.setAttribute("height", "50");
            bImg.setAttribute("width", "50");
            bImg.setAttribute("alt", "RedBall");
            div.appendChild(bImg);
            div.style.left = xpx + 'px';
            div.style.top = ypx + 'px';
            that.balls[index].x=xpx;
            container.appendChild(div);
            ypx += 50;
        }
        }else{
            alert("Number of balls requested is not valid.");
        }
    });
}


/**
 * Plays the ball animation.
 */
BallAnimator.prototype.play = function () {
    if(!this.playing){
        this.playing = true;
        this.playAnimation();
    }else{
        this.playing = false;
        this.stopAnimation();
    }
}

/**
 * Starts the animation process.
 */
BallAnimator.prototype.playAnimation=function() {
    if (!timer) timer = setInterval(this.animate(this.balls), 30);
}

/**
 * Stops/Pauses the animation process.
 */
BallAnimator.prototype.stopAnimation = function() {
    if (!timer) return false;
    clearInterval(timer);
    timer = null;
}

/**
 * Redraws every ball to its new position. Each ball decides whether it should be redrawn or not.
 */
BallAnimator.prototype.animate=function(balls) {
    for (let index = 0; index < balls.length; index++) {
        const element = balls[index];
        this.drawBall(element, index);
    }
}

/**
 * Animates a new frame of a ball's animation.
 * @param {Ball} ball The ball to animate.
 */
BallAnimator.prototype.drawBall=function(ball, index){
    var elem = document.getElementById(ball.id);
    //if the previous ball has departed or this one is the first one AND it has not yet arrived at its destination.
    if((index-1<0 || this.balls[index-1].departed) && !ball.arrived){
        if(ball.distanceTraveled==ballTravelDistance){
            ball.arrived=true;
        }
        ball.departed=true;
        elem.style.left = ball.x+1 + 'px';
        ball.distanceTraveled++;
        ball.x++;
    }
    //if the last ball has just arrived at its destination we stop the animation.
    if(index==this.balls.length-1){
        if(ball.arrived){
            this.stopAnimation();
        }
    }
}


/**
 * Animates all the balls on screen. The balls themselves decide whether they sould be redrawn or not.
 * @param timing The function to calculate the time progression on the animation. For how long, percentage wise, has the animation been occuring.
 * @param draw The function to redraw all the balls.
 * @param duration How long the animation should take in milliseconds. 
 */
function animateBalls({ timing, draw, duration }) {
    let startTime = performance.now();
    that = this;
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
            requestAnimationFrame(animateBalls);
        }
    });
}
