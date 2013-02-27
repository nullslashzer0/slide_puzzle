/* Javascript File */

//*****  GLOBAL VARIABLES  *****//
$.puzzle = {
	rows: 5,
	cols: 5,
	numTiles: 25,
	tileWidth: 120,
	tileHeight: 120,
	scrambleCount: 200
};

$.score = {
	moves: 0,
	minutes: 0,
	seconds: 0
};

$.uiSettings = {
	slideSpeed: 250,
	shakeSpeed: 35,
	shakeDistance: 3
};

$.timer = {
	t: null,
	startMs: 0,
	isRunning: false
};


//*****  SCORE FUNCTIONS  *****//
function updateScore() {
	$("span#moves").text($.score.moves);
	$("span#time").text( formatTime($.score.minutes, $.score.seconds) );
}

function resetScore() {
	$.score.moves = 0;
	$.score.minutes = 0;
	$.score.seconds = 0;
	updateScore();
}

//*****  TIMER FUNCTIONS  *****//
function startTimer() {
	if (!$.timer.isRunning) {
		$.timer.startMs = new Date().getTime();
		$.timer.t = setInterval( function() {
			var nowMs = new Date().getTime();
			var diff = nowMs - $.timer.startMs;
			$.score.seconds = Math.floor(diff / 1000);
			$.score.minutes = Math.floor($.score.seconds / 60);
			$.score.seconds = $.score.seconds % 60;
			updateScore();
		}, 1000);
		$.timer.isRunning = true;
	}
}

function stopTimer() {
	if($.timer.isRunning) {
		clearInterval($.timer.t);
		$.timer.isRunning = false;
	}
}

function formatTime(minutes, seconds) {
	var min = minutes.toString();
	var sec = seconds.toString();
	
	// add leading zeroes
	if (min.length < 2) {
		min = '0' + min;
	}
	
	if (sec.length < 2) {
		sec = '0' + sec;
	}
	
	return min + ":" + sec;
}

//*****  SETUP FUNCTIONS  *****//
function preload(imgArray) {
	$(imgArray).each( function() {
		$('<img/>')[0].src = this;
	});
}

function initialize() {
	resetScore();
	
	var tiles = $("img.tile");	// grab all the tiles
	var tile = 1;				// this will be the tile number
	for(var row = 1; row <= $.puzzle.rows; row++) {
		for( var col = 1; col <= $.puzzle.cols; col++) {
			// filter to one element and add tile number,
			// x-position, and y-position to data
			$(tiles).eq(tile - 1).data({
				"tile": tile,
				"x-position": col,
				"y-position": row
			})
			// add the current position to attribute this will be used
			// later to verify that the tile is in the correct position
			.attr("data-position", tile)
			// position the image
			.css({
				left: (col-1) * $.puzzle.tileWidth,
				top: (row-1) * $.puzzle.tileHeight
			});
			tile++;	
		}
	}
	
	// tag the blank tile
	$("img[src$='blank.jpg']").attr("id", "blank");
	
	// remove the blank tile from the list, it can't be moved
	$(tiles).not("img#blank").bind('mouseup', function() {
		move($(this));
	});
}

//*****  TILE MANIPULATION FUNCTIONS *****//
function checkPuzzle() {
	var tiles = $("img.tile");
	
	$(tiles).removeClass("correct").addClass( function() {
		var tile = $(this).data("tile");
		var position = $(this).attr("data-position");
		var correct = (tile == position) ? "correct" : "";
		return correct;
	});
	
	var correct = $(tiles).filter( function() {
		return $(this).hasClass("correct");
	}).size();
	if(correct == $.puzzle.numTiles) {
		stopTimer();
		alert("Puzzle is solved!!!");
	}
}

function scramble() {
	stopTimer();
	resetScore();
	for( var i=0; i<= $.puzzle.scrambleCount; i++) {
		var tile1 = $("img.tile").get(Math.floor(Math.random() * $.puzzle.numTiles));
		var tile2 = $("img.tile").get(Math.floor(Math.random() * $.puzzle.numTiles));
		swap(tile1, tile2, false);
	}
}

function swap(tile1, tile2, animate) {
	var tile1Position = $(tile1).attr("data-position");
	var tile1X = $(tile1).data("x-position");
	var tile1Y = $(tile1).data("y-position");
	var tile1Left = $(tile1).css("left");
	var tile1Top = $(tile1).css("top");
	var tile2Position = $(tile2).attr("data-position");
	var tile2X = $(tile2).data("x-position");
	var tile2Y = $(tile2).data("y-position");
	var tile2Left = $(tile2).css("left");
	var tile2Top = $(tile2).css("top");
	
	// swap the tile data
	$(tile1).data({ "x-position": tile2X, "y-position": tile2Y })
		.attr("data-position", tile2Position);
	$(tile2).data({ "x-position": tile1X, "y-position": tile1Y })
		.attr("data-position", tile1Position);
		
	if (animate) {
		// detach mouseup handler to prevent corruption to tile layout
		// from a user clicking before animation is complete
		$("img.tile").unbind("mouseup");
		// copy tile1 to tile2
		var newTile = $(tile1).clone(true);
		$(newTile).css({ left: tile2Left, top: tile2Top })
			.attr("id", "tempImage")
			.insertAfter($(tile1));
		
		$(tile2).animate({ left: tile1Left, top: tile1Top }, $.uiSettings.slideSpeed, function() {
			$(tile1).css({ left: tile2Left, top: tile2Top });
			$("img[id='tempImage']").remove();
			// reattach mouseup handler
			$("img.tile").not("img#blank").bind("mouseup", function() {
				move($(this));
			});
			checkPuzzle();
		});
	}
	else {
		$(tile1).css({ left: tile2Left, top: tile2Top });
		$(tile2).css({ left: tile1Left, top: tile1Top });		
	}
}

function reset() {
	stopTimer();
	resetScore();
	var tiles = $("img.tile");
	
	var tile = 1;
	for(var row = 1; row <= $.puzzle.rows; row++) {
		for(var col = 1; col <= $.puzzle.cols; col++) {
			var current = $(tiles).filter( function() {
				return ( $(this).data("tile") == tile );
			});
			
			$(current).data({
				"x-position": col,
				"y-position": row
			})
			.attr("data-position", tile)
			.css({
				left: (col-1) * $.puzzle.tileWidth,
				top: (row-1) * $.puzzle.tileHeight
			});
			tile++;
		}
	}
}

function move(tile) {
	// start the timer if it isn't started
	if(!$.timer.isRunning) { startTimer(); }
	
	// get the position of the blank and the tile
	var blank = $("img[id='blank']");
	var blankPosition = $(blank).attr("data-position");
	var blankX = $(blank).data("x-position");
	var blankY = $(blank).data("y-position");
	var tilePosition = $(tile).attr("data-position");
	var tileX = $(tile).data("x-position");
	var tileY = $(tile).data("y-position");
	
	// check to see if the blank tile is one of the surrounding tiles
	var isMoveable =
		( (tileX == blankX) && ( (tileY - blankY) == 1 )) ? true : // top tile
		( (tileY == blankY) && ( (tileX - blankX) == 1 )) ? true : // right tile
		( (tileX == blankX) && ( (blankY - tileY) == 1 )) ? true : // bottom
		( (tileY == blankY) && ( (blankX - tileX) == 1 )) ? true : // left tile
		false;
		
	if(isMoveable) {
		swap(blank, tile, true);
		$.score.moves++;
		updateScore();
	}
	else {
		shake(tile);
	}
}

function shake(tile) {
	$(tile).css({
		"border": '1px solid #f00',
		"z-index": 30
	})
	.effect("shake", {distance: $.uiSettings.shakeDistance }, $.uiSettings.shakeSpeed, function() {
		$(this).css({
			"border": 'none',
			"z-index": 10
		});
	});
}