import React, { createContext, useState } from 'react';
import ToolContext from './ToolContext';


const ToolContextProvider = ({ children }) => {
    const [penColor, setPenColor] = useState('black');
    const [penSize, setPenSize] = useState(5);
    const [textboxes, setTextboxes] = useState([]);
    const [eraserMode, setEraserMode] = useState(false);
    const [curves, setCurves] = useState([]); // Store drawn curves
    const [undoStack, setUndoStack] = useState([]); // Store undo stack
    const [redoStack, setRedoStack] = useState([]); // Store redo stack
  
    const undo = () => {
      if (curves.length > 0) {
        const newCurves = [...curves];
        const lastCurve = newCurves.pop();
        setCurves(newCurves);
        setUndoStack([...undoStack, lastCurve]);
      }
    };
  
    const redo = () => {
      if (undoStack.length > 0) {
        const newUndoStack = [...undoStack];
        const redoCurve = newUndoStack.pop();
        setCurves([...curves, redoCurve]);
        setUndoStack(newUndoStack);
      }
    };
  
    return (
      <ToolContext.Provider
        value={{
          penColor,
          setPenColor,
          penSize,
          setPenSize,
          textboxes,
          setTextboxes,
          eraserMode,
          setEraserMode,
          curves,
          setCurves,
          undo,
          redo,
        }}
      >
        {children}
      </ToolContext.Provider>
    );
  };
export default ToolContextProvider;