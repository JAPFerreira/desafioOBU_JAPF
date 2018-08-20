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
    * Creates the balls for the ball game, giving them random numbers between 1 and 60 and a corresponding color image.
    * @param {number} number Total number of balls. The balls generated will obey the color restrictions established for this generator.
    * @param {Array<string>} colorsToUse List of colors to use in the animation. The columns of balls will have colors corresponding to each one named in this list.
    * @param {number} colorInterval The number of balls of a particular color that should be created before using the next color, depending on the random number attributed to the ball.
    * @param {Function} callback The callback function that returns the list of balls created. Invoked as callback(balls) where balls is a list of Ball objects.
    */
    this.createBalls = function (number, colorsToUse, colorInterval, ballID, callback) {
        if (number >= 1 && number <= 60 && colorInterval < 60) {
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

            //create a list of checkpoints in the random numbers between 1 and 60 where the color of a ball with a number out of the previous ones' changes
            let numberCheckPoints = [];
            let auxPoint = colorInterval;
            numberCheckPoints.push(0);
            numberCheckPoints.push(auxPoint);
            while(auxPoint+colorInterval <= 60){
                auxPoint+=colorInterval;
                numberCheckPoints.push(auxPoint);
            }
            let lastCheckPoint = numberCheckPoints.pop();
            if(lastCheckPoint < 60){
                numberCheckPoints.push(lastCheckPoint);
                numberCheckPoints.push(60);
            }else{
                numberCheckPoints.push(lastCheckPoint);
            }

            //adding the correct colored ball to the object according to the color interval specified and the random number
            for (let index = 0; index < balls.length; index++) {
                let element = balls[index];
                let colorIndex = 0;
                //check if the ball number falls in any of the number intervals and use the corresponding color
                //the color is chosen from the sequence provided in colorsToUse. The sequence repeats itself as many times as possible within the 60 available numbers.
                for (let i = 1; i < numberCheckPoints.length; i++) {
                    let startPoint = numberCheckPoints[i-1];
                    let endPoint = numberCheckPoints[i];
                    if(element.number>startPoint && element.number <= endPoint){
                        element.image = colors[colorsToUse[colorIndex]];
                    }
                    if(colorIndex+1==colorsToUse.length){
                        colorIndex=0;
                    }else{
                        colorIndex++;
                    }
                }
            }
            callback(balls);
        } else {
            callback(null);
        }

    }
}



