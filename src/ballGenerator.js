//The list of available ball colors and the file paths to the corresponding ball images
var colors = {
    "RED": "./assets/images/red-ball.jpg",
    "BLUE": "./assets/images/blue-ball.jpg",
    "YELLOW": "./assets/images/yellow-ball.jpg",
    "GREEN": "./assets/images/green-ball.jpg"
}


/**
 * Creates a new BallGenerator, a class used to generate new balls for the ball game.
 * @param {number} colorInterval The number of balls that should be generated with a particular color before generating balls with the next color.
 */
function BallGenerator(colorInterval, gridLines) {
    this.colorInterval = colorInterval;
    this.gridLines = gridLines;

    /**
    * Creates the balls for the ball game.
    * @param {number} number Total number of balls. The balls generated will obey the color restrictions established for this generator.
    * @param {Array<string>} colorsToUse List of colors to use in the animation. The columns of balls will have colors corresponding to each one named in this list.
    * @param {Function} callback The callback function that returns the list of balls created. Invoked as callback(balls) where balls is a list of Ball objects.
    */
    this.createBalls = function (number, colorsToUse, callback) {
        if (number >= 1 && number <= 60) {
            var balls = [];

            var ballId = "ball";
            var idNumber = 1;
            //list of random numbers already used
            var usedNumbers = [];
            var ball;
            for (let index = 0; index < number; index++) {
                //generating random number until a new one is found
                var ballNumber = Math.floor((Math.random() * 60) + 1);
                while (usedNumbers.includes(ballNumber)) {
                    ballNumber = Math.floor((Math.random() * 60) + 1);
                }
                usedNumbers.push(ballNumber);
                ball = new Ball("", ballNumber, ballId + idNumber);
                balls.push(ball);
                idNumber++;
            }

            //adding the correct colored ball to the object according to the color interval specified
            var colorCounter = 0;
            var colorIndex = 0;
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



