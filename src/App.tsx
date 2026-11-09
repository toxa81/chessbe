import { useState } from 'react';
import { Chessboard } from './components/Chessboard';
import { startingPosition, type Square } from './chess/board';

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<Square | null>(null);
  const [active, setActive] = useState<Square>('a8');
  const piece = selected ? startingPosition.get(selected) : undefined;
  const selectionName = selected ? `${selected.toUpperCase()}${piece ? ` · ${piece.color} ${piece.type}` : ''}` : 'No square selected';
  const selectionDetail = selected ? (piece ? 'A piece in its starting position.' : 'An empty square.') : 'Select any square to inspect it.';
  const selectSquare = (square: Square) => setSelected(current => current === square ? null : square);
  function resetView() {
    setFlipped(false);
    setSelected(null);
    setActive('a8');
  }
  return <>
<header className="site-header">
      <a className="brand" href="./" aria-label="Chessbe home"><span className="brand-mark" aria-hidden="true">♞</span>chessbe<span className="brand-dot">.</span></a>
      <span className="header-label">BOARD EXPLORER</span>
      <a className="source-link" href="https://github.com/toxa81/chessbe">GitHub <span aria-hidden="true">↗</span></a>
    </header>
    <main>
      <section className="workspace" aria-label="Chessboard explorer">
        <Chessboard flipped={flipped} selected={selected} active={active} onActiveChange={setActive} onSelect={selectSquare} />
        <aside className="panel">
          <div className="panel-heading"><span className="eyebrow">THE BOARD</span><span className="version">v0.2</span></div>
          <h2>A fresh start.</h2>
          <p>The classic starting position. Take a look around, select a square, or see the board from the other side.</p>
          <div className="position-detail"><span className="status-dot"></span><span>Starting position</span><span className="turn">White to move</span></div>
          <div className="selection"><span className="detail-label">SELECTED SQUARE</span><strong id="selection-name" aria-live="polite">{selectionName}</strong><span id="selection-detail">{selectionDetail}</span></div>
          <button id="flip" onClick={() => setFlipped(value => !value)} className="button primary" type="button"><span aria-hidden="true">⇅</span> Flip board</button>
          <button id="reset" onClick={resetView} className="button secondary" type="button"><span aria-hidden="true">↺</span> Reset view</button>
          <p className="hint">Use the arrow keys to explore the board.<br />Press Enter or Space to select a square.</p>
          <div className="note"><span aria-hidden="true">◈</span><p>A small beginning.<br /><span>Board exploration comes first. Moves and analysis will follow.</span></p></div>
        </aside>
      </section>
    </main>
    <footer />
  </>;
}
