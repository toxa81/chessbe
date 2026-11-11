import { useMemo, useRef, type KeyboardEvent } from 'react';
import { boardAxes, isDarkSquare, type Color, type Piece as ChessPiece, type Square } from '../chess/board';
import { Piece } from './Piece';
import { calculateAttacks } from '../chess/attacks';
import { AttackMarkers } from './AttackMarkers';

export type HighlightMode = 'off' | 'dots' | 'squares';

interface ChessboardProps {
  position: ReadonlyMap<Square, ChessPiece>;
  flipped: boolean;
  selected: Square | null;
  active: Square;
  highlightMode?: HighlightMode;
  onActiveChange: (square: Square) => void;
  onSelect: (square: Square) => void;
}

function Player({ color }: { color: Color }) {
  return <div className="player">
    <span className={`player-icon ${color}`} aria-hidden="true">♟</span>
    <span>{color === 'white' ? 'White' : 'Black'} pieces</span>
  </div>;
}

export function Chessboard({ position, flipped, selected, active, highlightMode = 'dots', onActiveChange, onSelect }: ChessboardProps) {
  const { files, ranks } = boardAxes(flipped);
  const attacks = useMemo(() => calculateAttacks(position), [position]);
  const buttons = useRef(new Map<Square, HTMLButtonElement>());
  const topColor = flipped ? 'white' : 'black';
  const bottomColor = flipped ? 'black' : 'white';

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
    <Player color={topColor} />
    <div className="board-frame">
      <div className="coordinates files top" aria-hidden="true">{files.map(file => <span key={file}>{file}</span>)}</div>
      <div className="coordinates ranks left" aria-hidden="true">{ranks.map(rank => <span key={rank}>{rank}</span>)}</div>
      <div id="board" className="board" role="group" aria-label={`Chessboard, ${flipped ? 'black' : 'white'} at bottom`}>
        {ranks.flatMap((rank, row) => files.map((file, col) => {
          const square: Square = `${file}${rank}`;
          const piece = position.get(square);
          const squareAttacks = attacks.get(square);
          const whiteAttacks = squareAttacks?.white ?? [];
          const blackAttacks = squareAttacks?.black ?? [];
          const attackDescription = `Attacks: ${whiteAttacks.length} white, ${blackAttacks.length} black.`;
          const attackColor = whiteAttacks.length ? (blackAttacks.length ? 'both' : 'white') : (blackAttacks.length ? 'black' : null);
          const highlightClass = highlightMode === 'squares' && attackColor ? ` attack-${attackColor}` : '';
          return <button
            key={square}
            ref={element => { if (element) buttons.current.set(square, element); else buttons.current.delete(square); }}
            type="button"
            className={`square${isDarkSquare(file, rank) ? ' dark' : ''}${highlightClass}${selected === square ? ' selected' : ''}`}
            data-square={square}
            tabIndex={active === square ? 0 : -1}
            aria-label={`${square}, ${piece ? `${piece.color} ${piece.type}` : 'empty'}`}
            aria-description={attackDescription}
            title={attackDescription}
            aria-pressed={selected === square}
            onFocus={() => onActiveChange(square)}
            onClick={() => { onActiveChange(square); onSelect(square); }}
            onKeyDown={event => navigate(event, row, col)}
          >
            {piece && <Piece piece={piece} />}
            {highlightMode === 'dots' && <>
              <AttackMarkers color="white" sources={whiteAttacks} edge={flipped ? 'top' : 'bottom'} />
              <AttackMarkers color="black" sources={blackAttacks} edge={flipped ? 'bottom' : 'top'} />
            </>}
          </button>;
        }))}
      </div>
      <div className="coordinates ranks right" aria-hidden="true">{ranks.map(rank => <span key={rank}>{rank}</span>)}</div>
      <div className="coordinates files bottom" aria-hidden="true">{files.map(file => <span key={file}>{file}</span>)}</div>
    </div>
    <Player color={bottomColor} />
  </div>;
}
