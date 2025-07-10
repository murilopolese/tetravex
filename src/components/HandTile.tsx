import TileSVG from "./TileSVG"
import { CSS } from "@dnd-kit/utilities"
import { useDraggable } from "@dnd-kit/core"
import styles from './App.module.css'

type TileProps = {
  id: string;
  content: string;
}

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