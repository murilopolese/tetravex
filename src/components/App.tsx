import { useContext } from 'react'
import { DndContext, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { Context as GameContext } from './GameContext'
import Tile from './Tile'
import HandTile from './HandTile'
import styles from './App.module.css'

import { 
  getInitialGrid, 
  randomHand, 
  idToPosition,
  randomTile
} from '../utilities'

function App() {
  const {
    grid, setGrid,
    hand, setHand,
    selectedTile, setSelectedTile,
    lost
  } = useContext(GameContext)

  // Drag events assume you can only drag from your hand
  function handleDragStart(e: DragStartEvent) {
    const { active } = e
    const [ i ] = idToPosition(active.id.toString())
    setSelectedTile(hand[i]||'')
  }

  function handleDragEnd(e: DragEndEvent) {
    const { over } = e
    if (over && selectedTile) {
      const overId: string = over.id + ''
      const [ x, y ] = idToPosition(overId)
      const newGrid = grid.map(line => line.slice())
      newGrid[y][x] = selectedTile||'0000'
      let newHand = hand.slice();
      const handIndex = newHand.indexOf(selectedTile)
      newHand.splice(handIndex, 1)
      if (newHand.length == 0) {
        newHand = [ randomTile(), randomTile(), randomTile(), randomTile() ]
      }
      setHand(newHand)
      setGrid(newGrid)
    }
    setSelectedTile('')
  }

  // Reset state
  function restart() {
    setGrid(getInitialGrid())
    setHand(randomHand())
    setSelectedTile('')
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div id={styles.app}>
        <div className={styles.grid}>
          {grid.map((line, j) => line.map(
              (content, i) => (
                <Tile 
                  id={`tile_${i}_${j}`} 
                  key={`tile_${i}_${j}`} 
                  content={content} 
                  />
              )
            )
          )}
        </div>
        <div className={styles.hand}>
          {hand.map((content, i) => (
            <HandTile 
              id={`hand_${i}`} 
              key={`hand_${i}`} 
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
