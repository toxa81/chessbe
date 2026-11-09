import { describe, expect, it } from 'vitest';
import { calculateAttacks } from './attacks';
import { createStartingPosition, type Piece, type PieceType, type Square } from './board';

const position = (...entries: [Square, Piece][]) => new Map(entries);
const attackedBy = (board: ReadonlyMap<Square, Piece>, source: Square) =>
  [...calculateAttacks(board)].filter(([, attacks]) => [...attacks.white, ...attacks.black].includes(source)).map(([square]) => square).sort();

describe('piece attack patterns', () => {
  it.each([
    ['king', 8], ['queen', 27], ['rook', 14], ['bishop', 13], ['knight', 8], ['pawn', 2],
  ] as [PieceType, number][])('%s attacks the expected number of squares from d4', (type, count) => {
    const squares = attackedBy(position(['d4', { color: 'white', type }]), 'd4');
    expect(squares).toHaveLength(count);
    expect(squares).not.toContain('d4');
  });

  it('pawns attack only diagonally in their color direction, even on occupied squares', () => {
    const board = position(['d4', { color: 'white', type: 'pawn' }], ['e5', { color: 'black', type: 'pawn' }]);
    expect(attackedBy(board, 'd4')).toEqual(['c5', 'e5']);
    expect(attackedBy(board, 'e5')).toEqual(['d4', 'f4']);
  });

  it('does not wrap attacks around board edges or promote pawns automatically', () => {
    expect(attackedBy(position(['a1', { color: 'white', type: 'knight' }]), 'a1')).toEqual(['b3', 'c2']);
    expect(attackedBy(position(['h8', { color: 'black', type: 'king' }]), 'h8')).toEqual(['g7', 'g8', 'h7']);
    expect(attackedBy(position(['a2', { color: 'white', type: 'pawn' }]), 'a2')).toEqual(['b3']);
    expect(attackedBy(position(['e8', { color: 'white', type: 'pawn' }]), 'e8')).toEqual([]);
    expect(attackedBy(position(['e1', { color: 'black', type: 'pawn' }]), 'e1')).toEqual([]);
  });

  it('knights jump over surrounding pieces', () => {
    const board = position(
      ['d4', { color: 'white', type: 'knight' }],
      ['c4', { color: 'white', type: 'pawn' }], ['e4', { color: 'black', type: 'pawn' }],
      ['d3', { color: 'black', type: 'pawn' }], ['d5', { color: 'white', type: 'pawn' }],
    );
    expect(attackedBy(board, 'd4')).toEqual(['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5']);
  });
});

describe('blocking and defense', () => {
  it.each(['rook', 'bishop', 'queen'] as const)('%s includes friendly and enemy blockers but nothing beyond them', type => {
    const diagonal = type === 'bishop';
    const friendly: Square = diagonal ? 'f6' : 'd6';
    const enemy: Square = diagonal ? 'b2' : 'b4';
    const beyondFriendly: Square = diagonal ? 'g7' : 'd7';
    const beyondEnemy: Square = diagonal ? 'a1' : 'a4';
    const squares = attackedBy(position(
      ['d4', { color: 'white', type }],
      [friendly, { color: 'white', type: 'pawn' }],
      [enemy, { color: 'black', type: 'pawn' }],
    ), 'd4');
    expect(squares).toContain(friendly);
    expect(squares).toContain(enemy);
    expect(squares).not.toContain(beyondFriendly);
    expect(squares).not.toContain(beyondEnemy);
  });

  it('counts attacks by a pinned piece without exposing squares behind the blocker', () => {
    const board = position(
      ['e1', { color: 'white', type: 'king' }], ['e2', { color: 'white', type: 'rook' }],
      ['e8', { color: 'black', type: 'rook' }],
    );
    expect(calculateAttacks(board).get('d2')?.white).toContain('e2');
    expect(calculateAttacks(board).get('e2')?.black).toContain('e8');
    expect(calculateAttacks(board).get('e1')?.black ?? []).not.toContain('e8');
  });

  it('keeps a separate marker source for every attacker of either color in stable order', () => {
    const board = position(
      ['g7', { color: 'black', type: 'bishop' }], ['d1', { color: 'white', type: 'rook' }],
      ['a4', { color: 'white', type: 'rook' }],
    );
    expect(calculateAttacks(board).get('d4')).toEqual({ white: ['a4', 'd1'], black: ['g7'] });
    expect(board.size).toBe(3);
  });

  it('recalculates after blockers are removed and has no attacks on a clean board', () => {
    const board = position(['a1', { color: 'white', type: 'rook' }], ['a2', { color: 'black', type: 'pawn' }]);
    expect(calculateAttacks(board).get('a8')).toBeUndefined();
    board.delete('a2');
    expect(calculateAttacks(board).get('a8')?.white).toEqual(['a1']);
    expect(calculateAttacks(new Map()).size).toBe(0);
  });

  it('matches known starting-position overlaps and blocked files', () => {
    const attacks = calculateAttacks(createStartingPosition());
    expect(attacks.get('e3')).toEqual({ white: ['d2', 'f2'], black: [] });
    expect(attacks.get('e6')).toEqual({ white: [], black: ['d7', 'f7'] });
    expect(attacks.get('a2')?.white).toContain('a1');
    expect(attacks.get('a4')).toBeUndefined();
  });
});
