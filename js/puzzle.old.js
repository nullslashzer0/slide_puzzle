/* Javascript File */

// setup board
$.pieces = new Array(25);
$.pieces[0]  = { top: 0,   left: 0 }; 
$.pieces[1]  = { top: 0,   left: 120 };
$.pieces[2]  = { top: 0,   left: 240 };
$.pieces[3]  = { top: 0,   left: 360 };
$.pieces[4]  = { top: 0,   left: 480 };
$.pieces[5]  = { top: 120, left: 0 }; 
$.pieces[6]  = { top: 120, left: 120 };
$.pieces[7]  = { top: 120, left: 240 };
$.pieces[8]  = { top: 120, left: 360 };
$.pieces[9]  = { top: 120, left: 480 };
$.pieces[10] = { top: 240, left: 0 }; 
$.pieces[11] = { top: 240, left: 120 };
$.pieces[12] = { top: 240, left: 240 };
$.pieces[13] = { top: 240, left: 360 };
$.pieces[14] = { top: 240, left: 480 };
$.pieces[15] = { top: 360, left: 0 }; 
$.pieces[16] = { top: 360, left: 120 };
$.pieces[17] = { top: 360, left: 240 };
$.pieces[18] = { top: 360, left: 360 };
$.pieces[19] = { top: 360, left: 480 };
$.pieces[20] = { top: 480, left: 0 }; 
$.pieces[21] = { top: 480, left: 120 };
$.pieces[22] = { top: 480, left: 240 };
$.pieces[23] = { top: 480, left: 360 };
$.pieces[24] = { top: 480, left: 480 };

function initBoard() {
	$("img.piece")
		.each( function(n) {
			$(this).css({
				top: $.pieces[n].top,
				left: $.pieces[n].left
			})
			.data("data-correct-position",n)
			.attr("data-index",n)
		})
		.filter('img[src$="blank.jpg"]')
		.attr("id","blank");
}

function setMoveableSquares() {
	var blank = $('img[id="blank"]');
	var position = $(blank).attr("data-index");
	// get the indexes of the surrounding squares
	var leftIndex = parseInt(position) - 1;
	var topIndex = parseInt(position) - 5;
	var rightIndex = parseInt(position) + 1;
	var bottomIndex = parseInt(position) + 5;
	
	// clear click binding from all puzzle pieces
	$("img.piece").unbind('click');
	
	if (leftIndex >= 0 && leftIndex < 5) {
		moveRight(leftIndex);
	}
	
	if (rightIndex >= 0 && rightIndex < 5) {
		moveLeft(rightIndex);
	}
	
	if (topIndex >= 0 && topIndex < 25) {
		moveDown(topIndex);
	}
	
	if (bottomIndex >= 0 && bottomIndex < 25) {
		moveUp(bottomIndex);
	}	
}

function moveLeft(rightIndex) {
	var right = $('img[data-index=' + rightIndex + ']');
	$(right)
		.bind('click', function(event) 
		{
			// move this piece left and replace with blank
			var rightTop = $(this).css("top");
			var rightLeft = $(this).css("left");
			var rightPosition = $(this).attr("data-index");
			var blankTop = $(blank).css("top");
			var blankLeft = $(blank).css("left");
			var blankPosition = $(blank).attr("data-index");
			$(this)
				.css({ top: blankTop, left: blankLeft })
				.attr("data-index",blankPosition);
			$(blank)
				.css({ top: rightTop, left: rightLeft})
				.attr("data-index",rightPosition);
			setMoveableSquares();
		});
}

function moveRight(leftIndex) {
	var left = $('img[data-index=' + leftIndex + ']');
	$(left)
		.bind('click', function(event) 
		{
			// move this piece left and replace with blank
			var leftTop = $(this).css("top");
			var leftLeft = $(this).css("left");
			var leftPosition = $(this).attr("data-index");
			var blankTop = $(blank).css("top");
			var blankLeft = $(blank).css("left");
			var blankPosition = $(blank).attr("data-index");
			$(this)
				.css({ top: blankTop, left: blankLeft })
				.attr("data-index",blankPosition);
			$(blank)
				.css({ top: leftTop, left: leftLeft})
				.attr("data-index",leftPosition);
			setMoveableSquares();
		});
}

function moveUp(bottomIndex) {
	var bottom = $('img[data-index=' + bottomIndex + ']');
	$(bottom)
		.bind('click', function(event) 
		{
			// move this piece left and replace with blank
			var bottomTop = $(this).css("top");
			var bottomLeft = $(this).css("left");
			var bottomPosition = $(this).attr("data-index");
			var blankTop = $(blank).css("top");
			var blankLeft = $(blank).css("left");
			var blankPosition = $(blank).attr("data-index");
			$(this)
				.css({ top: blankTop, left: blankLeft })
				.attr("data-index",blankPosition);
			$(blank)
				.css({ top: bottomTop, left: bottomLeft})
				.attr("data-index",bottomPosition);
			setMoveableSquares();
		});
}

function moveDown(topIndex) {
	var top = $('img[data-index=' + topIndex + ']');
	$(top)
		.bind('click', function(event) 
		{
			// move this piece left and replace with blank
			var topTop = $(this).css("top");
			var topLeft = $(this).css("left");
			var topPosition = $(this).attr("data-index");
			var blankTop = $(blank).css("top");
			var blankLeft = $(blank).css("left");
			var blankPosition = $(blank).attr("data-index");
			$(this)
				.css({ top: blankTop, left: blankLeft })
				.attr("data-index",blankPosition);
			$(blank)
				.css({ top: topTop, left: topLeft})
				.attr("data-index",topPosition);
			setMoveableSquares();
		});
}