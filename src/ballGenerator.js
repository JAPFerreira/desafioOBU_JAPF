//The list of available ball colors and the file paths to the corresponding ball images
var colors = {
    "RED": "./assets/images/red-ball.jpg",
    "BLUE": "",
    "YELLOW": "",
    "GREEN": ""
}


/**
 * Creates a new BallGenerator, a class used to generate new balls for the ball game.
 * @param {number} howManyColors Number of colors to be used.
 * @param {number} colorInterval The number of balls that should be generated with a particular color before generating balls with the next color.
 */
function BallGenerator(howManyColors, colorInterval, gridLines) {
    this.howManyColors = howManyColors;
    this.colorInterval = colorInterval;
    this.gridLines=gridLines;
}

/**
 * Creates the balls for the ball game.
 * @param {number} number Total number of balls. The balls generated will obey the color restrictions established for this generator.
 * @param {Array<string>} colorsToUse List of colors to use in the animation. The columns of balls will have colors corresponding to each one named in this list.
 * @returns {Array<Ball>} The list of balls generated.
 */
BallGenerator.prototype.createBalls = function (number, colorsToUse, callback) {
    if (number >= 1 && number <=60) {
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
            ball = new Ball("",ballNumber, ballId+idNumber);
            balls.push(ball);
            idNumber++;
        }

        //adding the correct picture source for every ball created
        var columnsNotRounded = number/gridLines;
        var columns = Math.round(number/gridLines);

        //if the number of balls required does not allow for a complete last column, but the rounding ignores this
        //an extra column needs to be added, but this one will be an incomplete one with less than gridLines balls
        if(columnsNotRounded > columns)columns++;
        //how many balls are left to update with an image
        var ballsToUpdate=number;
        //the index of the ball at the top of a new column
        var updateStartPoint = 0;
        var colorIndex = 0;
        for(let index = 0; index<columns; index++){
            let toUpdate;
            //if we have enough balls to update to fill a full column or if there's a smaller amount
            if(ballsToUpdate>=gridLines){
                toUpdate = gridLines;
            }else{
                toUpdate = ballsToUpdate;
            }

            for (let i = updateStartPoint; i < updateStartPoint+toUpdate; i++) {
                balls[i].image=colors[colorsToUse[colorIndex]];
            }
            updateStartPoint+=gridLines;
            ballsToUpdate-=gridLines;
            colorIndex++;
            if(colorIndex==colorsToUse.length){
                colorIndex=0;
            }
        }
        callback(balls);
    }else{
        callback(null);
    }
    
}

