var tiles = {
    "floor" : new Tile("floor", [3,2], true, true),
    "empty" : new Tile("empty", [0,9]),
	"wall" : new Tile("wall", [3,3]),
	"tile" : new Tile("tile", [4,8], true, true),
	"wall00" : new Tile("wall00", [1,9]),
	"wall01" : new Tile("wall01", [2,9]),
	"wall02" : new Tile("wall02", [3,9]),
	"wall03" : new Tile("wall03", [4,9]),
	"wall04" : new Tile("wall04", [1,10]),
	"wall05" : new Tile("wall05", [2,10]),
	"wall06" : new Tile("wall06", [3,10]),
	"wall07" : new Tile("wall07", [4,10]),
	"wall08" : new Tile("wall08", [1,11]),
	"wall09" : new Tile("wall09", [2,11]),
	"wall10" : new Tile("wall10", [3,11]),
	"wall11" : new Tile("wall11", [4,11]),
	"wall12" : new Tile("wall12", [1,12]),
	"wall13" : new Tile("wall13", [2,12]),
	"wall14" : new Tile("wall14", [3,12]),
	"wall15" : new Tile("wall15", [4,12]),
	"caution0" : new Tile("caution0", [1,4], true, true),
	"caution1" : new Tile("caution1", [2,4], true, true),
	"caution2" : new Tile("caution2", [3,4], true, true),
	"caution3" : new Tile("caution3", [1,5], true, true),
	"caution4" : new Tile("caution4", [3,5], true, true),
	"caution5" : new Tile("caution5", [1,6], true, true),
	"caution6" : new Tile("caution6", [2,6], true, true),
	"caution7" : new Tile("caution7", [3,6], true, true),
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
}

function Map(width, height, data) {
    this.width = width;
    this.height = height;
    
    if (data)
        this.cells = eval(data);
    else {
        this.cells = new Array(width*height);
        for (var y = 0; y < height; y++)
            for (var x = 0; x < width; x++)
                this.cells[width*y+x] = new Cell((x == 0 || y == 0 || x == width - 1 || y == height - 1) ? "wall" : "floor", undefined);
    }
        
    this.getCell = function(xy) { return this.cells[xy[1]*this.width + xy[0]]; },

    this.save = function() {
        alert(this);
    }
    this.toString = function() {
        return "new Map("+this.width+","+this.height+",\"["+this.cells.toString()+"]\")";
    }
}

//var map = new Map(6,4,"[new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('floor', new Target('green', 's')),new Cell('floor', new Filter('green', 'e')),new Cell('floor', new Mirror('sw')),new Cell('floor', new Mirror('sw')),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('floor', new LaserRear('e')),new Cell('floor', new Laser('green', 'e')),new Cell('floor', new Mirror('double-nw')),new Cell('floor', new Mirror('double-ne')),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined)]");
var map = new Map(10,10);
