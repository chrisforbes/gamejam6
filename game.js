// Tile definitions
var imageSheet = new Image();
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
        case "green": o = 128; break;
        case "blue": o = 64; break;
    }
    ctx.drawImage(imageSheet, 32*origin[0], 32*origin[1]+o, 32, 32, xy[0]*32, xy[1]*32, 32, 32);
}

function drawSparkles(cx,cy,color,dir,ctx) {
	var c = color == "green" ? 2 : color == "blue" ? 1 : 0;
	var d = 0;
	for( var i in sparkleOffsets )
		if (isEqualDir(sparkleOffsets[i][0],dir)) {
			d = sparkleOffsets[i][1];
			break;
		}
	
	var origin = [ 13 + tick%3, c + 3*d ];	
	
	ctx.drawImage( imageSheet, 32*origin[0], 32*origin[1], 32, 32, cx*32, cy*32, 32, 32 );
}

var tick = 0;

$(function() {
	setInterval( "main()", 50 );
});

function main() {
    var canvas = $('#gameSurface')[0];
    var ctx = canvas.getContext('2d');
    if (canvas.width != map.width * 32) {
        canvas.width = map.width * 32;
	$('#gameWrapper').width(map.width * 32);
    }
    if (canvas.height != map.height * 32) {
    	canvas.height = map.height * 32;
	$('#gameWrapper').height(map.height * 32);
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
            
    
    if (selectedPanel == null || nearestTileX == null) return;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowOffsetX = -3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 2;
    ctx.drawImage(imageSheet, selectedPanel.origin[0] * tileSize,
        selectedPanel.origin[1] * tileSize, tileSize, tileSize,
        nearestTileX + 3, nearestTileY - 3, tileSize, tileSize);
    ctx.shadowColor = "rgba(0,0,0,0)";
}
