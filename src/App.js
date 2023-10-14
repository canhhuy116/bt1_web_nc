import React, { useState } from 'react';
import './App.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}

function Square(props) {
  return (
    <button className={`square ${props.highlight ? 'highlight' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const board = [];
  for (let row = 0; row < 3; row++) {
    const squares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      squares.push(
        <Square
          key={squareIndex}
          value={props.squares[squareIndex]}
          onClick={() => props.onClick(squareIndex)}
          highlight={props.winningLine && props.winningLine.includes(squareIndex)}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {squares}
      </div>
    );
  }

  return <div>{board}</div>;
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([{ squares: squares }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const getLocation = (move) => {
    if (move === 0) {
      return ''; // No location for the initial move
    }
    const lastMove = history[move - 1].squares;
    const currentMove = history[move].squares;

    for (let i = 0; i < 9; i++) {
      if (lastMove[i] !== currentMove[i]) {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return `(${row}, ${col})`;
      }
    }
    return ''; // Default case
  };

  const current = history[stepNumber];
  const { winner, line } = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    const location = getLocation(move);
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className={move === stepNumber ? 'current-move' : ''}>
          {desc} {location}
        </button>
      </li>
    );
  });

  if (!sortAscending) {
    moves.reverse();
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (stepNumber === 9) {
    status = 'Draw! No one wins.';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} winningLine={line} />
      </div>
      <div className="game-info">
        <div>{`You are at move #${stepNumber}`}</div>
        <div>{status}</div>
        <button onClick={toggleSort}>Toggle Sort {sortAscending ? 'Ascending' : 'Descending'}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Game />
    </div>
  );
}

export default App;
