var tiles = {
    "wall" : {
        "name" : "wall",
        "allowPlace" : false,
        "allowBeam" : false,
        "origin" : [3,3],
    },
    "floor" : {
        "name" : "floor",
        "allowPlace" : true,
        "allowBeam" : true,
        "origin" : [3,2],
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
        if (actor && actor.fireLaser)
            actor.fireLaser(x,y,ctx);
    }
    
    this.drawPostBeam = function(x,y,ctx) {
        if (actor)
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
        return "new Cell('"+this.tile.name+"', "+this.actor+")";
    }
}

function Map(width, height, data) {
    this.width = width;
    this.height = height;
    this.cells = eval(data);
    this.getCell = function(xy) { return this.cells[xy[1]*map.width + xy[0]]; },

    this.save = function() {
        alert(this);
    }
    this.toString = function() {
        return "new Map("+this.width+","+this.height+",\"["+this.cells.toString()+"]\")";
    }
}

var map = new Map(6,4,"[new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('floor', new Target('green', 's')),new Cell('floor', new Filter('green', 'e')),new Cell('floor', new Mirror('sw')),new Cell('floor', new Mirror('sw')),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('floor', new LaserRear('e')),new Cell('floor', new Laser('green', 'e')),new Cell('floor', new Mirror('double-nw')),new Cell('floor', new Mirror('double-ne')),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined),new Cell('wall', undefined)]");
