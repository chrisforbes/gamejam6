$(function() { 
	imageSheet.onload = drawActorbin();
	$('#actorbin').mousedown(actorbinClicked);
});
//function Brush(type, value, origin, onPaint) {


function ActorBrush(actor) {
    this.type = "actor";
    this.value = actor;
    this.origin = actor.origin;
    this.onPaint = function(x,y) {
        if (!map.getCell([x,y]).allowsActor()) return;

        var b = map.getCell([x,y]).actor;
        map.getCell([x,y]).actor = this.value;
        brush = b ? new ActorBrush(b) : new SelectionBrush();
    };

    this.rotate = function() {
    	this.value = this.value.rotate();
	    this.origin = this.value.origin;
    };
    
    this.draw = function(ctx) {
        if (nearestTileX == null) return;
        
        // Actor
        ctx.globalAlpha = 0.5;
        ctx.drawImage(imageSheet, this.origin[0] * tileSize,
            this.origin[1] * tileSize, tileSize, tileSize,
            nearestTileX, nearestTileY, tileSize, tileSize);
        ctx.globalAlpha = 1;

        // Selection rect
        var cy = map.getCell([nearestTileX / tileSize, nearestTileY / tileSize]).allowsActor() ? 14 : 15;
        ctx.drawImage(imageSheet, (4 + (tick >> 1)%3) * tileSize,
            cy * tileSize, tileSize, tileSize,
            nearestTileX, nearestTileY, tileSize, tileSize);
        
    }
}
ActorBrush.prototype = new Brush();

function actorbinClicked(e) {
    brush = new SelectionBrush();
	var ui = $('#actorbin');
	var maxPanelsInRow = ui.width() / tileSize;

    // Find the tile we clicked in
	var x = Math.floor((e.pageX - ui.offset().left) / tileSize);
	var y = Math.floor((e.pageY - ui.offset().top) / tileSize);
	var i = y*maxPanelsInRow + x;
	
	var actors = map.getActorsAndCounts();
	// Make the tile the active brush
	if (x < maxPanelsInRow && i < actors.length) {
	    brush = new ActorBrush(actorTypes[actors[i][0]]);
	}
	drawActorbin();
	drawTilebin();
}

function drawDigit(ctx,x,y,n)
{
	var m = 0+n;
	if (n < 0 || n == undefined) m = 10;
	if (n == 'x') m = 11;
		
	col = m & 3;
	row = m >> 2;
		
	ctx.drawImage(imageSheet, 4 * 32 + col*16, 12 * 32 + row*16, 16, 16, 
			x, y, 16, 16 );
		ctx.drawImage(imageSheet, 4 * 32 + col*16, 12 * 32 + row*16, 16, 16, 
			x, y, 16, 16 );
}

function drawActorbin() {
	var ui = $('#actorbin');
	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,ui.width(),ui.height());

	var maxPanelsInRow = ui.width() / tileSize;

	var x = 0;
	var y = 0;
	var actors = map.getActorsAndCounts();
	for (var p in actors) {
	    var a = actorTypes[actors[p][0]];
	    var count = actors[p][1];
	    
	    if (!count) ctx.globalAlpha = 0.3;
	    
	    // Draw selection rect
		if (brush && brush.type == "actor" && brush.value == a) {
		    ctx.lineWidth = 3;
	        ctx.strokeStyle = "limegreen";
        	ctx.strokeRect(x * tileSize+1, y * tileSize+1,
        		tileSize-2, tileSize-2);
		}
	    
		ctx.drawImage(imageSheet, a.origin[0] * tileSize, 
			a.origin[1] * tileSize, tileSize, 
			tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
		
		var u = x * tileSize + 24;
		var first = true;
		while( first || count > 0 ) {
			drawDigit( ctx, u, y * tileSize + 21, count % 10 );
			u -= 8;
			count = Math.floor( count / 10 );
			first = false;
		}
		drawDigit( ctx, u, y * tileSize + 21, 'x' );
		
		ctx.globalAlpha = 1;
		
		x++;
		if (x >= maxPanelsInRow) {
			x = 0;
			y++;
		}
	}
}
