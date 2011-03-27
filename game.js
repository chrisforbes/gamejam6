// Tile definitions
var imageSheet = new Image();
var tileSize = 32;
imageSheet.src = 'sprites.png';
var selectedPanel = null;
var nearestTileX = null;
var nearestTileY = null;

var beamArt = [
    [[1,0], [1,0],   [8,0]],
    [[1,0], [0,1],   [9,1]],
    [[1,0], [0,-1],  [9,0]],
    [[-1,0],[-1,0], [8,0]],
    [[-1,0],[0,-1], [10,0]],
    [[-1,0],[0,1],  [10,1]],
    [[0,1], [0,1],   [8,1]],
    [[0,1], [-1,0],  [9,0]],
    [[0,1], [1,0],   [10,0]],
    [[0,-1],[0,-1], [8,1]],
    [[0,-1],[-1,0], [9,1]],
    [[0,-1],[1,0],  [10,1]]
];

var sparkleOffsets = [
	[[-1,0], 0],
	[[1,0], 2],
	[[0,-1], 1],
	[[0,1], 3]
];

function isEqualDir(d1, d2) {
    return d1[0] == d2[0] && d1[1] == d2[1];
}


function isOppositeDir(d1, d2) {
    return d1[0] + d2[0] == 0 && d1[1] + d2[1] == 0;
}


function drawBeam(color, xy, d0, d1, ctx) {
    var origin = undefined;
    for (var i in beamArt)
        if (isEqualDir(beamArt[i][0],d0) && isEqualDir(beamArt[i][1],d1)) {
            origin = beamArt[i][2];
            break;
        }
    var o = 0;
    switch(color) {
        case "green": o = 4*tileSize; break;
        case "blue": o = 2*tileSize; break;
        case "white": o = 6 * tileSize; break;
    }
    ctx.drawImage(imageSheet, tileSize*origin[0], tileSize*origin[1]+o, tileSize, tileSize, xy[0]*tileSize, xy[1]*tileSize, tileSize, tileSize);
}

function drawSparkles(cx,cy,color,dir,ctx) {
	var c = color == "green" ? 2 : color == "blue" ? 1 : color == "white" ? 3 : 0;
	var d = 0;
	for( var i in sparkleOffsets )
		if (isEqualDir(sparkleOffsets[i][0],dir)) {
			d = sparkleOffsets[i][1];
			break;
		}
	
	var origin = [ 13 + tick%3, c + 4*d ];	
	
	ctx.drawImage( imageSheet, tileSize*origin[0], tileSize*origin[1], tileSize, tileSize, cx*tileSize, cy*tileSize, tileSize, tileSize );
}

var tick = 0;

$(function() {
    $('#gameSurface').mousemove(gameSurfaceMove);
	$('#gameSurface').mouseout(function() { nearestTileX = null; });
	$('#gameSurface').mousedown(gameSurfaceClick);
	$(document).keydown(gameSurfaceKeyDown);
	
	setInterval( "main()", 50 );
});

function SelectionBrush() {
    this.type = "select";
    this.origin = [4,14];
    this.onPaint = function(x,y) {
        var a = map.getCell([x,y]).actor;
        if (a) {
            brush = new ActorBrush(a);
            map.getCell([x,y]).actor = undefined;
        }
    };
    
    this.draw = function(ctx) {
        if (nearestTileX == null) return;
        
        ctx.drawImage(imageSheet, (4 + (tick >> 1)%3) * tileSize,
            14 * tileSize, tileSize, tileSize,
            nearestTileX, nearestTileY, tileSize, tileSize);
    }
}
SelectionBrush.prototype = new Brush();

var brush = new SelectionBrush();

function Brush(type, value, origin, onPaint) {
    this.type = type;
    this.value = value;
    this.origin = origin;
    this.onPaint = onPaint;
    this.draw = function(ctx) {
        if (nearestTileX == null) return;

        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowOffsetX = -3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;
        ctx.drawImage(imageSheet, this.origin[0] * tileSize,
            this.origin[1] * tileSize, tileSize, tileSize,
            nearestTileX + 3, nearestTileY - 3, tileSize, tileSize);
        ctx.shadowColor = "rgba(0,0,0,0)";
    }
    
    this.paint = function() {
        if (nearestTileX == null) return;
	    var xIndex = nearestTileX / tileSize;
	    var yIndex = nearestTileY / tileSize;
	    
	    this.onPaint(xIndex, yIndex);
    }
}

function gameSurfaceMove(e) {
	var game = $('#gameSurface');
	var x = e.pageX - game.offset().left;
	var y = e.pageY - game.offset().top;

	nearestTileX = Math.floor(x / tileSize) * tileSize;
	nearestTileY = Math.floor(y / tileSize) * tileSize;
}

function gameSurfaceClick(e) {
	if (brush)
		brush.paint();
}

function gameSurfaceKeyDown(e) {
    if (brush && brush.rotate && e.which == 82)
    	brush.rotate();
}

function main() {
    var canvas = $('#gameSurface')[0];
    var ctx = canvas.getContext('2d');
    if (canvas.width != map.width * tileSize) {
        canvas.width = map.width * tileSize;
	$('#gameWrapper').width(map.width * tileSize);
    }
    if (canvas.height != map.height * tileSize) {
    	canvas.height = map.height * tileSize;
	$('#gameWrapper').height(map.height * tileSize);
    }
    ++tick;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    // Draw the map
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].drawPreBeam(x,y,ctx);
        }
    
    // Draw lasers
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].fireLaser(x,y,ctx);
        }
    
    // Actors
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].drawPostBeam(x,y,ctx);
        }
    
    // Brush   
    if (brush)
        brush.draw(ctx);

    // Evaluate win state
    if ($('#success').is(':hidden')) {
        var win = true;
        var containsWinnableActors = false;
        for (i in map.cells) {
            if (map.cells[i].actor && map.cells[i].actor.isWinnable) {
                containsWinnableActors = true;
                if (!map.cells[i].actor.isWin) 
                    win = false;
	    }
        }

        if (win && containsWinnableActors) {
            $('#success').show();
        }
    }
}
