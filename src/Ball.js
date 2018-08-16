
/**
 * Creates a new Ball for the ball animation.
 * @param {string} img The file path to the ball image to be used 
 * @param {number} number The random number given to this ball.
 */
export function Ball(img, number, id, prevBall, nextBall){
    this.image = img;
    this.number = number;
    this.previousBall = prevBall;
    this.nextBall = nextBall;
    this.animationTime = 0;
    this.distanceTraveled = 0;
    this.departed = false;
    this.arrived = false;
    this.isStopped = true;
    this.id = id;
}

/**
 * Redraws the ball in its next position, paying attention to the ball's records of its animation up to that point.
 */
Ball.prototype.draw = function(){
    
}