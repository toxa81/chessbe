import { createStartingPosition, type Piece, type Square } from './board';

export interface ExplorerState {
  position: ReadonlyMap<Square, Piece>;
  selected: Square | null;
  palettePiece: Piece | null;
  deleteMode: boolean;
  lastMove: string | null;
}

type ExplorerAction = { type: 'select'; square: Square } | { type: 'choose-piece'; piece: Piece } | { type: 'toggle-delete' } | { type: 'reset' } | { type: 'clean' };

export function createExplorerState(): ExplorerState {
  return { position: createStartingPosition(), selected: null, palettePiece: null, deleteMode: false, lastMove: null };
}

export function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  if (action.type === 'reset') return createExplorerState();
  if (action.type === 'clean') return { position: new Map(), selected: null, palettePiece: null, deleteMode: false, lastMove: null };
  if (action.type === 'toggle-delete') {
    return { ...state, selected: null, palettePiece: null, deleteMode: !state.deleteMode };
  }
  if (action.type === 'choose-piece') {
    const samePiece = state.palettePiece?.color === action.piece.color && state.palettePiece.type === action.piece.type;
    return { ...state, selected: null, palettePiece: samePiece ? null : action.piece, deleteMode: false };
  }
  const { square } = action;
  if (state.deleteMode) {
    const piece = state.position.get(square);
    if (!piece) return state;
    const position = new Map(state.position);
    position.delete(square);
    return { ...state, position, lastMove: `Removed ${piece.color} ${piece.type} from ${square.toUpperCase()}.` };
  }
  if (state.palettePiece) {
    const position = new Map(state.position);
    position.set(square, state.palettePiece);
    return {
      position,
      selected: null,
      palettePiece: null,
      deleteMode: false,
      lastMove: `Placed ${state.palettePiece.color} ${state.palettePiece.type} on ${square.toUpperCase()}.`,
    };
  }
  if (square === state.selected) return { ...state, selected: null };

  const piece = state.selected ? state.position.get(state.selected) : undefined;
  if (!piece) return { ...state, selected: square };

  const position = new Map(state.position);
  position.delete(state.selected!);
  position.set(square, piece);
  return {
    position,
    selected: null,
    palettePiece: null,
    deleteMode: false,
    lastMove: `Moved ${piece.color} ${piece.type} from ${state.selected!.toUpperCase()} to ${square.toUpperCase()}.`,
  };
}
