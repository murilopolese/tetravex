import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { TileProps } from './TileTypes'
import TileSVG from "./TileSVG"
import styles from './App.module.css'

function HandTile(props: TileProps) {
  const { id, content } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({id: id})
  const style = { transform: CSS.Translate.toString(transform)}
  return (
    <div id={id} className={styles.tile } {...attributes} {...listeners} ref={setNodeRef} style={style}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default HandTile