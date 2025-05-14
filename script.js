const board = document.getElementById('chessboard');
const status = document.getElementById('status');
let selected = null;
let turn = 'white';

const files = ['a','b','c','d','e','f','g','h'];

const initialPosition = {
  a1: '♖', b1: '♘', c1: '♗', d1: '♕', e1: '♔', f1: '♗', g1: '♘', h1: '♖',
  a2: '♙', b2: '♙', c2: '♙', d2: '♙', e2: '♙', f2: '♙', g2: '♙', h2: '♙',
  a7: '♟', b7: '♟', c7: '♟', d7: '♟', e7: '♟', f7: '♟', g7: '♟', h7: '♟',
  a8: '♜', b8: '♞', c8: '♝', d8: '♛', e8: '♚', f8: '♝', g8: '♞', h8: '♜'
};

function createBoard() {
  board.innerHTML = '';
  for (let r = 8; r >= 1; r--) {
    for (let f = 0; f < 8; f++) {
      const square = document.createElement('div');
      const coord = files[f] + r;
      square.id = coord;
      square.classList.add('square');
      square.classList.add((r + f) % 2 === 0 ? 'white' : 'black');
      square.innerHTML = initialPosition[coord] || '';
      square.addEventListener('click', () => handleClick(square));
      board.appendChild(square);
    }
  }
}

function handleClick(square) {
  if (selected) {
    if (isValidMove(selected, square)) {
      square.innerHTML = selected.innerHTML;
      selected.innerHTML = '';
      turn = turn === 'white' ? 'black' : 'white';
      status.innerText = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn`;
    }
    selected.classList.remove('highlight');
    selected = null;
  } else {
    if (square.innerHTML && isPieceTurn(square.innerHTML)) {
      selected = square;
      square.classList.add('highlight');
    }
  }
}

function isPieceTurn(piece) {
  const isWhite = '♙♖♘♗♕♔'.includes(piece);
  return (turn === 'white' && isWhite) || (turn === 'black' && !isWhite);
}

function isValidMove(fromSquare, toSquare) {
  const piece = fromSquare.innerHTML;
  const from = coordToIndices(fromSquare.id);
  const to = coordToIndices(toSquare.id);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const targetPiece = toSquare.innerHTML;
  if (targetPiece && isPieceTurn(targetPiece)) return false;

  if (piece === '♙') return validatePawnMove(from, to, 1);
  if (piece === '♟') return validatePawnMove(from, to, -1);
  if (piece === '♖' || piece === '♜') return validateRookMove(from, to);
  if (piece === '♗' || piece === '♝') return validateBishopMove(from, to);
  if (piece === '♕' || piece === '♛') return validateQueenMove(from, to);
  if (piece === '♘' || piece === '♞') return validateKnightMove(dx, dy);
  if (piece === '♔' || piece === '♚') return validateKingMove(dx, dy);

  return false;
}

function validatePawnMove(from, to, dir) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const destSquare = document.getElementById(indicesToCoord(to.x, to.y));
  if (dx === 0 && dy === dir && !destSquare.innerHTML) return true;
  if (dx === 0 && dy === 2 * dir && ((dir === 1 && from.y === 1) || (dir === -1 && from.y === 6))) {
    const stepSquare = document.getElementById(indicesToCoord(to.x, from.y + dir));
    if (!destSquare.innerHTML && !stepSquare.innerHTML) return true;
  }
  if (Math.abs(dx) === 1 && dy === dir && destSquare.innerHTML && !isPieceTurn(destSquare.innerHTML)) return true;
  return false;
}

function validateRookMove(from, to) {
  if (from.x !== to.x && from.y !== to.y) return false;
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  return isPathClear(from, to, dx, dy);
}

function validateBishopMove(from, to) {
  if (Math.abs(to.x - from.x) !== Math.abs(to.y - from.y)) return false;
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  return isPathClear(from, to, dx, dy);
}

function validateQueenMove(from, to) {
  return validateRookMove(from, to) || validateBishopMove(from, to);
}

function validateKnightMove(dx, dy) {
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function validateKingMove(dx, dy) {
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

function isPathClear(from, to, dx, dy) {
  let x = from.x + dx, y = from.y + dy;
  while (x !== to.x || y !== to.y) {
    const square = document.getElementById(indicesToCoord(x, y));
    if (square.innerHTML) return false;
    x += dx;
    y += dy;
  }
  return true;
}

function coordToIndices(coord) {
  return { x: files.indexOf(coord[0]), y: parseInt(coord[1]) - 1 };
}

function indicesToCoord(x, y) {
  return files[x] + (y + 1);
}

document.getElementById('resetBtn').addEventListener('click', createBoard);

createBoard();
