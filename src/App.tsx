import { useReducer, useState } from 'react';
import { Chessboard, type HighlightMode } from './components/Chessboard';
import { PiecePalette } from './components/PiecePalette';
import type { Square } from './chess/board';
import { createExplorerState, explorerReducer } from './chess/explorer';

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [{ position, selected, palettePiece, deleteMode }, dispatch] = useReducer(explorerReducer, undefined, createExplorerState);
  const [active, setActive] = useState<Square>('a8');
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('dots');
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
        <Chessboard position={position} flipped={flipped} selected={selected} active={active} highlightMode={highlightMode} onActiveChange={setActive} onSelect={selectSquare} />
        <aside className="panel" aria-label="Board controls">
          <div className="board-actions">
            <button id="reset" onClick={resetBoard} className="button secondary" type="button">Reset board</button>
            <button id="flip" onClick={() => setFlipped(value => !value)} className="button primary" type="button">Flip board</button>
            <button id="clean" onClick={() => dispatch({ type: 'clean' })} className="button secondary" type="button">Clean board</button>
          </div>
          <p className="tool-hint">To add a piece, select it below, then click a board square.</p>
          <PiecePalette selected={palettePiece} onSelect={piece => dispatch({ type: 'choose-piece', piece })} />
          <p id="delete-hint" className="tool-hint">To remove pieces, turn on Delete pieces, then click them on the board. Toggle it off when finished.</p>
          <button
            className={`button ${deleteMode ? 'primary' : 'secondary'} delete-toggle`}
            type="button"
            aria-pressed={deleteMode}
            aria-describedby="delete-hint"
            onClick={() => dispatch({ type: 'toggle-delete' })}
          >Delete pieces</button>
          <h2 id="highlight-title" className="highlight-title">highlight</h2>
          <div className="board-actions" role="group" aria-labelledby="highlight-title">
            {(['off', 'dots', 'squares'] as const).map(mode => <button
              key={mode}
              type="button"
              className={`button ${highlightMode === mode ? 'primary' : 'secondary'}`}
              aria-pressed={highlightMode === mode}
              onClick={() => setHighlightMode(mode)}
            >{mode}</button>)}
          </div>
        </aside>
      </section>
    </main>
    <footer />
  </>;
}
