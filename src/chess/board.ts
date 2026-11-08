export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const ranks = [8, 7, 6, 5, 4, 3, 2, 1] as const;
export type File = typeof files[number];
export type Rank = typeof ranks[number];
export type Square = `${File}${Rank}`;
export type Color = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export interface Piece { readonly color: Color; readonly type: PieceType }

const backRank: readonly PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

export function createStartingPosition(): ReadonlyMap<Square, Piece> {
  const position = new Map<Square, Piece>();
  files.forEach((file, index) => {
    position.set(`${file}1`, { color: 'white', type: backRank[index] });
    position.set(`${file}2`, { color: 'white', type: 'pawn' });
    position.set(`${file}7`, { color: 'black', type: 'pawn' });
    position.set(`${file}8`, { color: 'black', type: backRank[index] });
  });
  return position;
}

export const startingPosition = createStartingPosition();

export function boardAxes(flipped: boolean) {
  return {
    files: flipped ? [...files].reverse() : [...files],
    ranks: flipped ? [...ranks].reverse() : [...ranks],
  };
}

export function isDarkSquare(file: File, rank: Rank): boolean {
  return (files.indexOf(file) + rank) % 2 === 1;
}
