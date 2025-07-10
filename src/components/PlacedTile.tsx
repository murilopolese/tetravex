import TileSVG from "./TileSVG"
import styles from './App.module.css'

type TileProps = {
  id: string;
  content: string;
}

function TableTile(props: TileProps) {
  const { id, content } = props
  return (
    <div id={id} className={styles.tile}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default TableTile