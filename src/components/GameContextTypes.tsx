import type { ReactNode } from "react";

export type GameContextType = {
  grid: string[][];
  hand: string[];
  selectedTile: string|null;
  setGrid: (g: string[][]) => void;
  setHand: (g: string[]) => void;
  setSelectedTile: (g: string) => void;
  lost: boolean
}

export type GameContextProps = {
  children?: ReactNode
}