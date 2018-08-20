/**
 * Creates a new BallGenerator, a class used to generate new balls for the ball game.
 */
function BallGenerator() {
    //The list of available ball colors and the file paths to the corresponding ball images
    const colors = {
        "RED": "./assets/images/red-ball.png",
        "BLUE": "./assets/images/blue-ball.png",
        "YELLOW": "./assets/images/yellow-ball.png"
    }


    /**
    * Creates the balls for the ball game.
    * @param {number} number Total number of balls. The balls generated will obey the color restrictions established for this generator.
    * @param {Array<string>} colorsToUse List of colors to use in the animation. The columns of balls will have colors corresponding to each one named in this list.
    * @param {number} colorInterval The number of balls of a particular color that should be created before using the next color.
    * @param {Function} callback The callback function that returns the list of balls created. Invoked as callback(balls) where balls is a list of Ball objects.
    */
    this.createBalls = function (number, colorsToUse, colorInterval, ballID, callback) {
        if (number >= 1 && number <= 60) {
            let balls = [];
            let ballId = ballID;
            let idNumber = 1;
            //list of random numbers already used
            let usedNumbers = [];
            let ball;
            for (let index = 0; index < number; index++) {
                //generating random number until a new one is found
                let ballNumber = Math.floor((Math.random() * 60) + 1);
                while (usedNumbers.includes(ballNumber)) {
                    ballNumber = Math.floor((Math.random() * 60) + 1);
                }
                usedNumbers.push(ballNumber);
                ball = new Ball("", ballNumber, ballId + idNumber);
                balls.push(ball);
                idNumber++;
            }

            //adding the correct colored ball to the object according to the color interval specified
            let colorCounter = 0;
            let colorIndex = 0;
            for (let index = 0; index < balls.length; index++) {
                let element = balls[index];
                element.image = colors[colorsToUse[colorIndex]];
                colorCounter++;
                if (colorCounter > colorInterval - 1) {
                    colorCounter = 0;
                    colorIndex++;
                    if (colorIndex > colorsToUse.length - 1) colorIndex = 0;
                }
            }
            callback(balls);
        } else {
            callback(null);
        }

    }
}



