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
	var y = 0;
	var maxPanelsInRow = $('#uiSurface').width() / tileSize;
	for (var p in tilePanels) {
		ctx.drawImage(imageSheet, tilePanels[p].origin[0] * tileSize, 
			tilePanels[p].origin[1] * tileSize, tileSize, 
			tileSize, x++ * tileSize, y * tileSize, tileSize, tileSize);
		if (x >= maxPanelsInRow) {
			x = 0;
			y++;
		}
	}
	x = 0;
	y++;
	for (var a in actorPanels) {
		ctx.drawImage(imageSheet, actorPanels[a].origin[0] * tileSize,
			actorPanels[a].origin[1] * tileSize, tileSize,
			tileSize, x++ * tileSize, y * tileSize, tileSize, tileSize);
		if (x >= maxPanelsInRow) {
			x = 0;
			y++;
		}
	}
}

function checkBounds(x, y, panelArray, yOffset, ctx) {
	var found = false;
	var maxPanelsInRow = $('#uiSurface').width() / tileSize;
	for (var i = 0; i < panelArray.length; i++) {
		var j = i % maxPanelsInRow; 
		var z = yOffset + (Math.floor(i / maxPanelsInRow) * tileSize);
		if (x >= (j * tileSize) && x < ((j + 1) * tileSize) &&
			y >= z && y < (tileSize + z)) {
			selectedPanel = panelArray[i];
			found = true;
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(j * tileSize + 1, z + 1,
				tileSize - 2, tileSize - 2);
		}
	}
	return found;
}

function uiClick(e) {
	var ui = $('#uiSurface');
	var maxPanelsInRow = ui.width() / tileSize;
	var x = e.pageX - ui.offset().left;
	var y = e.pageY - ui.offset().top;

	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,ui.width(),ui.height());
	drawPanels();
	selectedPanel = null;
	if (checkBounds(x, y, tilePanels, 0, ctx)) isTileSelected = true;
	if (checkBounds(x, y, actorPanels, 
		tileSize * (Math.floor(tilePanels.length / maxPanelsInRow) + 1), ctx)) isTileSelected = false;
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
