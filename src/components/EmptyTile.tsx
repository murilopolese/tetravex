import { useContext, useMemo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { Context as GameContext } from './GameContext'
import TileSVG from './TileSVG'
import { canDrop, positionToId } from "../utilities"
import styles from './App.module.css'

type EmptyTyleProps = {
  x: number;
  y: number;
}

function EmptyTile(props: EmptyTyleProps) {
  const { x, y } = props
  const id: string = useMemo(() => positionToId(x, y), [x, y])
  const { selectedTile, grid } = useContext(GameContext)
  const { setNodeRef } = useDroppable({ id: id })

  // Check if can drop currently selected tile based on neighbors
  if (selectedTile && canDrop({tile: selectedTile, x, y, grid})) {
    const style = { opacity: 0.5 }
    return (
      <div id={id} className={[styles.tile, styles.droppable].join(' ')} style={style} ref={setNodeRef}>
        <TileSVG content="0000"></TileSVG>
      </div>
    )
  } else {
    return (
      <div id={id} className={[styles.tile, styles.empty].join(' ')}>
        <TileSVG content="0000"></TileSVG>
      </div>
    )
  }
}

export default EmptyTile