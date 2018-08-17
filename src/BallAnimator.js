var timer = null;

/**
 * Creates a new Animator, responsible for controlling the animation of the balls.
 */
function BallAnimator(howManyColors, colorInterval, gridLines) {
    //if the ball generator should use a specific color list
    this.howManyBalls = howManyBalls;
    this.colorInterval = colorInterval;
    this.generator = new BallGenerator(howManyColors, colorInterval, gridLines);
}


/**
 * Initiates the animator, creating the balls and placing them on screen.
 */
BallAnimator.prototype.init = function (ballsContainerID, gridLines) {
    //the balls are stored in a list, but between them is formed a linked list structure, where each ball knows the previous and the nex ball in the animation sequence.
    this.balls = this.generator.createBalls(howManyBalls);
    alert(balls.length);

    //placing the balls in a grid with 50px-50px squares
    //the balls are placed in the order they are contained in the balls list and start at the right most column

    let columnsNotRounded = number / gridLines;
    let columns = Math.round(number / gridLines);
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
        div.id = balls[index].id;
        var bImg = document.createElement("img");
        bImg.setAttribute("src", balls[index].image);
        bImg.setAttribute("height", "50");
        bImg.setAttribute("width", "50");
        bImg.setAttribute("alt", "RedBall");
        div.appendChild(bImg);
        div.style.left=xpx+'px';
        div.style.top=ypx+'px';
        container.appendChild(div);
        ypx += 50;
    }

}


/**
 * Plays the ball animation.
 */
BallAnimator.prototype.play = function () {

}

/**
 * Starts the animation process.
 */
function playAnimation() {
    if (!timer) timer = setInterval(animateBalls, 20);
}

/**
 * Stops/Pauses the animation process.
 */
function stopAnimation() {
    if (!timer) return false;
    clearInterval(timer);
    timer = null;
}

/**
 * Redraws every ball to its new position. Each ball decides whether it should be redrawn or not.
 */
function drawBalls() {
    this.balls.forEach(element => {
        element.draw();
    });
}


/**
 * Animates all the balls on screen. The balls themselves decide whether they sould be redrawn or not.
 * @param timing The function to calculate the time progression on the animation. For how long, percentage wise, has the animation been occuring.
 * @param draw The function to redraw all the balls.
 * @param duration How long the animation should take in milliseconds. 
 */
function animateBalls({ timing, draw, duration }) {
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

        draw(progress); // draw it

        if (timeFraction < 1) {
            requestAnimationFrame(animateBalls);
        }
    });
}
