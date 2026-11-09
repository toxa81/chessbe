import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Chessboard } from './Chessboard';
import { startingPosition } from '../chess/board';

it.each([false, true])('renders labels outside the squares on all four sides (flipped: %s)', flipped => {
  const html = renderToStaticMarkup(<Chessboard position={startingPosition} flipped={flipped} selected="e2" active="a8" onActiveChange={() => {}} onSelect={() => {}} />);
  const files = flipped ? 'hgfedcba' : 'abcdefgh';
  const ranks = flipped ? '12345678' : '87654321';
  for (const [axis, sides, labels] of [['files', ['top', 'bottom'], files], ['ranks', ['left', 'right'], ranks]] as const) {
    for (const side of sides) {
      const labelStrip = `<div class="coordinates ${axis} ${side}" aria-hidden="true">${[...labels].map(label => `<span>${label}</span>`).join('')}</div>`;
      expect(html).toContain(labelStrip);
    }
  }
  const squareButtons = html.match(/<button\b[^>]*>.*?<\/button>/g) ?? [];
  expect(squareButtons).toHaveLength(64);
  expect(squareButtons.every(button => !button.includes('<span'))).toBe(true);
  expect(html.match(/<svg\b/g)).toHaveLength(32);
  expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
});
