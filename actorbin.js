$(function() { 
	imageSheet.onload = drawActorbin();
	$('#actorbin').mousedown(actorbinClicked);
});

function actorbinClicked(e) {
    brush = undefined;
	var ui = $('#actorbin');
	var maxPanelsInRow = ui.width() / tileSize;

    // Find the tile we clicked in
	var x = Math.floor((e.pageX - ui.offset().left) / tileSize);
	var y = Math.floor((e.pageY - ui.offset().top) / tileSize);
	var i = y*maxPanelsInRow + x;
	
	var actors = map.getActorsAndCounts();
	// Make the tile the active brush
	if (x < maxPanelsInRow && i < actors.length) {
	    brush = new Brush("actor", actors[i][0], actorTypes[actors[i][0]].origin);
	}
	drawActorbin();
	drawTilebin();
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
		ctx.drawImage(imageSheet, a.origin[0] * tileSize, 
			a.origin[1] * tileSize, tileSize, 
			tileSize, x * tileSize, y * tileSize, tileSize, tileSize);

		// Draw selection rect
		if (brush && brush.type == "actor" && brush.value == actors[p][0]) {
		    ctx.lineWidth = 3;
	        ctx.strokeStyle = "limegreen";
        	ctx.strokeRect(x * tileSize + 1, y * tileSize + 1,
        		tileSize - 2, tileSize - 2);
		}
		x++;
		if (x >= maxPanelsInRow) {
			x = 0;
			y++;
		}
	}
}
