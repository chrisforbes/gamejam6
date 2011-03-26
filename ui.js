var tilePanels = new Array();
var actorPanels = new Array();
var tileSize = 32;
var isTileSelected = false;
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

function checkBounds(x, y, panelArray, yOffset, ctx) {
	var found = false;
	for (var i = 0; i < panelArray.length; i++) {
		if (x >= (i * tileSize) && x < ((i + 1) * tileSize) &&
			y >= yOffset && y < (tileSize + yOffset)) {
			selectedPanel = panelArray[i];
			found = true;
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(i * tileSize + 1, yOffset + 1,
				tileSize - 2, tileSize - 2);
		}
	}
	return found;
}

function uiClick(e) {
	var ui = $('#uiSurface');
	var x = e.pageX - ui.offset().left;
	var y = e.pageY - ui.offset().top;

	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,ui.width(),ui.height());
	drawPanels();
	selectedPanel = null;
	if (checkBounds(x, y, tilePanels, 0, ctx)) isTileSelected = true;
	if (checkBounds(x, y, actorPanels, tileSize, ctx)) isTileSelected = false;
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
	if (isTileSelected)
		map.getCell([xIndex,yIndex]).tile = selectedPanel;
	else
		map.getCell([xIndex,yIndex]).actor = selectedPanel;
}
