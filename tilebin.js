var tilePanels = new Array();

$(function() { 
	for (var tile in tiles) {
		tilePanels[tilePanels.length] = tiles[tile];
	}
	
	imageSheet.onload += drawTilebin();
	$('#tilebin').mousedown(tilebinClicked);
});

function tilebinClicked(e) {
    brush = new SelectionBrush();
	var ui = $('#tilebin');
	var maxPanelsInRow = ui.width() / tileSize;

    // Find the tile we clicked in
	var x = Math.floor((e.pageX - ui.offset().left) / tileSize);
	var y = Math.floor((e.pageY - ui.offset().top) / tileSize);
	var i = y*maxPanelsInRow + x;
	
	// Make the tile the active brush
	if (x < maxPanelsInRow && i < tilePanels.length)
	    brush = new Brush("tile", tilePanels[i], tilePanels[i].origin, function(x,y) {map.getCell([x,y]).tile = tilePanels[i]});
	
	drawActorbin();
	drawTilebin();
}

function drawTilebin() {
	var ui = $('#tilebin');
	if (! ui[0]) return;
	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,ui.width(),ui.height());

	var maxPanelsInRow = ui.width() / tileSize;

	var x = 0;
	var y = 0;
	for (var p in tilePanels) {
		ctx.drawImage(imageSheet, tilePanels[p].origin[0] * tileSize, 
			tilePanels[p].origin[1] * tileSize, tileSize, 
			tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
		
		// Draw selection rect
		if (brush && brush.type == "tile" && brush.value.name == tilePanels[p].name) {
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
