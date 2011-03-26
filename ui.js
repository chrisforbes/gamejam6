var uiPanels = new Array();
var tileSize = 32;
$(function() { 
	var ctx = $('#uiSurface')[0].getContext('2d');
	for (var tile in tiles) {
		uiPanels[uiPanels.length] = tiles[tile];
	}

	for (var o in objects) {
		uiPanels[uiPanels.length] = objects[o];
	}

	setTimeout('drawPanels()', 50); //Fuck chrome with a rusty iron pole.
	
	$('#uiSurface').mousedown(uiClick);
	$('#gameSurface').mousemove(gameSurfaceMove);
});

function drawPanels() {
	var ctx = $('#uiSurface')[0].getContext('2d');
	var x = 0;
	for (var p in uiPanels) {
		ctx.drawImage(imageSheet, uiPanels[p].origin[0] * tileSize, 
			uiPanels[p].origin[1] * tileSize, tileSize, 
			tileSize, x++ * tileSize, 0, tileSize, tileSize);
	}
}

function uiClick(e) {
	var ui = $('#uiSurface');
	var x = e.pageX - ui.offset().left;
	var y = e.pageY - ui.offset().top;

	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,256,100);
	drawPanels();
	selectedPanel = null;
	for (var i = 0; i < uiPanels.length; i++) {
		if (x >= (i * tileSize) && x < ((i + 1) * tileSize) && 
			y >= 0 && y < tileSize) {
			selectedPanel = uiPanels[i];
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(i * tileSize + 1, 0 + 1, 
				tileSize - 2, tileSize - 2);
		}
	}
}

function gameSurfaceMove(e) {
	if (selectedPanel == null) return;
	var game = $('#gameSurface');
	var x = e.pageX - game.offset().left;
	var y = e.pageY - game.offset().top;

	nearestTileX = Math.floor(x / tileSize) * tileSize;
	nearestTileY = Math.floor(y / tileSize) * tileSize;

}
