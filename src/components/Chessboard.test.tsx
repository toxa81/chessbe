import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Chessboard } from './Chessboard';
import { startingPosition, type Piece, type Square } from '../chess/board';

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

it.each(['off', 'dots', 'squares'] as const)('renders only the selected attack visualization: %s', highlightMode => {
  const position = new Map<Square, Piece>([
    ['d1', { color: 'white', type: 'rook' }],
    ['g7', { color: 'black', type: 'bishop' }],
  ]);
  const html = renderToStaticMarkup(<Chessboard position={position} flipped={false} selected="d4" active="d4" highlightMode={highlightMode} onActiveChange={() => {}} onSelect={() => {}} />);
  const square = (name: Square) => html.match(new RegExp(`<button\\b[^>]*data-square="${name}"[\\s\\S]*?<\\/button>`))?.[0] ?? '';
  if (highlightMode === 'squares') {
    expect(html).not.toContain('attack-markers');
    expect(square('d4')).toContain('attack-both selected');
    expect(square('d3')).toContain('attack-white');
    expect(square('f6')).toContain('attack-black');
    expect(square('h2')).not.toContain('attack-');
  } else if (highlightMode === 'dots') {
    expect(square('d4')).toContain('attack-markers white bottom');
    expect(square('d4')).toContain('attack-markers black top');
    expect(html).not.toContain('attack-both');
  } else {
    expect(html).not.toContain('attack-markers');
    expect(html).not.toContain('attack-both');
    expect(html).not.toContain('attack-white');
    expect(html).not.toContain('attack-black');
  }
  expect(square('d4')).toContain('aria-description="Attacks: 1 white, 1 black."');
  expect(square('d4')).toContain('aria-pressed="true"');
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
