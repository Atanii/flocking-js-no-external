# Flocking Algorithm in Pure JavaScript

## Flocking

Flocking is a beautiful behavioral algorithm mimicking birds or other entities fly / move in groups.

The original algorithm was created by Craig Reynolds in 1986.

I was intrigued by the complexity and beauty this algorithm can show when it's visualized. I was planning to learn about it more and implement it with a tutorial.

## Source I port the code from:

I used this tutorial to port and learn about the algorithm: http://harry.me/blog/2011/02/17/neat-algorithms-flocking/

## Parameters I used (classes.js):

```javascript
const MAX_SPEED = 5.0;

const MAX_FORCE = 1.0;

const SEPARATION_WEIGHT = 30.0;

const ALIGNMENT_WEIGHT = 20.0;

const COHESION_WEIGHT = 15.0;

const DESIRED_SEPARATION = 15.0;

const NEIGHBOUR_RADIUS = 30.0;
```

