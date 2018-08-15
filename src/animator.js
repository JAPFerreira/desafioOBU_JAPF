import BallGenerator from "./ballGenerator.js";
//Imports the required animation settings
import { howManyBalls, howManyColors, colorInterval, useColorsList, ballsContainer} from "./settings.js"

/**
 * Creates a new Animator, responsible for controlling the animation of the balls.
 */
export function Animator() {
    //if the ball generator should use a specific color list
    if (useColorsList) {
        import { colorsToUse } from "./settings.js";
        this.generator = new BallGenerator(howManyColors, colorInterval, colorsToUse);
    } else {
        this.generator = new BallGenerator(howManyColors, colorInterval);
    }
}

/**
 * Initiates the animation process by creating the balls and starting their movement.
 */
Animator.prototype.init=function(){
    this.balls = gen.createBalls(30, ballsContainer);
}

/**
 * Starts, Stops and Continues the ball movement animation.
 */
Animator.prototype.playAnimation = function() {
    if(balls && ball.length>0){
        balls.forEach(element => {
            
        });
    }
    
}