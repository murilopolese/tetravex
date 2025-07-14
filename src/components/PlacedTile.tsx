import type { TileProps } from './TileTypes'
import TileSVG from "./TileSVG"
import styles from './App.module.css'
import { useContext, useMemo } from 'react'
import { positionToId, getTileSize } from '../utilities'
import { Context as GameContext } from './GameContext'

function PlacedTile(props: TileProps) {
  const { x, y, content } = props
  const id = useMemo(() => positionToId(x, y), [x, y])
  const { windowWidth } = useContext(GameContext)
  
  let style = {
    width: `${getTileSize(windowWidth)}px`,
    height: `${getTileSize(windowWidth)}px` 
  }
  return (
    <div id={id} className={styles.tile} style={style}>
      <TileSVG content={content}></TileSVG>
    </div>
  )
}

export default PlacedTile