import { useReducer, useState } from 'react';
import { Chessboard } from './components/Chessboard';
import { PiecePalette } from './components/PiecePalette';
import type { Square } from './chess/board';
import { createExplorerState, explorerReducer } from './chess/explorer';

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [{ position, selected, palettePiece }, dispatch] = useReducer(explorerReducer, undefined, createExplorerState);
  const [active, setActive] = useState<Square>('a8');
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
        <aside className="panel" aria-label="Board controls">
          <div className="board-actions">
            <button id="reset" onClick={resetBoard} className="button secondary" type="button">Reset board</button>
            <button id="flip" onClick={() => setFlipped(value => !value)} className="button primary" type="button">Flip board</button>
            <button id="clean" onClick={() => dispatch({ type: 'clean' })} className="button secondary" type="button">Clean board</button>
          </div>
          <PiecePalette selected={palettePiece} onSelect={piece => dispatch({ type: 'choose-piece', piece })} />
        </aside>
      </section>
    </main>
    <footer />
  </>;
}
