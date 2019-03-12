//////////////////////////////
// LET, CONST ////////////////
//////////////////////////////

// Flock physics:
const MAX_SPEED = 5.0;
const MAX_FORCE = 1.0;

const SEPARATION_WEIGHT = 30.0;
const ALIGNMENT_WEIGHT = 20.0;
const COHESION_WEIGHT = 15.0;

const DESIRED_SEPARATION = 15.0;

const NEIGHBOUR_RADIUS = 30.0;

//////////////////////////////
// CLASSES ///////////////////
//////////////////////////////

// Common:
class Vector2D {
    constructor(x = 0.0, y = 0.0) {
        x ? this.x = x : this.x = 0.0;
        y ? this.y = y : this.y = 0.0;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    add(vec) {
        return new Vector2D(this.x + vec.x, this.y + vec.y);
    }
    add_self(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    sub(vec) {
        return new Vector2D(this.x - vec.x, this.y - vec.y);
    }
    sub_self(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    mul(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    mul_self(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    div(scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }
    div_self(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    limit(maxMagnitude) {
        const ratio = maxMagnitude / this.mag();
        this.x = this.x * ratio;
        this.y = this.y * ratio;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const d = this.mag();
        this.x /= d;
        this.y /= d;
        return this;
    }

    static sub(vec1, vec2) {
        return new Vector2D(
            vec1.x - vec2.x,
            vec1.y - vec2.y
        );
    }
    
    static distance(vec1, vec2) {
        return Vector2D.sub(vec1, vec2).mag();
    }
}

// Flock related:
class Boid {
    constructor(loc, areaDimension) {
        this.velocity = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.location = loc.copy();
        this.border = areaDimension;
    }

    step(neighbours, delta) {
        const acceleration = this.flock(neighbours);
        this.velocity.add_self(acceleration);
        this.velocity.mul_self(delta);
        this.velocity.limit(MAX_SPEED);
    }

    move() {
        this.location.add_self(this.velocity);        
    }

    checkBorderCollisionAndCorrectLocation() {
        // Horizontal
        if( this.location.x < 0.0 ) {
            this.location.x += border.x;
        }
        else if( this.location.x >= border.x ) {
            this.location.x = border.x - this.location.x;
        }
        // Vertical
        if( this.location.y < 0.0 ) {
            this.location.y += border.y;
        }
        else if( this.location.y >= border.y ) {
            this.location.y = border.y - this.location.y;
        }
    }

    update(neighbours, delta) {
        this.step(neighbours, delta);
        this.move();
        this.checkBorderCollisionAndCorrectLocation();
    }

    flock(neighbours) {
        const separation = this.separate(neighbours).mul(SEPARATION_WEIGHT);
        const alignment = this.align(neighbours).mul(ALIGNMENT_WEIGHT);
        const cohesion = this.cohere(neighbours).mul(COHESION_WEIGHT);
        return separation.add(alignment).add(cohesion);
    }

    cohere(neighbours) {
        let sum = new Vector2D();
        let count = 0;

        for(i in neighbours) {
            if(this === neighbours[i]) {
                continue;
            }
            const d = Vector2D.distance(this.location, neighbours[i].location);
            if( d > .0 && d < NEIGHBOUR_RADIUS ) {
                sum.add_self(neighbours[i].location);
                count++;
            }
        }

        if(count > 0) {
            return this.steer_to(sum.div(count));
        } else {
            return sum;
        }
    }

    steer_to(target) {
        const desired = Vector2D.sub(target, this.location);
        const d = desired.mag();
        let steer;

        if(d > .0) {
            desired.normalize();

            if(d < 100.0) {
                desired.mul_self(MAX_SPEED * (d / 100.0));
            } else {
                desired.mul_self(MAX_SPEED);
            }

            steer = desired.sub(this.velocity);
            steer.limit(MAX_FORCE);
        } else {
            steer = new Vector2D();
        }

        return steer;
    }

    align(neighbours) {
        const mean = new Vector2D();
        let count = 0;

        for(i in neighbours) {
            if(this === neighbours[i]) {
                continue;
            }
            const d = Vector2D.distance(this.location, neighbours[i].location);
            if( d > .0 && d < NEIGHBOUR_RADIUS ) {
                mean.add_self(neighbours[i].velocity);
                count++;
            }
        }

        if(count) {
            mean.div_self(count)
        }
        mean.limit(MAX_FORCE);

        return mean;
    }

    separate(neighbours) {
        const mean = new Vector2D();
        let count = 0;

        for(i in neighbours) {
            if(this === neighbours[i]) {
                continue;
            }
            const d = Vector2D.distance(this.location, neighbours[i].location);
            if( d > .0 && d < DESIRED_SEPARATION ) {
                mean.add_self(
                    Vector2D.sub(this.location, neighbours[i].location).normalize().div(d)
                );
                count++;
            }
        }
        if(count) {
            mean.div_self(count)
        }

        return mean;
    }
}
