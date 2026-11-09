import { useReducer, useState } from 'react';
import { Chessboard } from './components/Chessboard';
import type { Square } from './chess/board';
import { createExplorerState, explorerReducer } from './chess/explorer';

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [{ position, selected, lastMove }, dispatch] = useReducer(explorerReducer, undefined, createExplorerState);
  const [active, setActive] = useState<Square>('a8');
  const piece = selected ? position.get(selected) : undefined;
  const selectionName = selected ? `${selected.toUpperCase()}${piece ? ` · ${piece.color} ${piece.type}` : ''}` : 'No square selected';
  const selectionDetail = selected ? (piece ? 'Click another square to move this piece. Click again to deselect.' : 'An empty square. Select a piece to move it.') : (lastMove ?? 'Select a piece, then click its destination.');
  const selectSquare = (square: Square) => dispatch({ type: 'select', square });
  function resetBoard() {
    setFlipped(false);
    dispatch({ type: 'reset' });
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
        <Chessboard position={position} flipped={flipped} selected={selected} active={active} onActiveChange={setActive} onSelect={selectSquare} />
        <aside className="panel">
          <div className="panel-heading"><span className="eyebrow">THE BOARD</span><span className="version">v0.2</span></div>
          <h2>Explore the board.</h2>
          <p>Click a piece, then click any other square to move it. An occupied destination replaces the piece there.</p>
          <div className="position-detail"><span className="status-dot"></span><span>Free placement</span><span className="turn">Either color</span></div>
          <div className="selection" aria-live="polite"><span className="detail-label">SELECTED SQUARE</span><strong id="selection-name">{selectionName}</strong><span id="selection-detail">{selectionDetail}</span></div>
          <button id="flip" onClick={() => setFlipped(value => !value)} className="button primary" type="button"><span aria-hidden="true">⇅</span> Flip board</button>
          <button id="reset" onClick={resetBoard} className="button secondary" type="button"><span aria-hidden="true">↺</span> Reset board</button>
          <p className="hint">Use the arrow keys to explore the board.<br />Press Enter or Space to select a square.</p>
          <div className="note"><span aria-hidden="true">◈</span><p>Your board, your moves.<br /><span>No move rules or turns. Reset the board to start again.</span></p></div>
        </aside>
      </section>
    </main>
    <footer />
  </>;
}
