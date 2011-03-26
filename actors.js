

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
}

var actorTypes = [
	new Target("red", "n"),
	new Target("green", "n"),
	new Target("blue", "n"),
	new Laser("red", "n"),
	new Laser("green", "n"),
	new Laser("blue", "n"),
	new Laser("white", "n"),
	new LaserRear("n"),
	new Mirror("nw"),
	new Mirror("ne"),
	new Mirror("sw"),
	new Mirror("se"),
	new Mirror("double-nw"),
	new Mirror("double-ne"),
	new Filter("red", "n"),
	new Filter("green", "n"),
	new Filter("blue", "n")
];
