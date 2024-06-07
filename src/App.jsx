import React from 'react'
import ToolContextProvider from './Context/ToolContextProvider'
import NoteCanvas from './Components/NoteCanvas/NoteCanvas'
import Toolbar from './Components/Toolbar/Toolbar'

const App = () => {
  return (
    <ToolContextProvider>
       <div className="app">
        <Toolbar />
        <NoteCanvas />
        <h1>hii</h1>
      </div>
    </ToolContextProvider>
  )
}

export default App
