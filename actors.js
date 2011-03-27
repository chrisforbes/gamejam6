

// Actors
function Target(color, dir) {
    this.color = color;
    this.dirString = dir;
    var c = 7;
    switch(color) {
        case "red": c = 7; break;
        case "green": c = 5; break;
        case "blue": c = 6; break;
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
        if (color == this.color && isEqualDir(dir, this.direction))
            alert("winnar")
            
        return undefined;
    }
    
    this.toString = function() {
        return "new Target('"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
		case "n":
	    		return new Target(this.color, "e");
		case "e":
			return new Target(this.color, "s");
		case "s":
			return new Target(this.color, "w");
		case "w":
			return new Target(this.color, "n");
	}
    }
}

function Laser(color,dir) {
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
                //ctx.fillRect((cx - curDir[0])*32+11, (cy - curDir[1])*32+11, 10,10)
                
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
        return "new Laser('"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
		case "n":
	    		return new Laser(this.color, "e");
		case "e":
			return new Laser(this.color, "s");
		case "s":
			return new Laser(this.color, "w");
		case "w":
			return new Laser(this.color, "n");
	}
    }
}


function LaserRear(dir) {
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
        return "new LaserRear('"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
		case "n":
	    		return new LaserRear("e");
		case "e":
			return new LaserRear("s");
		case "s":
			return new LaserRear("w");
		case "w":
			return new LaserRear("n");
	}
    }
}

function Filter(color,dir) {
    this.color = color;
    this.dirString = dir;
    var c = 2;
    switch(color) {
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
        return "new Filter('"+this.color+"', '"+this.dirString+"')";
    }

    this.rotate = function() {
    	switch(this.dirString) {
		case "n":
	    		return new Filter(this.color, "e");
		case "e":
			return new Filter(this.color, "s");
		case "s":
			return new Filter(this.color, "w");
		case "w":
			return new Filter(this.color, "n");
	}
    }
}

function Mirror(type) {
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
        return "new Mirror('"+this.type+"')";
    }

    this.rotate = function() {
        switch (this.type) {
	    case "nw":
	        return new Mirror("ne");
	    case "sw":
	        return new Mirror("nw");
	    case "ne":
	        return new Mirror("se");
	    case "se":
	        return new Mirror("sw");
	    case "double-nw":
	        return new Mirror("double-ne");
	    case "double-ne":
	        return new Mirror("double-nw");
	}
    }
}

var actorTypes = {
	"target-red" : new Target("red", "n"),
	"target-green" : new Target("green", "n"),
	"target-blue" : new Target("blue", "n"),
	"laser-red" : new Laser("red", "n"),
	"laser-green" : new Laser("green", "n"),
	"laser-blue" : new Laser("blue", "n"),
	"laser-white" : new Laser("white", "n"),
	"laser-back" : new LaserRear("n"),
	"mirror" : new Mirror("nw"),
	"mirror-double" : new Mirror("double-nw"),
	"filter-red" : new Filter("red", "n"),
	"filter-green" : new Filter("green", "n"),
	"filter-blue" : new Filter("blue", "n")
};
