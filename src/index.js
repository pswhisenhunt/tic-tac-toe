import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, coordinates) {
    return ( 
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, coordinates)}
      />
    );
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, {x: 1, y:1})}
          {this.renderSquare(1, {x: 1, y:2})}
          {this.renderSquare(2, {x:1, y:3})}
        </div>
        <div className="board-row">
          {this.renderSquare(3, {x:2, y:1})}
          {this.renderSquare(4, {x:2, y:2})}
          {this.renderSquare(5, {x:2, y:3})}
        </div>
        <div className="board-row">
          {this.renderSquare(6, {x:3, y:1})}
          {this.renderSquare(7, {x:3, y:2})}
          {this.renderSquare(8, {x:3, y:3})}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coordinates: {x: null, y: null},
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i, coordinates) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coordinates: coordinates
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  calculateWinner(squares) {
    const winningCombinations = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a,b,c] = winningCombinations[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    let current = history[this.state.stepNumber];
    let winner = this.calculateWinner(current.squares);
    let status;
    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    let moves = history.map((step, move) => {
      let btnText = move ? `Go to ${move}` : 'Go to Game Start';
      return (
        <li key={move}>
          <button onClick={() => {this.jumpTo(move)}}>{btnText}</button>
          {step.coordinates.x && step.coordinates.y ?
            <span>({step.coordinates.x}, {step.coordinates.y})</span>
            : <span></span>
          }
        </li>
      );
    });
  
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i, coordinates) => this.handleClick(i, coordinates)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);