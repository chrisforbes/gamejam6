
// Actors
function Target(name, color, dir) {
    this.name = name;
    this.color = color;
    this.dirString = dir;
    this.isWinnable = true;
    this.isWin = false;
    var c = 8;
    switch(color) {
        case "red": c = 8; break;
        case "green": c = 6; break;
        case "blue": c = 7; break;
        case "white": c = 5; break;
    }
    switch (dir) {
        case "n":
            this.origin = [7,c];
            this.direction = [0,1];
        break;
        case "e":
            this.origin = [4,c];
            this.direction = [-1,0];
        break;
        case "s":
            this.origin = [5,c];
            this.direction = [0,-1];
        break;
        case "w":
            this.origin = [6,c];
            this.direction = [1,0];
        break;
    }
    
    this.beamHit = function(color, dir) {
        if (color == this.color && isEqualDir(dir, this.direction)) {
    		this.isWin = true;
    	}
            
        return undefined;
    }
    
    this.toString = function() {
        return "new Target('"+this.name+"','"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
    		case "n":
    	    		return new Target(this.name, this.color, "e");
    		case "e":
    			return new Target(this.name, this.color, "s");
    		case "s":
    			return new Target(this.name, this.color, "w");
    		case "w":
    			return new Target(this.name, this.color, "n");
    	}
    }
    
    this.editable = function() {return editor;}
}

function Laser(name, color, dir) {
    this.name = name;
    this.color = color;
    this.dirString = dir;
    var c = 4;
    switch(color) {
        case "red": c = 4; break;
        case "green": c = 2; break;
        case "blue": c = 3; break;
        case "white": c = 1; break;
    }
    switch (dir) {
        case "n":
            this.origin = [7,c];
            this.direction = [0,-1];
        break;
        case "e":
            this.origin = [4,c];
            this.direction = [1,0];
        break;
        case "s":
            this.origin = [5,c];
            this.direction = [0,1];
        break;
        case "w":
            this.origin = [6,c];
            this.direction = [-1,0];
        break;
    }

    this.fireLaser = function(x,y,ctx) {
        ctx.fillStyle = "rgba(128,128,255,0.75)";
        var curDir = [this.direction[0], this.direction[1]];
        var cx = x;
        var cy = y;
        while (true) {
            newDir = map.getCell([cx,cy]).beamHit(this.color, curDir);
            if (newDir == undefined)
            {
                drawSparkles(cx - curDir[0], cy - curDir[1], this.color, curDir, ctx);
                break;
            }
            drawBeam(this.color, [cx,cy], curDir, newDir, ctx);
            curDir = newDir;
            cx += curDir[0];
            cy += curDir[1];
        }
    }
    this.beamHit = function(color, dir) { return isEqualDir(dir, this.direction) ? dir : undefined; }

    this.toString = function() {
        return "new Laser('"+this.name+"','"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
    		case "n":
    	    		return new Laser(this.name, this.color, "e");
    		case "e":
    			return new Laser(this.name, this.color, "s");
    		case "s":
    			return new Laser(this.name, this.color, "w");
    		case "w":
    			return new Laser(this.name, this.color, "n");
    	}
    }
    this.editable = function() {return editor;}
}


function LaserRear(name, dir) {
    this.name = name;
    this.dirString = dir;
    switch (dir) {
        case "n":
            this.origin = [7,0];
        break;
        case "e":
            this.origin = [4,0];
        break;
        case "s":
            this.origin = [5,0];
        break;
        case "w":
            this.origin = [6,0];
        break;
    }
    
    this.beamHit = function(color, dir) { return undefined; }
    this.toString = function() {
        return "new LaserRear('"+this.name+"','"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
    		case "n":
    	    		return new LaserRear(this.name, "e");
    		case "e":
    			return new LaserRear(this.name, "s");
    		case "s":
    			return new LaserRear(this.name, "w");
    		case "w":
    			return new LaserRear(this.name, "n");
    	}
    }
    this.editable = function() {return editor;}
}

var fluffs = [[7,14],[7,15],[8,13],[8,14],[8,15],[9,13],[9,14],[9,15],[10,13],[10,14],[10,15],
				[11,12],[11,13],[11,14],[11,15]];

function Fluff(name, dir) {
    this.name = name;
    this.dirString = dir;
    this.origin = fluffs[dir];
    this.destroyed = false;
    
    // zzzzzap
    this.beamHit = function(color, dir) {
        if (!this.destroyed && !editor) {
            this.destroyed = true;
            map.destroyedObjects++;
            this.origin = [12, 15];           
        }
        return dir;
    }
    this.toString = function() {
        return "new Fluff('"+this.name+"','"+this.dirString+"')";
    }

    this.rotate = function() {
		var n = this.dirString + 1;
		if (n >= fluffs.length) n = 0;
		return new Fluff(this.name, n);
    }
    this.editable = function() {return editor || this.destroyed;}
}


function Filter(name, color, dir) {
    this.name = name;
    this.color = color;
    this.dirString = dir;
    var c = 2;
    switch(color) {
		case "white": c = 3; break;
        case "red": c = 2; break;
        case "green": c = 1; break;
        case "blue": c = 0; break;
    }
    switch (dir) {
        case "n":
        case "s":
            this.origin = [c,2];
            this.direction = [0,1];
        break;
        case "e":
        case "w":
            this.origin = [c,3];
            this.direction = [1,0];
        break;
    }

    this.beamHit = function(color, dir) {
        if (color == this.color && (isEqualDir(dir, this.direction) || isOppositeDir(dir, this.direction)))
            return dir;     
        return undefined;
    }
    
    this.toString = function() {
        return "new Filter('"+this.name+"','"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
    		case "n":
    	    		return new Filter(this.name, this.color, "e");
    		case "e":
    			return new Filter(this.name, this.color, "n");
    	}
    }
    this.editable = function() {return editor;}
}

function Mirror(name, type) {
    this.name = name;
    this.type = type;
    if (type == "nw") {
        this.origin = [2,0];
        this.dirs = [[[1,0],[0,-1]],[[0,1],[-1,0]]];
    } else if (type == "sw") {
        this.origin = [2,1];
        this.dirs = [[[0,-1],[-1,0]],[[1,0],[0,1]]];
    } else if (type == "ne") {
        this.origin = [3,0];
        this.dirs = [[[0,1],[1,0]],[[-1,0],[0,-1]]];
    } else if (type == "se") {
        this.origin = [3,1];
        this.dirs = [[[0,-1],[1,0]],[[-1,0],[0,1]]];
    } else if (type == "double-nw") {
		this.origin = [0,4];
		this.dirs = [[[1,0],[0,-1]],[[0,1],[-1,0]],[[0,-1],[1,0]],[[-1,0],[0,1]]];
    } else if (type == "double-ne") {
		this.origin = [0,5];
		this.dirs = [[[0,1],[1,0]],[[-1,0],[0,-1]],[[0,-1],[-1,0]],[[1,0],[0,1]]];
	}
    
    this.beamHit = function(color, dir) {
        for (var d in this.dirs) {
            if (isEqualDir(dir, this.dirs[d][0]))
                return this.dirs[d][1];
        }
            
        return undefined;
    }
    
    this.toString = function() {
        return "new Mirror('"+this.name+"',"+this.type+"')";
    }

    this.rotate = function() {
        switch (this.type) {
    	    case "nw":
    	        return new Mirror(this.name, "ne");
    	    case "sw":
    	        return new Mirror(this.name, "nw");
    	    case "ne":
    	        return new Mirror(this.name, "se");
    	    case "se":
    	        return new Mirror(this.name, "sw");
    	    case "double-nw":
    	        return new Mirror(this.name, "double-ne");
    	    case "double-ne":
    	        return new Mirror(this.name, "double-nw");
    	}
    }
    this.editable = function() {return true;}
}

var actorTypes = {
	"target-red" : new Target("target-red", "red", "n"),
	"target-green" : new Target("target-green", "green", "n"),
	"target-blue" : new Target("target-blue", "blue", "n"),
	"target-white" : new Target("target-white", "white", "n"),
	"laser-red" : new Laser("laser-red", "red", "n"),
	"laser-green" : new Laser("laser-green", "green", "n"),
	"laser-blue" : new Laser("laser-blue", "blue", "n"),
	"laser-white" : new Laser("laser-white", "white", "n"),
	"laser-back" : new LaserRear("laser-back", "n"),
	"mirror" : new Mirror("mirror", "nw"),
	"mirror-double" : new Mirror("mirror-double", "double-nw"),
	"filter-red" : new Filter("filter-red", "red", "n"),
	"filter-green" : new Filter("filter-green", "green", "n"),
	"filter-blue" : new Filter("filter-blue", "blue", "n"),
	"filter-white" : new Filter("filter-white", "white", "n"),
	"fluff" : new Fluff("fluff", 0),
};
