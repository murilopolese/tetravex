import EmptyTile from './EmptyTile'
import PlacedTile from './PlacedTile'
import type { TileProps } from './TileTypes'

function Tile(props: TileProps) {
  const { id, content } = props
  const empty = content == '0000'
  if (empty) {
    return <EmptyTile id={id} />
  } else {
    return <PlacedTile id={id} content={content} />
  }
}

export default Tile