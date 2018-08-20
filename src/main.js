//number of balls of a same color that should be created before changing to another color.
var colorInterval = 10;
//number of ball to animate.
var howManyBalls = 30;
//defines if a list of colors should be used
var useColorsList = false;
//list of colors to use. 
var colorsToUse = ["RED", "BLUE", "YELLOW"];
//the html id name of the container to intorduce the balls in
var ballsContainerID = "ballGameContainer";
//the html id of the container for the prime balls detected
var resultsContainerID = "resultsContainer";
//the html id of a ball element
var ballID = "ball";
//number of lines the ball grid has
var gridLines = 10;
//how long the animation should take, in milliseconds
var animationDuration = 3000;
//how far should a ball move in pixels
var animationDistance = 300;
//how long it should take for one ball to complete its animation
var ballAnimationDuration = 1000;
//the animator to control the animation process
var ballAnimator;


/**
 * Creates a new animator and initiates its opertaions. This will load the balls into the document.
 */
function initAnimator() {
    ballAnimator = new BallAnimator(animationDuration, animationDistance, ballAnimationDuration);
    ballAnimator.init(howManyBalls, ballID, ballsContainerID, resultsContainerID, gridLines, colorsToUse, colorInterval, gridLines);
};

/**
 * Orders the animator to begin, pause, or continue the animation of the ballswith the interval animation method.
 */
function play() {
    ballAnimator.play(ballAnimator);
}

/**
 * Orders the animator to begin, pause, or continue the animation of the balls with the frame request animation method.
 */
function playFR() {
    ballAnimator.playFR(ballAnimator);
}
