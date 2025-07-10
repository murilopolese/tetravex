import { createContext, useState, useMemo } from "react";
import { getInitialGameContext, getInitialGrid, randomHand, canDrop, randomTile, idToPosition } from "../utilities";
import { type GameContextType, type GameContextProps } from "./GameContextTypes";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";


const initialContext: GameContextType = getInitialGameContext()
/* eslint-disable-next-line react-refresh/only-export-components */
export const Context = createContext(initialContext);

function GameContext(props: GameContextProps) {
  const { children } = props
  const [ grid, setGrid ] = useState(getInitialGrid())
  const [ selectedTile, setSelectedTile ] = useState<string>('')
  const [ hand, setHand ] = useState(randomHand())

  const lost = useMemo(() => {
    let lost = false
    if (hand.length == 0) {
      lost = false
    } else {
      let canDropSomewhere = false
      hand.forEach(handTile => {
        grid.forEach((line, y) => {
          line.forEach((dropTile, x) => {
            if (dropTile == '0000' && canDrop({tile: handTile, x, y, grid})) {
              canDropSomewhere = true
            }
          })
        })
      })
      lost = !canDropSomewhere
    }
    return lost
  }, [hand, grid])

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

  const context: GameContextType = {
    grid, selectedTile, hand, lost,
    handleDragStart, handleDragEnd, restart
  }

  return <Context value={context}>{children}</Context>

}

export default GameContext