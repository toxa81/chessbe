import { useRef, type KeyboardEvent } from 'react';
import { boardAxes, isDarkSquare, startingPosition, type Color, type Square } from '../chess/board';
import { Piece } from './Piece';

interface ChessboardProps {
  flipped: boolean;
  selected: Square | null;
  active: Square;
  onActiveChange: (square: Square) => void;
  onSelect: (square: Square) => void;
}

function Player({ color }: { color: Color }) {
  return <div className="player">
    <span className={`player-icon ${color}`} aria-hidden="true">♟</span>
    <span>{color === 'white' ? 'White' : 'Black'} pieces<small>{color === 'white' ? 'White to move' : 'Starting position'}</small></span>
    <span className="piece-count">16 pieces</span>
  </div>;
}

export function Chessboard({ flipped, selected, active, onActiveChange, onSelect }: ChessboardProps) {
  const { files, ranks } = boardAxes(flipped);
  const buttons = useRef(new Map<Square, HTMLButtonElement>());

  function navigate(event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) {
    const delta: Record<string, readonly [number, number]> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    };
    const direction = delta[event.key];
    if (!direction) return;
    event.preventDefault();
    const nextCol = Math.max(0, Math.min(7, col + direction[0]));
    const nextRow = Math.max(0, Math.min(7, row + direction[1]));
    buttons.current.get(`${files[nextCol]}${ranks[nextRow]}`)?.focus();
  }

  return <div className="board-column">
    <Player color={flipped ? 'white' : 'black'} />
    <div className="board-frame">
      <div className="coordinates files top" aria-hidden="true">{files.map(file => <span key={file}>{file}</span>)}</div>
      <div className="coordinates ranks left" aria-hidden="true">{ranks.map(rank => <span key={rank}>{rank}</span>)}</div>
      <div id="board" className="board" role="group" aria-label={`Chessboard, ${flipped ? 'black' : 'white'} at bottom`}>
        {ranks.flatMap((rank, row) => files.map((file, col) => {
          const square: Square = `${file}${rank}`;
          const piece = startingPosition.get(square);
          return <button
            key={square}
            ref={element => { if (element) buttons.current.set(square, element); else buttons.current.delete(square); }}
            type="button"
            className={`square${isDarkSquare(file, rank) ? ' dark' : ''}${selected === square ? ' selected' : ''}`}
            data-square={square}
            tabIndex={active === square ? 0 : -1}
            aria-label={`${square}, ${piece ? `${piece.color} ${piece.type}` : 'empty'}`}
            aria-pressed={selected === square}
            onFocus={() => onActiveChange(square)}
            onClick={() => { onActiveChange(square); onSelect(square); }}
            onKeyDown={event => navigate(event, row, col)}
          >{piece && <Piece piece={piece} />}</button>;
        }))}
      </div>
      <div className="coordinates ranks right" aria-hidden="true">{ranks.map(rank => <span key={rank}>{rank}</span>)}</div>
      <div className="coordinates files bottom" aria-hidden="true">{files.map(file => <span key={file}>{file}</span>)}</div>
    </div>
    <Player color={flipped ? 'black' : 'white'} />
  </div>;
}
