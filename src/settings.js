//Settings for the animation parameters. Any changes required to the specific characteristics of the animation can be changed here
//and the scripts the import and use them will be able to use any new or changed values.

//number of colors to used in the animation.
export var howManyColors = 3;
//number of balls of a same color that should be created before changing to another color.
export var colorInterval = 10;
//number of ball to animate.
export var howManyBalls = 30;
//defines if a list of colors should be used
export var useColorsList = false;
//list of colors to use. 
export var colorsToUse = ["BLUE", "RED", "YELLOW"]
//the html id name of the container to intorduce the balls in
export var container = "ballGameContainer";
//the duration of the ball animation in milliseconds
export var animationDuration = 3000;