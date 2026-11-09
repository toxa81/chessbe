import type { Color, Piece as ChessPiece, PieceType } from '../chess/board';
import { Piece } from './Piece';

const colors: readonly Color[] = ['white', 'black'];
const pieceTypes: readonly PieceType[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];

interface PiecePaletteProps {
  selected: ChessPiece | null;
  onSelect: (piece: ChessPiece) => void;
}

export function PiecePalette({ selected, onSelect }: PiecePaletteProps) {
  return <div className="piece-palette" role="group" aria-label="Piece palette">
    {colors.flatMap((color, row) => pieceTypes.map((type, column) => {
      const piece = { color, type };
      const isSelected = selected?.color === color && selected.type === type;
      return <button
        key={`${color}-${type}`}
        type="button"
        className={`square${(row + column) % 2 === 0 ? ' dark' : ''}${isSelected ? ' selected' : ''}`}
        aria-label={`Place ${color} ${type}`}
        aria-pressed={isSelected}
        title={`Place ${color} ${type}`}
        onClick={() => onSelect(piece)}
      ><Piece piece={piece} /></button>;
    }))}
  </div>;
}
