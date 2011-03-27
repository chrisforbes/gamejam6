var ticksPerSecond = 20;
var sidebarWidth;

var tiles = {
    "floor" : new Tile("floor", [0,7], true, true),
	"block" : new Tile("wall", [1,7]),
	"tile" : new Tile("tile", [2,7], true, true),
    "empty" : new Tile("empty", [3,7]),

	"wall00" : new Tile("wall00", [0,8]),
	"wall01" : new Tile("wall01", [1,8]),
	"wall02" : new Tile("wall02", [2,8]),
	"wall03" : new Tile("wall03", [3,8]),
	"wall04" : new Tile("wall04", [0,9]),
	"wall05" : new Tile("wall05", [1,9]),
	"wall06" : new Tile("wall06", [2,9]),
	"wall07" : new Tile("wall07", [3,9]),
	"wall08" : new Tile("wall08", [0,10]),
	"wall09" : new Tile("wall09", [1,10]),
	"wall10" : new Tile("wall10", [2,10]),
	"wall11" : new Tile("wall11", [3,10]),
	"wall12" : new Tile("wall12", [0,11]),
	"wall13" : new Tile("wall13", [1,11]),
	"wall14" : new Tile("wall14", [2,11]),
	"wall15" : new Tile("wall15", [3,11]),
	"caution0" : new Tile("caution0", [1,4], true, true),
	"caution1" : new Tile("caution1", [2,4], true, true),
	"caution2" : new Tile("caution2", [3,4], true, true),
	"caution3" : new Tile("caution3", [1,5], true, true),
	"caution4" : new Tile("caution4", [3,5], true, true),
	"caution5" : new Tile("caution5", [1,6], true, true),
	"caution6" : new Tile("caution6", [2,6], true, true),
	"caution7" : new Tile("caution7", [3,6], true, true),
	"caution8" : new Tile("caution8", [2,5], true, true),
	"caution9" : new Tile("caution9", [0,12], true, true),
	"caution10" : new Tile("caution10", [1,12], true, true),
	"caution11" : new Tile("caution11", [2,12], true, true),
	"caution12" : new Tile("caution12", [3,12], true, true),
	"tcaution0" : new Tile("tcaution0", [0,13], true, true),
	"tcaution1" : new Tile("tcaution1", [1,13], true, true),
	"tcaution2" : new Tile("tcaution2", [2,13], true, true),
	"tcaution3" : new Tile("tcaution3", [3,13], true, true),
	"tcaution4" : new Tile("tcaution4", [0,14], true, true),
	"tcaution5" : new Tile("tcaution5", [1,14], true, true),
	"tcaution6" : new Tile("tcaution6", [2,14], true, true),
	"tcaution7" : new Tile("tcaution7", [3,14], true, true),
	"tcaution8" : new Tile("tcaution8", [0,15], true, true),
	"tcaution9" : new Tile("tcaution9", [1,15], true, true),
	"tcaution10" : new Tile("tcaution10", [2,15], true, true),
	"tcaution11" : new Tile("tcaution11", [3,15], true, true),
	"tcaution12" : new Tile("tcaution12", [0,6], true, true),
};

function Tile(name, origin, allowPlace, allowBeam) {
    this.name = name;
    this.allowPlace = (allowPlace == undefined) ? false : allowPlace;
    this.allowBeam = (allowBeam == undefined) ? false : allowBeam;
    this.origin = origin;
    
    this.toString = function() {
        return "'"+this.name+"'";
    }
}

// Cells
function Cell(tile, actor) {
    this.tile = tiles[tile];
    this.actor = actor;
    
    this.drawPreBeam = function(x,y,ctx) {
        ctx.drawImage(imageSheet, 32*this.tile.origin[0], 32*this.tile.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    
    this.fireLaser = function(x,y,ctx) {
        if (this.actor && this.actor.fireLaser)
            this.actor.fireLaser(x,y,ctx);
    }
    
    this.drawPostBeam = function(x,y,ctx) {
        if (this.actor)
            ctx.drawImage(imageSheet, 32*this.actor.origin[0], 32*this.actor.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    
    this.beamHit = function(color, dir) {
        if (!this.tile.allowBeam)
            return undefined;
        
        if (this.actor && this.actor.beamHit)
            return this.actor.beamHit(color, dir);
            
        return dir;
    }
    
    this.toString = function() {
        return "new Cell("+this.tile+", "+this.actor+")";
    }
    
    this.allowsActor = function() {
        return this.tile.allowPlace && (!this.actor || this.actor.editable());
    }
}

function Map(width, height, data, parts, time) {
    this.width = width;
    this.height = height;
    this.stopped = false;
    this.remainingTicks = ticksPerSecond*time;
    this.totalTicks = ticksPerSecond*time;
    
    if (parts)
        this.parts = parts;
    else {
        this.parts = {
            'mirror' : 13,
            'laser-red' : 1,
			'target-red' : 1
        };
    }
    
    if (data)
        this.cells = eval(data);
    else {
        this.cells = new Array(width*height);
        for (var y = 0; y < height; y++)
            for (var x = 0; x < width; x++)
                this.cells[width*y+x] = new Cell((x == 0 || y == 0 || x == width - 1 || y == height - 1) ? "block" : "floor", undefined);
    }
    
    // TODO: Calculate editor values once
    this.getActorsAndCounts = function() {
        if (editor) {
            var ret = {};
            for (var i in actorTypes)
                ret[i] = -1;
            return ret;
        }
        return this.parts;
    }
    
    this.getCell = function(xy) { return this.cells[xy[1]*this.width + xy[0]]; },

    this.toString = function() {
        return "new Map("+this.width+","+this.height+",\"["+this.cells.toString()+"]\")";
    }
    
    this.tick = function() {
        if (editor || this.stopped) return;
        
        // Draw timer bar - GIANT HACK
        var canvas = $('#gameSurface')[0];
        var ctx = canvas.getContext('2d');
        var x = canvas.width - sidebarWidth;
        var y = 0;
        ctx.drawImage(imageSheet, 8 * 32, 8 * 32, 32, 32, 
			x, y, 32, 32 );
		ctx.drawImage(imageSheet, 8 * 32, 9 * 32, 32, 32, 
			x, y+32, 32, 192 );
		ctx.drawImage(imageSheet, 8 * 32, 10 * 32, 32, 32, 
			x, y+32+192, 32, 32 );	
		ctx.fillStyle = "red";
		var height = 230 * this.remainingTicks / this.totalTicks;
		ctx.fillRect(x+12,y+10 + 232 - height,10,height);
		
	    ctx.drawImage(imageSheet, 9 * 32, 9 * 32, 92, 16, 
			x+6, y+8, 92, 16 );
			
		ctx.drawImage(imageSheet, 9 * 32, 8 * 32, 64, 16, 
			x+6, y+8+115, 64, 16 );
			
		ctx.drawImage(imageSheet, 9 * 32, 8 * 32+16, 64, 16, 
			x+6, y+8+230, 64, 16 );	
		
        if ($('#fail').is(':hidden') && --this.remainingTicks <= 0) {
            this.stopped = true;
            $('#fail').show();
        }

		
		if ($('#success').is(':hidden')) {
			var win = true;
			var containsWinnableActors = false;
			for (i in map.cells) {
				if (map.cells[i].actor && map.cells[i].actor.isWinnable) {
					containsWinnableActors = true;
					if (!map.cells[i].actor.isWin) 
						win = false;
        		}
        	}

        	if (win && containsWinnableActors) {
        	    this.stopped = true;
        		$('#success').show();
        	}
        }
    }
}

function drawBigDigit(ctx,x,y,n)
{
	var m = 0+n;
	if (n < 0 || n == undefined) m = 10;
	if (n == 'x') m = 11;
		
	col = m & 3;
	row = m;
		
	ctx.drawImage(imageSheet, 8 * 32 + col*16, 11 * 32 + row*16, 16, 32, 
			x, y, 16, 32 );
}

function setLevel(l) {
    if (l < 0 || l >= levels.length) {
        alert("Invalid level selected");
        return;
    }
    $('#level_counter').html(l+1);
    map = jQuery.extend(true, {}, levels[l]);
    drawActorbin();
    drawTilebin();
}

var levels = [
    new Map(15,10,"[new Cell('wall03', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall05', undefined),new Cell('wall06', undefined),new Cell('caution1', undefined),new Cell('caution1', undefined),new Cell('caution2', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('floor', new LaserRear('laser-back','e')),new Cell('floor', new Laser('laser-red','red', 'e')),new Cell('caution4', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('caution1', undefined),new Cell('caution1', undefined),new Cell('caution7', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('floor', undefined),new Cell('floor', new Fluff('fluff','2')),new Cell('caution0', undefined),new Cell('caution1', undefined),new Cell('caution2', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall07', undefined),new Cell('floor', new Fluff('fluff','0')),new Cell('floor', undefined),new Cell('caution3', undefined),new Cell('floor', new Target('target-red','red', 'n')),new Cell('caution4', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('floor', new Fluff('fluff','4')),new Cell('floor', new Fluff('fluff','7')),new Cell('caution3', undefined),new Cell('wall07', undefined),new Cell('caution4', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall10', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall08', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall08', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall12', undefined)]", {'mirror' : 1}, 20),
    new Map(15,10,"[new Cell('wall03', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall01', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall01', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall05', undefined),new Cell('wall06', undefined),new Cell('caution1', undefined),new Cell('caution1', undefined),new Cell('caution2', undefined),new Cell('floor', undefined),new Cell('wall14', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall14', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution0', undefined),new Cell('caution1', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('floor', new LaserRear('laser-back','e')),new Cell('floor', new Laser('laser-red','red', 'e')),new Cell('caution4', undefined),new Cell('floor', undefined),new Cell('caution3', new Filter('filter-red','red', 'e')),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('caution3', new Filter('filter-blue','blue', 'e')),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution3', undefined),new Cell('floor', new Target('target-blue','blue', 'w')),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('caution1', undefined),new Cell('caution1', undefined),new Cell('caution7', undefined),new Cell('floor', undefined),new Cell('wall07', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall07', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution5', undefined),new Cell('caution6', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall06', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('caution1', undefined),new Cell('caution1', undefined),new Cell('caution2', undefined),new Cell('floor', undefined),new Cell('wall14', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall14', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution0', undefined),new Cell('caution1', undefined),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('floor', new LaserRear('laser-back','e')),new Cell('floor', new Laser('laser-blue','blue', 'e')),new Cell('caution4', undefined),new Cell('floor', undefined),new Cell('caution3', new Filter('filter-blue','blue', 'e')),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('caution3', new Filter('filter-red','red', 'e')),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution3', undefined),new Cell('floor', new Target('target-red','red', 'w')),new Cell('wall06', undefined),new Cell('wall06', undefined),new Cell('caution6', undefined),new Cell('caution6', undefined),new Cell('caution7', undefined),new Cell('floor', undefined),new Cell('wall07', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('tile', undefined),new Cell('wall07', undefined),new Cell('floor', undefined),new Cell('floor', undefined),new Cell('caution5', undefined),new Cell('caution6', undefined),new Cell('wall06', undefined),new Cell('wall10', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall08', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall08', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall09', undefined),new Cell('wall12', undefined)]", {'mirror' : 6, 'mirror-double' : 1}, 60),
];
