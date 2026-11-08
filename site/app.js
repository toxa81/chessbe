const files = 'abcdefgh';
const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
const pieces = new Map();
for (let file = 0; file < 8; file++) {
  for (const [rank, color, type] of [[1, 'white', backRank[file]], [2, 'white', 'pawn'], [7, 'black', 'pawn'], [8, 'black', backRank[file]]]) {
    pieces.set(`${files[file]}${rank}`, { color, type });
  }
}

// Original SVG silhouettes, shared by both colors; no image or library dependency.
const shapes = {
  pawn: '<circle cx="24" cy="13" r="6"/><path d="M20 19h8c-3 8-1 12 4 15H16c5-3 7-7 4-15Z"/><path d="M15 34h18l2 6H13Z"/>',
  rook: '<path d="M13 8h6v5h3V8h4v5h3V8h6v11l-5 4 1 11H17l1-11-5-4Z"/><path d="M15 34h18l2 6H13Z"/><path class="detail" d="M16 19h16M18 24h12"/>',
  knight: '<path d="m16 8 8 3 5-3c8 9 9 18 4 26H16c6-6 9-11 6-15l-7 6-5-4 9-10Z"/><path d="M15 34h19l2 6H13Z"/><path class="detail" d="m25 14 3 2m-10 3-3 2m15-2c2 6 0 9-3 12"/>',
  bishop: '<path d="M24 6c-4 5-10 9-9 14 0 4 4 6 7 7l-5 7h14l-5-7c4-1 7-3 7-7 1-5-5-9-9-14Z"/><path d="M15 34h18l2 6H13Z"/><path class="detail" d="m24 12 4 7M19 28h10"/>',
  queen: '<path d="m12 15 6 7 6-10 6 10 6-7-5 19H17Z"/><circle cx="11" cy="12" r="3"/><circle cx="24" cy="9" r="3"/><circle cx="37" cy="12" r="3"/><path d="M15 34h18l2 6H13Z"/><path class="detail" d="M17 29h14"/>',
  king: '<path class="detail" d="M24 5v10m-5-6h10"/><path d="M24 16c-6-7-15-1-11 6l6 8-2 4h14l-2-4 6-8c4-7-5-13-11-6Z"/><path d="M15 34h18l2 6H13Z"/><path class="detail" d="M19 29h10m-5-11v10"/>',
};
const board = document.querySelector('#board');
const selectionName = document.querySelector('#selection-name');
const selectionDetail = document.querySelector('#selection-detail');
let flipped = false;
let selected = null;
let active = 'a8';

function select(square) {
  selected = selected === square ? null : square;
  const piece = pieces.get(selected);
  selectionName.textContent = selected ? `${selected.toUpperCase()}${piece ? ` · ${piece.color} ${piece.type}` : ''}` : 'No square selected';
  selectionDetail.textContent = selected ? (piece ? 'A piece in its starting position.' : 'An empty square.') : 'Select any square to inspect it.';
  for (const button of board.children) {
    button.classList.toggle('selected', button.dataset.square === selected);
    button.setAttribute('aria-pressed', String(button.dataset.square === selected));
  }
}

function render() {
  board.replaceChildren();
  board.setAttribute('aria-label', `Chessboard, ${flipped ? 'black' : 'white'} at bottom`);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const file = flipped ? 7 - col : col;
      const rank = flipped ? row + 1 : 8 - row;
      const square = `${files[file]}${rank}`;
      const piece = pieces.get(square);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `square${(file + rank) % 2 === 1 ? ' dark' : ''}${square === selected ? ' selected' : ''}`;
      button.dataset.square = square;
      button.tabIndex = square === active ? 0 : -1;
      button.setAttribute('aria-label', `${square}, ${piece ? `${piece.color} ${piece.type}` : 'empty'}`);
      button.setAttribute('aria-pressed', String(square === selected));
      if (piece) button.innerHTML = `<svg class="piece ${piece.color}" viewBox="0 0 48 48" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">${shapes[piece.type]}</svg>`;
      if (col === 0) button.insertAdjacentHTML('beforeend', `<span class="coordinate rank" aria-hidden="true">${rank}</span>`);
      if (row === 7) button.insertAdjacentHTML('beforeend', `<span class="coordinate file" aria-hidden="true">${files[file]}</span>`);
      button.addEventListener('click', () => { setActive(button); select(square); });
      button.addEventListener('focus', () => setActive(button));
      board.append(button);
    }
  }
  const players = document.querySelectorAll('.player');
  const [top, bottom] = flipped ? ['White', 'Black'] : ['Black', 'White'];
  for (const [index, color] of [top, bottom].entries()) {
    players[index].innerHTML = `<span class="player-icon ${color.toLowerCase()}" aria-hidden="true">♟</span><span>${color} pieces<small>${color === 'White' ? 'White to move' : 'Starting position'}</small></span><span class="piece-count">16 pieces</span>`;
  }
}

function setActive(button) {
  active = button.dataset.square;
  for (const square of board.children) square.tabIndex = square === button ? 0 : -1;
}

board.addEventListener('keydown', (event) => {
  const delta = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[event.key];
  if (!delta || !event.target.matches('.square')) return;
  event.preventDefault();
  const index = Array.from(board.children).indexOf(event.target);
  const col = Math.max(0, Math.min(7, index % 8 + delta[0]));
  const row = Math.max(0, Math.min(7, Math.floor(index / 8) + delta[1]));
  board.children[row * 8 + col].focus();
});
document.querySelector('#flip').addEventListener('click', () => { flipped = !flipped; render(); });
document.querySelector('#reset').addEventListener('click', () => { flipped = false; active = 'a8'; select(null); render(); });
render();
