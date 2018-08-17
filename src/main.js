//Settings for the animation parameters. Any changes required to the specific characteristics of the animation can be changed here
//and the scripts the import and use them will be able to use any new or changed values.

//number of colors to used in the animation.
var howManyColors = 3;
//number of balls of a same color that should be created before changing to another color.
var colorInterval = 10;
//number of ball to animate.
var howManyBalls = 30;
//defines if a list of colors should be used
var useColorsList = false;
//list of colors to use. 
var colorsToUse = ["RED", "RED", "RED"]
//the html id name of the container to intorduce the balls in
var ballsContainerID = "ballGameContainer";
//number of lines the ball grid has
var gridLines = 10;

var animator;

//document.onload(start());

function start() {
    animator = new BallAnimator(howManyBalls, colorInterval, gridLines);
    animator.init(ballsContainerID, gridLines, colorsToUse);
};

function play(){
    animator.play();
}
