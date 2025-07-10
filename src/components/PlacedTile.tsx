import type { TileProps } from './TileTypes'
import TileSVG from "./TileSVG"
import styles from './App.module.css'

function TableTile(props: TileProps) {
  const { id, content } = props
  return (
    <div id={id} className={styles.tile}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default TableTile