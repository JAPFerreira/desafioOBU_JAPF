/**
 * Creates a new Ball for the ball animation.
 * @param {string} img The file path to the ball image to be used .
 * @param {number} number The random number given to this ball.
 * @param {string} id The HTML id for this ball.
 */
function Ball(img, number, id){
    this.image = img;
    this.number = number;
    this.animationTime = 0;
    this.distanceTraveled = 0;
    this.departed = false;
    this.arrived = false;
    this.isStopped = true;
    this.id = id;
    this.x = null;
}