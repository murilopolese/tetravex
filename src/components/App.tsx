import { useContext } from 'react'
import { DndContext } from '@dnd-kit/core'
import { Context as GameContext } from './GameContext'
import Tile from './Tile'
import HandTile from './HandTile'
import styles from './App.module.css'

function App() {
  const {
    grid, 
    hand,
    lost,
    handleDragStart,
    handleDragEnd,
    restart
  } = useContext(GameContext)

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div id={styles.app}>
        <div className={styles.grid}>
          {grid.map((line, y) => line.map(
              (content, x) => (
                <Tile 
                  x={x}
                  y={y}
                  key={`tile_${x}_${y}`} 
                  content={content} 
                  />
              )
            )
          )}
        </div>
        <div className={styles.hand}>
          {hand.map((content, x) => (
            <HandTile 
              x={x}
              key={`hand_${x}`} 
              content={content} 
              />
          ))}
        </div>
        {lost ? <button onClick={() => restart()}>restart</button> : null}
      </div>
    </DndContext>
  )
}

export default App
