import type { GameContextType } from "./components/GameContextTypes"

const W = 5
const H = 6

export const COLORS = [
  '#FACBDB', // empty color
  '#FACBDB',
  '#FF9D00',
  '#E8002B'
]

export const idToPosition = (id: string): number[] => {
  const [ x, y ] = id.split('_').slice(1)
  return [ parseInt(x), parseInt(y) ]
}

export const randomTile = () : string => {
  function rnd() {
    // Avoid index 0
    return (Math.random()*(COLORS.length-2)+1).toFixed(0)
  }
  return `${rnd()}${rnd()}${rnd()}${rnd()}`
}

export const randomHand = (): string[] => {
  return [randomTile(), randomTile(), randomTile(), randomTile()]
}

export const getBoundaries = (grid: string[][], x: number, y: number): number[] => {
  // This function will return the specific color index and not the entire tile
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

export const canDrop = (id: string, selectedTile: string, grid: string[][]): boolean => {
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

export const getInitialGrid = (): string[][] => {
    const initialGrid: string[][] = Array(H).fill('').map(() => Array(W).fill('0000'))
    initialGrid[2][2] = randomTile()
    return initialGrid
}

export const getInitialGameContext = (): GameContextType => {
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