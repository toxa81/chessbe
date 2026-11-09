import { files, type Piece, type Rank, type Square } from './board';

export interface SquareAttacks {
  white: Square[];
  black: Square[];
}

type Offset = readonly [number, number];
const straight: readonly Offset[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const diagonal: readonly Offset[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const knight: readonly Offset[] = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];

/** Geometric attacks, including defended occupied squares and pinned pieces. */
export function calculateAttacks(position: ReadonlyMap<Square, Piece>): ReadonlyMap<Square, SquareAttacks> {
  const attacks = new Map<Square, SquareAttacks>();
  // Stable source order gives each attacking piece a consistent marker order.
  for (const [source, piece] of [...position.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const file = files.indexOf(source[0] as typeof files[number]);
    const rank = Number(source[1]);
    let directions: readonly Offset[];
    switch (piece.type) {
      case 'pawn': directions = [[-1, piece.color === 'white' ? 1 : -1], [1, piece.color === 'white' ? 1 : -1]]; break;
      case 'knight': directions = knight; break;
      case 'bishop': directions = diagonal; break;
      case 'rook': directions = straight; break;
      case 'queen': case 'king': directions = [...straight, ...diagonal]; break;
    }
    const sliding = piece.type === 'bishop' || piece.type === 'rook' || piece.type === 'queen';
    for (const [dx, dy] of directions) {
      for (let distance = 1; distance <= (sliding ? 7 : 1); distance++) {
        const targetFile = file + dx * distance;
        const targetRank = rank + dy * distance;
        if (targetFile < 0 || targetFile > 7 || targetRank < 1 || targetRank > 8) break;
        const target: Square = `${files[targetFile]}${targetRank as Rank}`;
        const squareAttacks = attacks.get(target) ?? { white: [], black: [] };
        squareAttacks[piece.color].push(source);
        attacks.set(target, squareAttacks);
        if (position.has(target)) break;
      }
    }
  }
  return attacks;
}
