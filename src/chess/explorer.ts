import { createStartingPosition, type Piece, type Square } from './board';

export interface ExplorerState {
  position: ReadonlyMap<Square, Piece>;
  selected: Square | null;
  lastMove: string | null;
}

type ExplorerAction = { type: 'select'; square: Square } | { type: 'reset' } | { type: 'clean' };

export function createExplorerState(): ExplorerState {
  return { position: createStartingPosition(), selected: null, lastMove: null };
}

export function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  if (action.type === 'reset') return createExplorerState();
  if (action.type === 'clean') return { position: new Map(), selected: null, lastMove: null };
  const { square } = action;
  if (square === state.selected) return { ...state, selected: null };

  const piece = state.selected ? state.position.get(state.selected) : undefined;
  if (!piece) return { ...state, selected: square };

  const position = new Map(state.position);
  position.delete(state.selected!);
  position.set(square, piece);
  return {
    position,
    selected: null,
    lastMove: `Moved ${piece.color} ${piece.type} from ${state.selected!.toUpperCase()} to ${square.toUpperCase()}.`,
  };
}
