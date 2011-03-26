var uiPanels = new Array();
$(function() { 
	var ctx = $('#uiSurface')[0].getContext('2d');
	for (tile in tiles) {
		uiPanels[uiPanels.length] = tiles[tile];
	}

	for (o in objects) {
		uiPanels[uiPanels.length] = objects[o];
	}

	setTimeout('drawPanels()', 50); //Fuck chrome with a rusty iron pole.
	
	$('#uiSurface').mousedown(uiClick);
});

function drawPanels() {
	var ctx = $('#uiSurface')[0].getContext('2d');
	var x = 0;
	for (p in uiPanels) {
		ctx.drawImage(imageSheet, uiPanels[p].origin[0] * 32, 
			uiPanels[p].origin[1] * 32, 32, 32, x++ * 32, 0, 32, 32);
	}
}

function uiClick(e) {
	var ui = $('#uiSurface');
	var x = e.pageX - ui.offset().left;
	var y = e.pageY - ui.offset().top;

	var ctx = ui[0].getContext('2d');
	ctx.clearRect(0,0,256,100);
	drawPanels();
	for (var i = 0; i < uiPanels.length; i++) {
		if (x >= (i * 32) && x < ((i + 1) * 32) && y >= 0 && y < 32) {
			ctx.lineWidth = 3;
			ctx.strokeStyle = "limegreen";
			ctx.strokeRect(i * 32 + 1, 0 + 1, 32 - 2, 32 - 2);
		}
	}
}
