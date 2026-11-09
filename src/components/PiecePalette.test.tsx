import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { PiecePalette } from './PiecePalette';

it('renders white then black pieces in the requested order with one selected piece', () => {
  const html = renderToStaticMarkup(<PiecePalette selected={{ color: 'black', type: 'knight' }} onSelect={() => {}} />);
  const labels = [...html.matchAll(/aria-label="Place ([^"]+)"/g)].map(match => match[1]);
  expect(labels).toEqual([
    'white king', 'white queen', 'white rook', 'white bishop', 'white knight', 'white pawn',
    'black king', 'black queen', 'black rook', 'black bishop', 'black knight', 'black pawn',
  ]);
  expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  expect(html).toContain('aria-label="Place black knight" aria-pressed="true"');
  expect(html.match(/<svg\b/g)).toHaveLength(12);
});
