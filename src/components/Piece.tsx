import type { ReactNode } from "react";
import type { Piece as ChessPiece, PieceType } from "../chess/board";

// Original SVG silhouettes shared by both colors.
const shapes: Record<PieceType, ReactNode> = {
  pawn: <><circle cx="24" cy="13" r="6"/><path d="M20 19h8c-3 8-1 12 4 15H16c5-3 7-7 4-15Z"/><path d="M15 34h18l2 6H13Z"/></>,
  rook: <><path d="M13 8h6v5h3V8h4v5h3V8h6v11l-5 4 1 11H17l1-11-5-4Z"/><path d="M15 34h18l2 6H13Z"/><path className="detail" d="M16 19h16M18 24h12"/></>,
  knight: <><path d="m16 8 8 3 5-3c8 9 9 18 4 26H16c6-6 9-11 6-15l-7 6-5-4 9-10Z"/><path d="M15 34h19l2 6H13Z"/><path className="detail" d="m25 14 3 2m-10 3-3 2m15-2c2 6 0 9-3 12"/></>,
  bishop: <><path d="M24 6c-4 5-10 9-9 14 0 4 4 6 7 7l-5 7h14l-5-7c4-1 7-3 7-7 1-5-5-9-9-14Z"/><path d="M15 34h18l2 6H13Z"/><path className="detail" d="m24 12 4 7M19 28h10"/></>,
  queen: <><path d="m12 15 6 7 6-10 6 10 6-7-5 19H17Z"/><circle cx="11" cy="12" r="3"/><circle cx="24" cy="9" r="3"/><circle cx="37" cy="12" r="3"/><path d="M15 34h18l2 6H13Z"/><path className="detail" d="M17 29h14"/></>,
  king: <><path className="detail" d="M24 5v10m-5-6h10"/><path d="M24 16c-6-7-15-1-11 6l6 8-2 4h14l-2-4 6-8c4-7-5-13-11-6Z"/><path d="M15 34h18l2 6H13Z"/><path className="detail" d="M19 29h10m-5-11v10"/></>,
};

export function Piece({ piece }: { piece: ChessPiece }) {
  return <svg className={`piece ${piece.color}`} viewBox="0 0 48 48" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">{shapes[piece.type]}</svg>;
}
