"use client";
import { Board } from "./components/board";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScoreCard from "./components/scorecard";
import ControlsCard from "./components/controlscard";

// create the starting grid
const initialGrid = Array(8).fill().map(() => Array(8).fill(null));
initialGrid[3][3] = 0;   // 0 is white
initialGrid[3][4] = 1;   // 1 is black
initialGrid[4][3] = 1;
initialGrid[4][4] = 0;


export default function Game() {
  // fill grid with null values (blank spaces)
  const [history, setHistory] = useState([initialGrid]);  // save a history of each grid
  const [currentMove, setCurrentMove] = useState(0);
  const [whiteScores, setWhiteScores] = useState([2]);
  const [blackScores, setBlackScores] = useState([2]);
  const [validMoveAvailable, setValidMoveAvailable] = useState(true);
  const [winner, setWinner] = useState(null);

  const whiteIsNext = currentMove % 2 === 1; // black starts first
  const currentGrid = history[history.length - 1];
  const currentWhiteScore = whiteScores[currentMove];
  const currentBlackScore = blackScores[currentMove];

  // Update state when play is made
  function handlePlay(nextSquares, toWhite, toBlack) {
    const nextHistory = [...history.map(g => g.slice().map(r => r.slice())), nextSquares];
    setHistory(nextHistory);
    setWhiteScores([...whiteScores.slice(0, currentMove + 1), whiteScores[currentMove] + toWhite + whiteIsNext]);
    setBlackScores([...blackScores.slice(0, currentMove + 1), blackScores[currentMove] + toBlack + !whiteIsNext]);
    setCurrentMove(currentMove + 1);
    let validMoveAvailable = checkValidMovePossible(nextSquares, whiteIsNext);
    setValidMoveAvailable(validMoveAvailable);
    setWinner(checkWinner(whiteScores[currentMove] + toWhite + whiteIsNext, blackScores[currentMove] + toBlack + !whiteIsNext));
  }
  
  function forfeitTurn() {
    const nextGrid = currentGrid.map(r => r.slice())
    const nextHistory = [...history.map(g => g.slice().map(r => r.slice())), nextGrid];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
    setBlackScores([...blackScores, currentBlackScore]);
    setWhiteScores([...whiteScores, currentWhiteScore]);
    
    let validMoveAvailable = checkValidMovePossible(nextGrid, whiteIsNext);
    setValidMoveAvailable(validMoveAvailable);
    setWinner(checkWinner(currentWhiteScore, currentBlackScore));
  }

  function jumpTo(move) {
    if (move < 0) {
      return;
    }
    setHistory([...history.slice(0, move + 1).map(r => r.slice())]);
    setCurrentMove(move);
    setBlackScores([...blackScores.slice(0, currentMove + 1)]);
    setWhiteScores([...whiteScores.slice(0, currentMove + 1)]);
    if (move === 0) {
      setValidMoveAvailable(true);
      setWinner(null);
    }
    else {
      let validMoveAvailable = checkValidMovePossible(currentGrid, whiteIsNext);
      setValidMoveAvailable(validMoveAvailable);
      setWinner(checkWinner(currentWhiteScore, currentBlackScore));
    }
  }

  return (
    <Container>
      <Row>
        <Col className="scores-col">
          <Row>
            <Col className="black-score-col">
              <ScoreCard 
                team={"Black"} 
                score={currentBlackScore} 
                whiteIsNext={whiteIsNext} 
                validMoveAvailable={validMoveAvailable}
                forfeitTurn={() => forfeitTurn()}
                winner={winner}
                testId={'black_scorecard'}
              />
            </Col>
          </Row>
          
          <Row>
            <Col className="white-score-col">
              <ScoreCard 
                team={"White"} 
                score={currentWhiteScore}
                whiteIsNext={whiteIsNext} 
                validMoveAvailable={validMoveAvailable}
                forfeitTurn={() => forfeitTurn()}
                winner={winner}
                testId={'white_scorecard'}
              />
            </Col>
          </Row>
          
        </Col>
        <Col className="board-col" md={4} lg={3} xl={2} >
          <Board 
          key={currentMove}
          currentGrid={currentGrid.slice().map(r => r.slice())} 
          whiteIsNext={whiteIsNext} 
          onPlay={handlePlay}
          testId={'game_board'}
          />
        </Col>
        <Col className="controls-col">
          <ControlsCard 
          currentMove={currentMove}
          goToMove={jumpTo}
          winner={winner}
          testId={'controls_card'}
          />
        </Col>
      </Row>
      
    </Container>
  );
}

function checkWinner(whiteScore, blackScore) {
  if (whiteScore + blackScore === 64) {
    if (whiteScore > blackScore) {
      return 'white';
    }
    else if (blackScore > whiteScore) {
      return 'black';
    }
    else {
      return 'tie';
    }
  }
  else {
    return null;
  }
}

function checkValidMovePossible(grid, whiteIsNext) {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  let checkVal = whiteIsNext === false ? 1 : 0;
  let currVal = whiteIsNext === true ? 1 : 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // only check empty spaces
      if (grid[row][col] !== null) {
        continue;
      }
      for (let i = 0; i < directions.length; i++) {
        let dir = directions[i];
        let row_check = row + dir[0];
        let col_check = col + dir[1];
        let foundOppositeColor = false;
        // check all valid neighbors for checkVal
        while ((0 <= row_check && row_check < grid.length) &&
          (0 <= col_check && col_check < grid[0].length) &&
          (grid[row_check][col_check] === checkVal)) {
            row_check = row_check + dir[0];
            col_check = col_check + dir[1];
            foundOppositeColor = true;
        }
        if (0 <= row_check && row_check < grid.length &&
          0 <= col_check && col_check < grid[0].length &&
          foundOppositeColor && grid[row_check][col_check] === currVal) {
            // return true, valid move found.
            return true;
          }
        }
      }
    }
  // No valid move found after iterating the entire board;
  return false;
  }


