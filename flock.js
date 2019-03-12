//////////////////////////////
// LET, CONST ////////////////
//////////////////////////////

// Common:
const DEBUG = false

// Rendering:
const width = 500.0;
const height = 500.0;

const can = document.getElementById("canv");
const ctx = can.getContext("2d");

// Physics, collision:
const border = new Vector2D(width, height);

// Flock:
const flock = new Array();

// Rendering:
function render(flock) {
    // Clear:
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 500, 500);

    // Render boids:
    ctx.fillStyle = "yellow";
    for(i in flock) {
        ctx.beginPath();
        ctx.fillRect(flock[i].location.x, flock[i].location.y, 5, 5);
        DEBUG && console.log("Rendering flock -> x; y = " + flock[i].location.x + '; ' + flock[i].location.y);
    }
}

function createFlock(amount, center = new Vector2D(250.0, 250.0)) {
    for(let i = 0; i < amount; i++) {
        flock.push(
            new Boid(center)
        );
    }
}

function updateFlock(flock, delta) {
    for(i in flock) {
        flock[i].update(flock, delta);
    }
}

// Action:
createFlock(100);

;(function () {
    function main() {
      window.requestAnimationFrame( main );
      
      updateFlock(flock, 1.0);
      render(flock);
    }    
    main();
})();