class Ball {
    constructor(x, y, radius, color, vx=0, vy=0) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = vx;
      this.vy = vy;
    }
  
    draw(context) {
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
    }
  
    move() {
      this.x += this.vx;
      this.y += this.vy;
    }  
}
  
export default class Game {
    balls = [];
    canvas;
    context;
  
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.initBalls();
    }
  
    initBalls() {
      this.balls.push(new Ball(100, 50, 35, 'red', 2));
      this.balls.push(new Ball(200, 50, 25, 'blue', -1));
      this.balls.push(new Ball(200, 100, 15, 'green'));
      this.balls.push(new Ball(300, 100, 40, 'yellow'));
    }
  
    handleWallsCollision() {
      this.balls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;
      
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx;
        } else if (ball.x + ball.radius > this.canvas.width) {
          ball.x = this.canvas.width - ball.radius;
          ball.vx = -ball.vx;
        }
      
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy;
        } else if (ball.y + ball.radius > this.canvas.height) {
          ball.y = this.canvas.height - ball.radius;
          ball.vy = -ball.vy;
        }
      });
    }
  
    handleCollisions() {
      for (let i = 0; i < this.balls.length; i++) {
        for (let j = i + 1; j < this.balls.length; j++) {
          const ball1 = this.balls[i];
          const ball2 = this.balls[j];
          
          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minimumDistance = ball1.radius + ball2.radius;
    
          if (distance < minimumDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
    
            const overlap = minimumDistance - distance;
  
            var vx = ball1.vx - ball2.vx;
            var vy = ball1.vy - ball2.vy;
  
            var dotProduct = vx * nx + vy * ny;
  
            if (dotProduct > 0) {
              var coefficientOfRestitution = 0.5;
              var impulse = (2 * dotProduct) / (2) * coefficientOfRestitution;
            
              const correctionHalf = overlap / 2;
              const correctionX = nx * correctionHalf;
              const correctionY = ny * correctionHalf;
      
              ball1.x -= correctionX;
              ball1.y -= correctionY;
              ball2.x += correctionX;
              ball2.y += correctionY;
      
              const vx1 = impulse * nx * -1;
              const vy1 = impulse * ny * -1;
              const vx2 = impulse * nx;
              const vy2 = impulse * ny;
      
              ball1.vx = vx1;
              ball1.vy = vy1;
              ball2.vx = vx2;
              ball2.vy = vy2;
            }
          }
        }
      }
  
      this.balls.forEach(ball => {
        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= this.canvas.width) {
          ball.vx = -ball.vx;
        }
        if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= this.canvas.height) {
          ball.vy = -ball.vy;
        }
      });
  
      const friction = 0.99;
  
      this.balls.forEach(ball => {
        ball.vx *= friction;
        ball.vy *= friction;
  
        if (Math.abs(ball.vx) < 0.02) ball.vx = 0;
        if (Math.abs(ball.vy) < 0.02) ball.vy = 0;
      });
    }
  
    update() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.balls.forEach(ball => {
        ball.move();
        ball.draw(this.context);
      });
      this.handleCollisions();
      this.handleWallsCollision();
    }
}
  