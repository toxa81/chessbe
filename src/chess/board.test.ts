import { describe, expect, it } from 'vitest';
import { boardAxes, createStartingPosition, isDarkSquare } from './board';

describe('starting position', () => {
  it('places both armies with kings and queens on the correct files', () => {
    const position = createStartingPosition();
    expect(position.size).toBe(32);
    for (const color of ['white', 'black']) {
      expect([...position.values()].filter(piece => piece.color === color)).toHaveLength(16);
    }
    expect(position.get('d1')).toEqual({ color: 'white', type: 'queen' });
    expect(position.get('e8')).toEqual({ color: 'black', type: 'king' });
    expect(position.has('e4')).toBe(false);
  });
});

describe('board orientation', () => {
  it('reverses both axes while keeping square colors fixed', () => {
    expect(boardAxes(false)).toEqual({ files: ['a','b','c','d','e','f','g','h'], ranks: [8,7,6,5,4,3,2,1] });
    expect(boardAxes(true)).toEqual({ files: ['h','g','f','e','d','c','b','a'], ranks: [1,2,3,4,5,6,7,8] });
    expect(isDarkSquare('a', 1)).toBe(true);
    expect(isDarkSquare('h', 1)).toBe(false);
    expect(isDarkSquare('a', 8)).toBe(false);
    expect(isDarkSquare('h', 8)).toBe(true);
  });
});
