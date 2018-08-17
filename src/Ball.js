/**
 * Creates a new Ball for the ball animation.
 * @param {string} img The file path to the ball image to be used .
 * @param {number} number The random number given to this ball.
 * @param {string} id The HTML id for this ball.
 */
function Ball(img, number, id){
    //the image file path for this balls appearance.
    this.image = img;
    //the random number generated for this ball.
    this.number = number;
    //the amount of time this ball has spend in its animation.
    this.animationTime = 0;
    //the distance, in pixels, traveled by this ball during its animation.
    this.distanceTraveled = 0;
    //whether this ball has departed from its start position or not.
    this.departed = false;
    //whether this ball has arrived at its destination, meaning it has finished its animation.
    this.arrived = false;
    //whether this ball has been stoped during its animation.
    this.isStopped = true;
    //the HTML element id that corresponds to this ball.
    this.id = id;
    //this ball's style.left value, indicating its horizontal position in the ball container.
    this.x = null;
}