import { createContext, useState, useMemo } from "react";
import { getInitialGameContext, getInitialGrid, randomHand, canDrop } from "../utilities";
import { type GameContextType, type GameContextProps } from "./GameContextTypes";


const initialContext: GameContextType = getInitialGameContext()
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
            if (dropTile == '0000' && canDrop(`tile_${x}_${y}`, handTile, grid)) {
              canDropSomewhere = true
            }
          })
        })
      })
      lost = !canDropSomewhere
    }
    return lost
  }, [hand, grid])

  const context = {
    grid, setGrid, selectedTile, setSelectedTile, hand, setHand, lost
  }

  return <Context value={context}>{children}</Context>

}

export default GameContext