import EmptyTile from './EmptyTile'
import PlacedTile from './PlacedTile'
import type { TileProps } from './TileTypes'

function Tile(props: TileProps) {
  const { x, y, content } = props
  const empty = content == '0000'
  if (empty) {
    return <EmptyTile x={x} y={y} />
  } else {
    return <PlacedTile x={x} y={y} content={content} />
  }
}

export default Tile