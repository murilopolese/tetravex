const W = 7
const H = 5

export const COLORS = [
  '#FACBDB', // empty color
  '#FACBDB',
  '#FF9D00',
  '#E8002B'
]

export function idToPosition(id: string) {
  const [ x, y ] = id.split('_').slice(1)
  return [ parseInt(x), parseInt(y) ]
}

export function randomTile() {
  function rnd() {
    // Avoid index 0
    return (Math.random()*(COLORS.length-2)+1).toFixed(0)
  }
  return `${rnd()}${rnd()}${rnd()}${rnd()}`
}

export function randomHand() {
  return [randomTile(), randomTile(), randomTile(), randomTile()]
}

export function getBoundaries(grid: string[][], x: number, y: number) {
  const up = grid[(H+y-1)%H][x]
  const down = grid[(y+1)%H][x]
  const left = grid[y][(W+x-1)%W]
  const right = grid[y][(x+1)%W]
  return [
    up ? parseInt(up[2]) : 0, 
    right ? parseInt(right[3]) : 0,
    down ? parseInt(down[0]) : 0,
    left ? parseInt(left[1]) : 0, 
  ]
}

export function canDrop(id: string, selectedTile: string, grid: string[][]) {
  // Turn string id into x,y grid coordinates
  const [ x, y ] = idToPosition(id)

  // Get surrounding boundaries
  const [ up, right, down, left ] = getBoundaries(grid, x, y)

  // Can't drop without surroundings
  if (!up && !right && !down && !left) return false

  // Can't drop if one of the surroundings is not valid
  if (up && parseInt(selectedTile[0]) != up) return false 
  if (right && parseInt(selectedTile[1]) != right) return false 
  if (down && parseInt(selectedTile[2]) != down) return false 
  if (left && parseInt(selectedTile[3]) != left) return false 

  // Otherwise assume you can drop
  return true
}

export function getInitialGrid() {
    const initialGrid: string[][] = Array(H).fill('').map(() => Array(W).fill('0000'))
    initialGrid[2][2] = randomTile()
    return initialGrid
}

export function getInitialGameContext() {
    return {
      grid: getInitialGrid(),
      hand: randomHand(),
      selectedTile: '',
      setGrid: () => undefined,
      setHand: () => undefined,
      setSelectedTile: () => undefined,
      lost: false
    }
}