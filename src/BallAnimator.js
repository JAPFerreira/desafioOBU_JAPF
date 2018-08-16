import BallGenerator from "./BallGenerator.js";
//Imports the required animation settings
import { howManyBalls, howManyColors, colorInterval, useColorsList, ballsContainer, animationDuration } from "./settings.js"


/**
 * Creates a new Animator, responsible for controlling the animation of the balls.
 */
export function BallAnimator() {
    //if the ball generator should use a specific color list
    if (useColorsList) {
        import { colorsToUse } from "./settings.js";
        this.generator = new BallGenerator(howManyColors, colorInterval, colorsToUse);
    } else {
        this.generator = new BallGenerator(howManyColors, colorInterval);
    }
}


/**
 * Initiates the animator, creating the balls and placing them on screen.
 */
BallAnimator.prototype.init = function () {
    //the balls are stored in a list, but between them is formed a linked list structure, where each ball knows the previous and the nex ball in the animation sequence.
    this.balls = gen.createBalls(howManyBalls);
    //places the balls created by the generator on screen.

}


/**
 * Plays the ball animation.
 */
BallAnimator.prototype.play = function(){
    var intId = setInterval(drawBalls, 20);
}


/**
 * Redraws every ball to its new position. Each ball decides whether it should be redrawn or not.
 */
function drawBalls(){
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
        let progress = function (timeFraction){
            return 1-Math.pow(1-timeFraction, 2);
        }

        draw(progress); // draw it

        if (timeFraction < 1) {
            requestAnimationFrame(animateBalls);
        }
    });
}
