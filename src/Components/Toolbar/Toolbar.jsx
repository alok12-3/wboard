import React, { useContext } from 'react'
import './Toolbar.css'
import ToolContext from '../../Context/ToolContext'

const Toolbar = () => {
   const {setPenColor, setPenSize, addTextBox, setEraserMode, eraserMode} = useContext(ToolContext);
   
   return (
      <div  className="toolbar">
        <button onClick={addTextBox}>Add Textbox</button>
        <button onClick={() => setEraserMode(!eraserMode)}>Eraser</button>
        <label>
          Pen Color:
          <input type="color" onChange={(e) => setPenColor(e.target.value)} />
        </label>
        <label>
          Pen Size:
          <input type="range" min="1" max="10" onChange={(e) => setPenSize(e.target.value)} />
        </label>
      </div>
    );
}

export default Toolbar
