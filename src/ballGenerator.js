//Imports the list of ball colors. It's a JSON object that also contains the file path to the correct ball image to use.
import { colors } from "./colors.js";
//Imports the ball class to create balls
import Ball from "./Ball.js"

/**
 * Creates a new BallGenerator, a class used to generate new balls for the ball game.
 * @param {number} howManyColors Number of colors to be used.
 * @param {number} colorInterval The number of balls that should be generated with a particular color before generating balls with the next color.
 * @param {Array<string>} colorsList Optional. List of named colors to be used. The generation of the balls will obey the order of colors provided. Available colors in ball_colors.json
 */
export function BallGenerator(howManyColors, colorInterval, colorsList) {
    this.howManyColors = howManyColors;
    this.colorInterval = colorInterval;
    if (colorsList) this.colorsList = colorsList;
}

/**
 * Creates the balls for the ball game.
 * @param {number} number Total number of balls. The balls generated will obey the color restrictions established for this generator.
 * @returns {Array<Object>} The list of balls generated in JSON objects with the color to be used and the number attributed to the ball.
 */
BallGenerator.prototype.createBalls = function (number) {
    if (number >= 1) {
        var balls = [];
        var coloredSize = Math.round(number / this.howManyColors);

        for (let index = 0; index < number; index++) {
            var ball = new Ball();
            balls.push(ball);
        }
        return balls;
    }else{
        return null;
    }
    
}

