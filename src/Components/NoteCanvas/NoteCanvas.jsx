import React from 'react';
import { useRef, useEffect, useState, useContext } from 'react';
import './NoteCanvas.css';
import ToolContext from '../../Context/ToolContext';

const NoteCanvas = () => {
  const { penColor, penSize, textboxes, setTextboxes, eraserMode, curves, setCurves, undo, redo } = useContext(ToolContext);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [points, setPoints] = useState([]);

  const handleTextChange = (id, newText) => {
    setTextboxes(
      textboxes.map((textbox) =>
        textbox.id === id ? { ...textbox, text: newText } : textbox
      )
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  const startDrawing = (offsetX, offsetY) => {
    if (eraserMode) {
      eraseCurve(offsetX, offsetY);
    } else {
      setPoints([{ x: offsetX, y: offsetY }]);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (!eraserMode && points.length > 0) {
     
      setCurves([...curves, points]);
    }
    setIsDrawing(false);
    setPoints([]);
  };

  const draw = (offsetX, offsetY) => {
    if (!isDrawing || eraserMode) return;
    setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
    drawLineSegment(offsetX, offsetY);
  };

  const drawLineSegment = (x, y) => {
    const lastPoint = points[points.length - 1];
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(x, y);
    context.strokeStyle = penColor;
    context.lineWidth = penSize;
    context.stroke();
    context.closePath();
  };

  const drawBezierCurve = () => {
    if (points.length < 3) {
      const { x, y } = points[0];
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y);
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      context.stroke();
      context.closePath();
      return;
    }

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    const xc = (points[points.length - 2].x + points[points.length - 1].x) / 2;
    const yc = (points[points.length - 2].y + points[points.length - 1].y) / 2;
    context.quadraticCurveTo(
      points[points.length - 2].x,
      points[points.length - 2].y,
      xc,
      yc
    );
    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    context.strokeStyle = penColor;
    context.lineWidth = penSize;
    context.stroke();
    context.closePath();
  };

  const eraseCurve = (x, y) => {
    // Simple bounding box collision detection for demo purposes
    const radius = 10; // Eraser radius
    const newCurves = curves.filter((curve) => {
      return !curve.some((point) => {
        return (
          point.x >= x - radius &&
          point.x <= x + radius &&
          point.y >= y - radius &&
          point.y <= y + radius
        );
      });
    });

    setCurves(newCurves);
    redrawCanvas(newCurves);
  };

  const redrawCanvas = (curvesToDraw) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas

    curvesToDraw.forEach((curve) => {
      context.beginPath();
      context.moveTo(curve[0].x, curve[0].y);

      for (let i = 1; i < curve.length - 2; i++) {
        const xc = (curve[i].x + curve[i + 1].x) / 2;
        const yc = (curve[i].y + curve[i + 1].y) / 2;
        context.quadraticCurveTo(curve[i].x, curve[i].y, xc, yc);
      }

      const xc = (curve[curve.length - 2].x + curve[curve.length - 1].x) / 2;
      const yc = (curve[curve.length - 2].y + curve[curve.length - 1].y) / 2;
      context.quadraticCurveTo(
        curve[curve.length - 2].x,
        curve[curve.length - 2].y,
        xc,
        yc
      );
      context.lineTo(curve[curve.length - 1].x, curve[curve.length - 1].y);

      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      context.stroke();
      context.closePath();
    });
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    startDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    draw(offsetX, offsetY);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { offsetLeft, offsetTop } = canvasRef.current;
    startDrawing(touch.clientX - offsetLeft, touch.clientY - offsetTop);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { offsetLeft, offsetTop } = canvasRef.current;
    draw(touch.clientX - offsetLeft, touch.clientY - offsetTop);
  };

  const handleTouchEnd = () => {
    finishDrawing();
  };

  return (
    <div className="note-canvas">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 50} /* Adjust height to fill remaining space */
        onMouseDown={handleMouseDown}
        onMouseUp={finishDrawing}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {textboxes.map((textbox) => (
        <textarea
          key={textbox.id}
          style={{ position: 'absolute', left: textbox.x, top: textbox.y }}
          value={textbox.text}
          onChange={(e) => handleTextChange(textbox.id, e.target.value)}
        />
      ))}
    </div>
  );
};

export default NoteCanvas;
