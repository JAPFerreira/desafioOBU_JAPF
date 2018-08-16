
/**
 * Creates a new Ball for the ball animation.
 * @param {string} img The file path to the ball image to be used 
 * @param {number} number The random number given to this ball.
 */
export function Ball(img, number){
    this.image = img;
    this.number = number;
}