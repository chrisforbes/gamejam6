var tilePanels = new Array();
var actorPanels = new Array();
var tileSize = 32;
$(function() { 
	var ctx = $('#uiSurface')[0].getContext('2d');
	for (var tile in tiles) {
		tilePanels[tilePanels.length] = tiles[tile];
	}

	for (var i in actorTypes) {
		actorPanels[actorPanels.length] = actorTypes[i];
	}

	setTimeout('drawPanels()', 50); //Fuck chrome with a rusty iron pole.
	
	$('#uiSurface').mousedown(uiClick);
	$('#gameSurface').mousemove(gameSurfaceMove);
	$('#gameSurface').mouseout(function() { nearestTileX = null; });
	$('#gameSurface').click(gameSurfaceClick);
});

function drawPanels() {
	var ctx = $('#uiSurface')[0].getContext('2d');
	var x = 0;
	for (var p in tilePanels) {
		ctx.drawImage(imageSheet, tilePanels[p].origin[0] * tileSize, 
			tilePanels[p].origin[1] * tileSize, tileSize, 
			tileSize, x++ * tileSize, 0, tileSize, tileSize);
	}
	x = 0
	for (var a in actorPanels) {
		ctx.drawImage(imageSheet, actorPanels[a].origin[0] * tileSize,
			actorPanels[a].origin[1] * tileSize, tileSize,
			tileSize, x++ * tileSize, tileSize, tileSize, tileSize);
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
	for (var i = 0; i < tilePanels.length; i++) {
		if (x >= (i * tileSize) && x < ((i + 1) * tileSize) && 
			y >= 0 && y < tileSize) {
			selectedPanel = tilePanels[i];
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(i * tileSize + 1, 0 + 1, 
				tileSize - 2, tileSize - 2);
		}
	}
	for (var i = 0; i < actorPanels.length; i++) {
		if (x >= (i * tileSize) && x < ((i + 1) * tileSize) &&
			y >= tileSize && y < (tileSize * 2)) {
			selectedPanel = actorPanels[i];
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(i * tileSize + 1, tileSize + 1,
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

function gameSurfaceClick(e) {
	if (selectedPanel == null || nearestTileX == null) return;
	var xIndex = nearestTileX / tileSize;
	var yIndex = nearestTileY / tileSize;
	map.getCell([xIndex,yIndex]).tile = selectedPanel;
}
