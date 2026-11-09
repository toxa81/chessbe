import { expect, it } from 'vitest';
import type { Color, Piece, PieceType, Square } from './board';
import { createExplorerState, explorerReducer, type ExplorerState } from './explorer';

const click = (state: ExplorerState, square: Square) => explorerReducer(state, { type: 'select', square });

it('moves a piece to an arbitrary empty square, clears selection, and preserves the previous state', () => {
  const initial = createExplorerState();
  const selected = click(initial, 'e2');
  expect(selected.selected).toBe('e2');
  const moved = click(selected, 'h5');
  expect(moved.position.get('h5')).toEqual({ color: 'white', type: 'pawn' });
  expect(moved.position.has('e2')).toBe(false);
  expect(moved.position.size).toBe(32);
  expect(moved.selected).toBeNull();
  expect(initial.position.has('e2')).toBe(true);
  expect(initial.position.has('h5')).toBe(false);
});

it.each(['e7', 'd2'] as const)('replaces a piece of either color at %s', destination => {
  const moved = click(click(createExplorerState(), 'e2'), destination);
  expect(moved.position.get(destination)).toEqual({ color: 'white', type: 'pawn' });
  expect(moved.position.has('e2')).toBe(false);
  expect(moved.position.size).toBe(31);
});

it('allows black to move first and the same color to move repeatedly', () => {
  const moved = click(click(createExplorerState(), 'e8'), 'b4');
  const again = click(click(moved, 'b4'), 'h1');
  expect(again.position.get('h1')).toEqual({ color: 'black', type: 'king' });
  expect(again.position.has('b4')).toBe(false);
});

it('keeps empty-square inspection and deselection without moving a piece', () => {
  const initial = createExplorerState();
  expect(click(click(initial, 'e2'), 'e2').selected).toBeNull();
  const empty = click(initial, 'e4');
  expect(empty.selected).toBe('e4');
  const selected = click(empty, 'd2');
  expect(selected.selected).toBe('d2');
  expect(selected.position).toBe(initial.position);
});

it('resets the pieces, selection, and last move to the starting position', () => {
  const moved = click(click(createExplorerState(), 'a1'), 'e8');
  const reset = explorerReducer(moved, { type: 'reset' });
  expect(reset).toEqual(createExplorerState());
});

it('cleans a selected board and can reset it to the starting position', () => {
  const selected = click(createExplorerState(), 'e2');
  const cleaned = explorerReducer(selected, { type: 'clean' });
  expect(cleaned.position.size).toBe(0);
  expect(cleaned.selected).toBeNull();
  expect(cleaned.lastMove).toBeNull();
  expect(selected.position.size).toBe(32);
  expect(explorerReducer(cleaned, { type: 'reset' })).toEqual(createExplorerState());
});

const palettePieces = (['white', 'black'] as Color[]).flatMap(color =>
  (['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'] as PieceType[]).map(type => ({ color, type })),
);

it.each(palettePieces)('places a $color $type on an empty square', piece => {
  const initial = explorerReducer(createExplorerState(), { type: 'clean' });
  const chosen = explorerReducer(initial, { type: 'choose-piece', piece });
  expect(chosen.palettePiece).toEqual(piece);
  const placed = click(chosen, 'e4');
  expect(placed.position.get('e4')).toEqual(piece);
  expect(placed.position.size).toBe(1);
  expect(placed.palettePiece).toBeNull();
  expect(placed.selected).toBeNull();
  expect(initial.position.size).toBe(0);
});

it('replaces an occupied square without moving a previously selected board piece', () => {
  const selected = click(createExplorerState(), 'a1');
  const piece: Piece = { color: 'black', type: 'queen' };
  const chosen = explorerReducer(selected, { type: 'choose-piece', piece });
  expect(chosen.selected).toBeNull();
  const placed = click(chosen, 'e1');
  expect(placed.position.get('e1')).toEqual(piece);
  expect(placed.position.get('a1')).toEqual(selected.position.get('a1'));
  expect(placed.position.size).toBe(32);
});

it('switches or cancels a palette selection and clears it on reset or clean', () => {
  const white: Piece = { color: 'white', type: 'king' };
  const black: Piece = { color: 'black', type: 'knight' };
  const chosen = explorerReducer(createExplorerState(), { type: 'choose-piece', piece: white });
  const switched = explorerReducer(chosen, { type: 'choose-piece', piece: black });
  expect(switched.palettePiece).toEqual(black);
  expect(explorerReducer(switched, { type: 'choose-piece', piece: black }).palettePiece).toBeNull();
  for (const type of ['clean', 'reset'] as const) {
    expect(explorerReducer(chosen, { type }).palettePiece).toBeNull();
  }
});
