import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { ReactNode } from "react";

export type GameContextType = {
  grid: string[][],
  hand: string[],
  selectedTile: string|null,
  setGrid?: (g: string[][]) => void,
  setHand?: (g: string[]) => void,
  setSelectedTile?: (g: string) => void,
  lost: boolean,
  handleDragStart: (e: DragStartEvent) => void,
  handleDragEnd: (e: DragEndEvent) => void,
  restart: () => void
}

export type GameContextProps = {
  children?: ReactNode
}