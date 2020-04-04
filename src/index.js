import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Chess extends React.Component {
  render(){
    return(
      <div className={"chess "+this.props.color}></div>
    );
  }
}


class Square extends React.Component {
  render(){
    if (this.props.index === 32 || this.props.index === 40 || this.props.index === 96 || this.props.index === 152 || this.props.index === 160){
      return(
        <button className="square">
          <div className="mark"></div>
        </button>
      );
    }
    return(
      <button className="square">
      </button>
    );
  }
}

function Location(props){
  const haveChess = props.value;
  if (haveChess==="black" || haveChess==="white"){
    return(
      <button className="location">
        <Chess color={haveChess}/>
      </button>
    );
  }
  return(<button className="location" onClick = {props.onClick}></button>);
}

class Board extends React.Component {
  renderLocation(i) {
    return (
      <Location
        value = {this.props.locations[i]}
        index = {i}
        size = {this.props.size}
        onClick={()=> this.props.onClick(i)}
        />
      );
  }

  renderSquare(i){
    return (
      <Square
        index ={i}
      />
    );
  }

  render() {
    const rowSize = this.props.size;
    const functional_rows = [];
    const display_rows = [];
    for (let y = 0; y < rowSize; y++){
      let functional_row = [];
      for (let x = 0; x < rowSize; x++){
        functional_row.push(this.renderLocation(x + y*rowSize));
      }
      functional_rows.push(functional_row);
    }

    for (let y = 0; y < rowSize-1; y++){
      let display_row = [];
      for (let x = 0; x < rowSize-1; x++){
        display_row.push(this.renderSquare(x + y*rowSize));
      }
      display_rows.push(display_row);
    }
    return (
      <div>
        <div className="functional-board">
          {functional_rows.map(r => (
            <div className="board-row">{r}</div>
          ))}
        </div>
        <div className="display-board">
            {display_rows.map(r => (
              <div className="board-row">{r}</div>
            ))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      size: this.props.size,
      history: [
        {
          locations: Array(this.props.size*this.props.size).fill(null),
        },
      ],
      stepNumber:0,
      blackIsNext: true,
    }
  }
  clicked(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current =history[this.state.stepNumber];
        const locations = current.locations.slice();
        if (calculateWinner(locations) || locations[i]){
          return; 
        }
        locations[i] = this.state.blackIsNext?"black":"white";
        this.setState({
          history: history.concat([{
            locations: locations,
          }]),
          stepNumber: history.length,
          blackIsNext: !this.state.blackIsNext,
          playerIsNext: !this.state.playerIsNext,
        });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      blackIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current =history[this.state.stepNumber];
    const winner = calculateWinner(current.locations);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner){
      status = "Game End, " + winner + " win!";
    }else{
      status = (this.state.blackIsNext? 'Black':'White') + " Move.";
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            locations={current.locations}
            size = {this.state.size}
            onClick = {(i)=>this.clicked(i)}
          />
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
  <Game size={15}/>,
  document.getElementById('root')
);

function calculateWinner(locations) {
  for (let y=0; y<15; y++){ // Check horizontal
    for (let x=4; x<15; x++){
      if (locations[y*15+x-4] && locations[y*15+x-4]===locations[y*15+x-3] && locations[y*15+x-3]===locations[y*15+x-2] && locations[y*15+x-2]===locations[y*15+x-1] && locations[y*15+x-1]===locations[y*15+x]){
        return (locations[y*15+x-4]);
      }
    }
  }
  for (let x=0; x<15; x++){ // Check horizontal
    for (let y=4; y<15; y++){
      if (locations[(y-4)*15+x] && locations[(y-4)*15+x]===locations[(y-3)*15+x] && locations[(y-3)*15+x]===locations[(y-2)*15+x] && locations[(y-2)*15+x]===locations[(y-1)*15+x] && locations[(y-1)*15+x]===locations[y*15+x]){
        return (locations[(y-4)*15+x]);
      }
    }
  }

  for (let y=4; y<15; y++){
    for (let x=4; x<15; x++){
      if (locations[(y-4)*15+x-4] && locations[(y-4)*15+x-4]===locations[(y-3)*15+x-3] && locations[(y-3)*15+x-3]===locations[(y-2)*15+x-2] && locations[(y-2)*15+x-2]===locations[(y-1)*15+x-1] && locations[(y-1)*15+x-1]===locations[y*15+x]){
        return (locations[(y-4)*15+x-4]);
      }
      if (locations[(y-4)*15+x] && locations[(y-4)*15+x]===locations[(y-3)*15+x-1] && locations[(y-3)*15+x-1]===locations[(y-2)*15+x-2] && locations[(y-2)*15+x-2]===locations[(y-1)*15+x-3] && locations[(y-1)*15+x-3]===locations[y*15+x-4]){
        return (locations[(y-4)*15+x]);
      }
    }
  }
  return null;
}