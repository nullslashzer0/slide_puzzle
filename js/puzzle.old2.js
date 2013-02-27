/* Javascript File */

//**** Global Variables ****//
$.slideSpeed = 250;
$.scrambleNumber = 200;
$.numTiles = 25;
$.rows = 5;
$.cols = 5;
$.tileWidth = 120;
$.tileHeight = 120;

// score values
$.numberOfMoves = 0;
$.timeMinutes = 0;
$.timeSeconds = 0;

// jquery-ui effect parameters
$.shakeSpeed = 35;	// ms
$.shakeDistance = 3; // px

$.timer = {
	t: null,
	isRunning: false
};

function preload(arrayOfImages) {
	$(arrayOfImages).each(function() {
		$('<img/>')[0].src = this;
	});
}

function startTimer() {
	var now = new Date();
	var ms = now.getTime();
	$.timer.t = setInterval( function() {
		now = new Date();
		var diff = now.getTime() - ms;
		var sec = Math.floor(diff / 1000);
		var min = Math.floor(sec / 60);
		sec = sec % 60;
		$("span#timeElapsed").text(formatTime(min,sec));
	},1000);
	$.timer.isRunning = true;
}

function stopTimer() {
	clearInterval($.timer.t);
	$.timer.isRunning = false;
}

function resetScore() {
	stopTimer();
	// set global score variables and assign to label
	$.numberOfMoves = 0;
	$("span#numberOfMoves").text($.numberOfMoves);
	$.timeMinutes = 0;
	$.timeSeconds = 0;
	$("span#timeElapsed").text(formatTime(0,0));
}

/* Set up the game board */
function initialize() {
	resetScore();
	
	var tiles = $("img.tile");
	var index = 0;
	for(var row = 1; row <= $.rows; row++) {
		for(var col = 1; col <= $.cols; col++) {
			// filter to one element and add tile number,
			// x-position, and y-position to data
			$(tiles).eq(index).data({
				"tile": index+1,
				"x-position": col,
				"y-position": row
			})
			// add the current position to attribute
			// this will be used later to check if a tile
			// is in the correct position
			.attr("data-position", index+1)
			// position the image
			.css({ 
				left: (col-1)*$.tileWidth,
				top: (row-1)*$.tileHeight
			});
			index++;
		}
	}
	// tag the blank tile
	$('img[src$="blank.jpg"]').attr("id", "blank");
	
	// bind the moveSquare function to each image
	$(tiles).bind('click', function() {
		moveTile($(this));
	});
}

function scramblePuzzle() {
	resetScore();
	for(var i=0; i<=$.scrambleNumber; i++) {
		var tile1 = $("img.tile").get(Math.floor(Math.random() * $.numTiles));
		var tile2 = $("img.tile").get(Math.floor(Math.random() * $.numTiles));
		swapTiles(tile1,tile2, false);
	}
}

function moveTile(tile) {
	// check to see if the timer is running
	if (!$.timer.isRunning) {
		startTimer();
	}
	// get the positions of the tile
	var blank = $('img[id="blank"]');
	var blankPosition = $(blank).attr("data-position");
	var blankX = $(blank).data("x-position");
	var blankY = $(blank).data("y-position");
	var tilePosition = $(tile).attr("data-position");
	var tileX = $(tile).data("x-position");
	var tileY = $(tile).data("y-position");
	
	// check to see if the blank tile is one of the surrounding tiles
	var isMoveable = ( 
		( (tileX == blankX) && ( (tileY - blankY) == 1 )) ? true : // check top square
		( (tileY == blankY) && ( (tileX - blankX) == 1 )) ? true : // check right square
		( (tileX == blankX) && ( (blankY - tileY) == 1 )) ? true : // check bottom square
		( (tileY == blankY) && ( (blankX - tileX) == 1 )) ? true : // check left square
		false);
	
	if (isMoveable) {
		swapTiles(blank, tile, true);
		$("span#numberOfMoves").text(++$.numberOfMoves);
	}
	else {
		$(tile).css({
			"border": '1px solid #f00',
			"z-index": '30'
		})
		.effect("shake",{ distance: $.shakeDistance }, $.shakeSpeed, function() {
			$(this).css({
				"border": 'none',
				"z-index": '10'
			});
		});
	}
}

function swapTiles(tile1, tile2, animate) {
	var tile1Position = $(tile1).attr("data-position");
	var tile1X = $(tile1).data("x-position");
	var tile1Y = $(tile1).data("y-position");
	var tile2Position = $(tile2).attr("data-position");
	var tile2X = $(tile2).data("x-position");
	var tile2Y = $(tile2).data("y-position");
	// swap the two square positions
	var tile1Left = $(tile1).css("left");
	var tile1Top = $(tile1).css("top");
	var tile2Left = $(tile2).css("left");
	var tile2Top = $(tile2).css("top");
	
	$(tile1).data({
		"x-position": tile2X,
		"y-position": tile2Y
	})
	.attr("data-position", tile2Position);
	
	$(tile2).data({
		"x-position": tile1X,
		"y-position": tile1Y
	})
	.attr("data-position", tile1Position);
		
	if (animate) {
		// detach click handler to prevent double clicking during animation
		$("img.tile").unbind('click');
		// copy tile1 to the same as tile2
		var newTile = $(tile1).clone(true);
		$(newTile).css( { left: tile2Left, top: tile2Top } )
			.attr("id", "tempImage")
			.insertAfter($(tile1));
		
		$(tile2).animate({ left: tile1Left,	top: tile1Top },$.slideSpeed, function() {
			$(tile1).css({ left: tile2Left, top: tile2Top } );
			$('img[id="tempImage"]').remove();
			// reattach click handler
			$("img.tile").bind('click', function() {
				moveTile($(this));
			});
			checkPuzzle();
		});
		
	}
	else {
		$(tile1).css({ left: tile2Left, top: tile2Top } );
		$(tile2).css({ left: tile1Left,	top: tile1Top } );
	}
}

function checkPuzzle() {
	var tiles = $("img.tile");
	
	$(tiles).removeClass("correct").addClass(function() {
		var tile = $(this).data("tile");
		var position = $(this).attr("data-position");
		var correct = (tile == position) ? "correct" : "";
		return correct;
	});
	
	var correctTiles = $(tiles).not(function() {return !$(this).hasClass("correct"); });
	if ($(correctTiles).size() == $.numTiles) {
		alert("Puzzle is solved!!!");
		stopTimer();
	}
}

function resetPuzzle() {
	var tiles = $("img.tile");
	
	var index = 0;
	for(var row = 1; row <= $.rows; row++) {
		for(var col = 1; col <= $.cols; col++) {
			var tile = $(tiles).filter( function() {
				return ( $(this).data("tile") == index+1);
			});
			
			$(tile).data({
				"x-position": col,
				"y-position": row
			})
			.attr("data-position", index+1)
			.css({
				left: (col-1) * $.tileWidth,
				top: (row-1) * $.tileHeight
			});
			index++;
		}
	}
	
	// reset globals and stop timer
	$("span#numberOfMoves").text($.numberOfMoves = 0);
	stopTimer();
	$("span#timeElapsed").text(formatTime(0,0));
}

function formatTime(minutes, seconds)
{
	var min = minutes.toString();
	var sec = seconds.toString();
	// add leading zeros
	
	if (min.length < 2) { 
		min = '0' + min; 
	}
	
	if (sec.length < 2) {
		sec = '0' + sec;
	}
	
	return min + ":" + sec;
}

