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
  const squareButtons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
  expect(squareButtons).toHaveLength(64);
  expect(squareButtons.every(button => !button.includes('<span'))).toBe(true);
  expect(html.match(/class="piece /g)).toHaveLength(32);
  expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
});

it.each([false, true])('shows one marker per attacker with rows following orientation (flipped: %s)', flipped => {
  const html = renderToStaticMarkup(<Chessboard position={startingPosition} flipped={flipped} selected={null} active="a8" onActiveChange={() => {}} onSelect={() => {}} />);
  const e3 = html.match(/<button\b[^>]*data-square="e3"[\s\S]*?<\/button>/)?.[0] ?? '';
  expect(e3).toContain(`class="attack-markers white ${flipped ? 'top' : 'bottom'}"`);
  expect(e3).toContain('data-source="d2"');
  expect(e3).toContain('data-source="f2"');
  expect(e3).toContain('aria-description="Attacks: 2 white, 0 black."');
  const e6 = html.match(/<button\b[^>]*data-square="e6"[\s\S]*?<\/button>/)?.[0] ?? '';
  expect(e6).toContain(`class="attack-markers black ${flipped ? 'bottom' : 'top'}"`);
});
