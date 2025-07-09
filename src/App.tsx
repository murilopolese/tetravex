import { useState } from 'react';
import './App.css'
import { DndContext, useDraggable, useDroppable, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const colors = [
  // 'rgba(0, 0, 0, 0.02)',
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

let initialGrid: string[][] = Array(5).fill('').map(() => Array(5).fill('0000'))
let initialHand: string[] = ['1210']

function idToPosition(id: string) {
  const [ _, x, y ] = id.split('_')
  return [ parseInt(x), parseInt(y) ]
}

function TileSVG(props: TileSVGProps) {
  const { content } = props
  const [ upId, rightId, downId, leftId ] = content.split('')
  const up = <polygon points='0, 0, 100, 0, 50, 50' style={{fill: colors[parseInt(upId)]}} />
  const right = <polygon points='100, 0, 100, 100, 50, 50' style={{fill: colors[parseInt(rightId)]}} />
  const down = <polygon points='0, 100, 100, 100, 50, 50' style={{fill: colors[parseInt(downId)]}} />
  const left = <polygon points='0, 0, 0, 100, 50, 50' style={{fill: colors[parseInt(leftId)]}} />
  return <svg viewBox="0 0 100 100" shapeRendering="crispEdges">{up} {right} {down} {left}</svg>
}

function EmptyTile(props: EmptyTyleProps) {
  const { id } = props
  const { isOver, setNodeRef } = useDroppable({ id: id })
  const style = { opacity: isOver ? 0.5 : 1 }
  return (
    <div id={id} className='tile empty' style={style} ref={setNodeRef}>
      <TileSVG content="0000"></TileSVG>
    </div>
  )
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

  function handleDragStart(e: DragStartEvent) {
    const { active } = e
    // if dragging from hand
    const [ i ] = idToPosition(active.id.toString())
    setSelectedTile(hand[i])
  }

  function handleDragEnd(e: DragEndEvent) {
    const { over } = e
    if (over && selectedTile) {
      console.log('dropping tile', selectedTile)
      const overId: string = over.id + ''
      const [ x, y ] = idToPosition(overId)
      let newGrid = grid.map(line => line.slice())
      newGrid[y][x] = selectedTile||'0000'
      let newHand = hand.slice();
      const handIndex = newHand.indexOf(selectedTile)
      newHand.splice(handIndex, 1)
      if (newHand.length == 0) {
        function rnd() {
          return (Math.random()*(colors.length-1)).toFixed(0)
        }
        newHand = [
          `${rnd()}${rnd()}${rnd()}${rnd()}`,
          `${rnd()}${rnd()}${rnd()}${rnd()}`,
          `${rnd()}${rnd()}${rnd()}${rnd()}`,
          `${rnd()}${rnd()}${rnd()}${rnd()}`
        ]
      }
      console.log(newHand)
      setHand(newHand)
      setGrid(newGrid)
    }
    setSelectedTile(null)
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
      </div>
    </DndContext>
  )
}

export default App
