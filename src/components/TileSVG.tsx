import { COLORS } from '../utilities'
import type { TileSVGProps } from './TileTypes'

function TileSVG(props: TileSVGProps) {
  const { content } = props
  const [ upId, rightId, downId, leftId ] = content.split('')
  const up = <polygon points='0, 0, 100, 0, 50, 50' style={{fill: COLORS[parseInt(upId)]}} />
  const right = <polygon points='100, 0, 100, 100, 50, 50' style={{fill: COLORS[parseInt(rightId)]}} />
  const down = <polygon points='0, 100, 100, 100, 50, 50' style={{fill: COLORS[parseInt(downId)]}} />
  const left = <polygon points='0, 0, 0, 100, 50, 50' style={{fill: COLORS[parseInt(leftId)]}} />
  return <svg viewBox="0 0 100 100" shapeRendering="crispEdges">{up} {right} {down} {left}</svg>
}

export default TileSVG