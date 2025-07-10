import { createContext, useContext, useMemo, useState } from 'react';
import './App.css'
import { DndContext, useDraggable, useDroppable, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const COLORS = [
  '#FACBDB', // empty color
  '#FACBDB',
  '#FF9D00',
  '#E8002B'
]

type TileSVGProps = {
  content: string;
}
type TileProps = {
  id: string;
  content: string;
}
type EmptyTyleProps = {
  id: string;
}
type GameContextType = {
  grid: string[][];
  hand: string[];
  selectedTile: string|null;
  setGrid?: (g: string[][]) => void;
  setHand?: (g: string[]) => void;
  setSelectedTile?: (g: string) => void;
}

const initialGrid: string[][] = Array(5).fill('').map(() => Array(5).fill('0000'))
initialGrid[2][2] = randomTile()
const initialHand: string[] = randomHand()
const initialContext: GameContextType = {
  grid: initialGrid,
  hand: initialHand,
  selectedTile: null
}

function idToPosition(id: string) {
  const [ x, y ] = id.split('_').slice(1)
  return [ parseInt(x), parseInt(y) ]
}

function randomTile() {
  function rnd() {
    // Avoid index 0
    return (Math.random()*(COLORS.length-2)+1).toFixed(0)
  }
  return `${rnd()}${rnd()}${rnd()}${rnd()}`
}

function randomHand() {
  return [randomTile(), randomTile(), randomTile(), randomTile()]
}

function getBoundaries(grid: string[][], x: number, y: number) {
  const up = grid[(5+y-1)%5][x]
  const down = grid[(y+1)%5][x]
  const left = grid[y][(5+x-1)%5]
  const right = grid[y][(x+1)%5]
  return [
    up ? parseInt(up[2]) : 0, 
    right ? parseInt(right[3]) : 0,
    down ? parseInt(down[0]) : 0,
    left ? parseInt(left[1]) : 0, 
  ]
}

function canDrop(id: string, selectedTile: string, grid: string[][]) {
  // Turn string id into x,y grid coordinates
  const [ x, y ] = idToPosition(id)

  // Get surrounding boundaries
  const [ up, right, down, left ] = getBoundaries(grid, x, y)

  // Can't drop without surroundings
  if (!up && !right && !down && !left) return false

  // Can't drop if one of the surroundings is not valid
  if (up && parseInt(selectedTile[0]) != up) return false 
  if (right && parseInt(selectedTile[1]) != right) return false 
  if (down && parseInt(selectedTile[2]) != down) return false 
  if (left && parseInt(selectedTile[3]) != left) return false 

  // Otherwise assume you can drop
  return true
}

const GameContext = createContext(initialContext);


function TileSVG(props: TileSVGProps) {
  const { content } = props
  const [ upId, rightId, downId, leftId ] = content.split('')
  const up = <polygon points='0, 0, 100, 0, 50, 50' style={{fill: COLORS[parseInt(upId)]}} />
  const right = <polygon points='100, 0, 100, 100, 50, 50' style={{fill: COLORS[parseInt(rightId)]}} />
  const down = <polygon points='0, 100, 100, 100, 50, 50' style={{fill: COLORS[parseInt(downId)]}} />
  const left = <polygon points='0, 0, 0, 100, 50, 50' style={{fill: COLORS[parseInt(leftId)]}} />
  return <svg viewBox="0 0 100 100" shapeRendering="crispEdges">{up} {right} {down} {left}</svg>
}

function EmptyTile(props: EmptyTyleProps) {
  const { id } = props
  const { selectedTile, grid } = useContext(GameContext)
  const { setNodeRef } = useDroppable({ id: id })

  // Check if can drop currently selected tile based on neighbors
  if (selectedTile && canDrop(id, selectedTile, grid)) {
    const style = { opacity: 0.5 }
    return (
      <div id={id} className='tile droppable' style={style} ref={setNodeRef}>
        <TileSVG content="0000"></TileSVG>
      </div>
    )
  } else {
    return (
      <div id={id} className='tile empty'>
        <TileSVG content="0000"></TileSVG>
      </div>
    )
  }
}

function HandTile(props: TileProps) {
  const { id, content } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({id: id})
  const style = { transform: CSS.Translate.toString(transform)}
  return (
    <div id={id} className='tile' {...attributes} {...listeners} ref={setNodeRef} style={style}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

function TableTile(props: TileProps) {
  const { id, content } = props
  return (
    <div id={id} className='tile'>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

function Tile(props: TileProps) {
  const { id, content } = props
  const empty = content == '0000'
  if (empty) {
    return <EmptyTile id={id} />
  } else {
    return <TableTile id={id} content={content} />
  }
}

function App() {
  const [ grid, setGrid ] = useState(initialGrid)
  const [ selectedTile, setSelectedTile ] = useState<string|null>(null)
  const [ hand, setHand ] = useState(initialHand)

  const lost = useMemo(() => {
    let lost = false
    if (hand.length == 0) {
      console.log('empty hand')
      lost = false
    } else {
      let canDropSomewhere = false
      hand.forEach(tile => {
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            if (grid[y][x] == '0000' && canDrop(`tile_${x}_${y}`, tile, grid)) {
              canDropSomewhere = true
            }
          }
        }
      })
      lost = !canDropSomewhere
    }
    return lost
  }, [hand, grid])
  

  // Drag events assume you can only drag from your hand
  function handleDragStart(e: DragStartEvent) {
    const { active } = e
    const [ i ] = idToPosition(active.id.toString())
    setSelectedTile(hand[i])
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
        newHand = [
          randomTile(),
          randomTile(),
          randomTile(),
          randomTile()
        ]
      }
      setHand(newHand)
      setGrid(newGrid)
    }
    setSelectedTile(null)
  }

  // Reset state
  function restart() {
    setGrid(initialGrid)
    setHand(randomHand())
    setSelectedTile(null)
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <GameContext value={{grid, setGrid, hand, setHand, selectedTile, setSelectedTile}}>
        <div id="app">
          <div className="grid">
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
          <div className="hand">
            {hand.map((content, i) => (
              <HandTile 
                id={`hand_${i}`} 
                key={`hand_${i}`} 
                content={content} 
                />
            ))}
          </div>
          {lost?<button onClick={() => restart()}>restart</button>:null}
        </div>
      </GameContext>
    </DndContext>
  )
}

export default App
