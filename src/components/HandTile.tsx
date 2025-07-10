import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { HandTileProps } from './TileTypes'
import TileSVG from "./TileSVG"
import styles from './App.module.css'
import { positionToId } from "../utilities"
import { useMemo } from "react"

function HandTile(props: HandTileProps) {
  const { x, content } = props
  const id = useMemo(() => positionToId(x), [x]) 
  const { attributes, listeners, setNodeRef, transform } = useDraggable({id: id})
  const style = { transform: CSS.Translate.toString(transform)}
  return (
    <div 
      id={id} 
      className={styles.tile } 
      {...attributes} 
      {...listeners} 
      ref={setNodeRef} 
      style={style}
      >
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default HandTile