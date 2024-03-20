import React, { useRef, useEffect, useState } from 'react';
import Game from './pool/Game';
import ColorPickerMenu from './pool/ColorPickerMenu';

const App = () => {
  let isDragging = useRef(false);
  let selectedBall = useRef(null);
  const canvasRef = useRef(null);
  const selectedBallRef = useRef(null);
  const [game, setGame] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, visible: false });
  let lastMouseX = useRef(0);
  let lastMouseY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      setGame(new Game(canvas));
    }
  }, []);

  useEffect(() => {
    if (game) {
      function animate() {
        requestAnimationFrame(() => animate()); 
        game.update();
      }
      
      animate(); 
    }
  }, [game])

  function findBall(clickX, clickY) {
    for (let ball of game.balls) {
      const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);
      if (distance < ball.radius) {
        return ball; 
      }
    }
    return null;
  }

  const changeBallColor = (color) => {
    if (selectedBallRef.current) {
      selectedBallRef.current.color = color;
      setMenuPosition({ ...menuPosition, visible: false });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !selectedBall) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;

    console.log(dx, dy, selectedBall.vx, selectedBall.vy);
    if (dx === 0 && dy === 0 && selectedBall.vx < 0.1 && selectedBall.vy < 0.1) {
      const selectedBall = findBall(mouseX, mouseY);

      if (selectedBall) {
        setMenuPosition({ x: e.clientX, y: e.clientY, visible: true });
        selectedBallRef.current = selectedBall;
      } else {
        setMenuPosition({ ...menuPosition, visible: false });
      }
      return;
    }
  
    const forceMultiplier = 0.05;
    selectedBall.vx += dx * forceMultiplier;
    selectedBall.vy += dy * forceMultiplier;
  
    isDragging = false;
    selectedBall = null;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    game.balls.forEach(ball => {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
        isDragging = true;
        selectedBall = ball;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    });
  };

  return <>
          <canvas 
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp} 
            ref={canvasRef} 
            width='800' 
            height='500' 
            style={{ background : "#49932e" }}
          />
          {menuPosition.visible && (
          <ColorPickerMenu
            x={menuPosition.x}
            y={menuPosition.y}
            onClose={() => setMenuPosition({ ...menuPosition, visible: false })}
            onChangeColor={changeBallColor}
          />
        )}
 </>
};

export default App;