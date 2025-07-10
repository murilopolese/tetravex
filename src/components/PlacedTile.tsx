import type { TileProps } from './TileTypes'
import TileSVG from "./TileSVG"
import styles from './App.module.css'
import { useMemo } from 'react'
import { positionToId } from '../utilities'

function PlacedTile(props: TileProps) {
  const { x, y, content } = props
  const id = useMemo(() => positionToId(x, y), [x, y])
  return (
    <div id={id} className={styles.tile}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default PlacedTile