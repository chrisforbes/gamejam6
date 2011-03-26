$(function() { 
	var ctx = $('#uiSurface')[0].getContext('2d');
	var x = 0;
	for (tile in tiles) {
		ctx.drawImage(imageSheet, 32*tiles[tile].origin[0], 32*tiles[tile].origin[1], 32, 32, x++*32, 0, 32, 32);
	}
});
