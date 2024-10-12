"use client";
import { Board } from "./board";
import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScoreCard from "./scoreCard";
import ControlsCard from "./controlsCard";
import { LastMessageContext } from "../page";

// create the starting grid
let initialGrid = Array(8).fill().map(() => Array(8).fill(null));
initialGrid[3][3] = 0;   // 0 is white
initialGrid[3][4] = 1;   // 1 is black
initialGrid[4][3] = 1;
initialGrid[4][4] = 0;


export default function Game(
  { handleSendMessage,
    team,
    optionalInitialGrid,
    optionalStartingMove }) {

  if (optionalInitialGrid) {
    // optionalInitialGrid is for testing purposes only.
    // This variable allows us to pass a starting grid to the 
    // game component and test the component from any defined 
    // board (grid) configuration. 
    initialGrid = optionalInitialGrid;
  }
  let startingMove = 0;
  if (optionalStartingMove) {
    // This is for testing purposes only
    startingMove = optionalStartingMove;
  }
  // fill grid with null values (blank spaces)
  const lastMessage = useContext(LastMessageContext);
  useEffect( () => {
    // when we receive a message from the opponent, update the game
    if (lastMessage !== null && lastMessage.hasOwnProperty('grid')) {
      const gridArray = JSON.parse(lastMessage.grid);
      const toWhite = JSON.parse(lastMessage.toWhite);
      const toBlack = JSON.parse(lastMessage.toBlack);
      console.log("Message received, executing handle play");
      handlePlay(gridArray, toWhite, toBlack, true);
    }
  }, [lastMessage]);

  const [history, setHistory] = React.useState([initialGrid]);  // save a history of each grid
  const [currentMove, setCurrentMove] = React.useState(startingMove);
  const [whiteScores, setWhiteScores] = React.useState([2]);
  const [blackScores, setBlackScores] = React.useState([2]);
  const [validMoveAvailable, setValidMoveAvailable] = React.useState(true);
  const [winner, setWinner] = React.useState(null);

  const whiteIsNext = currentMove % 2 === 1; // black starts first
  const currentGrid = history[history.length - 1];
  const currentWhiteScore = whiteScores[currentMove];
  const currentBlackScore = blackScores[currentMove];
  

  // Update state when play is made
  function handlePlay(nextSquares, toWhite, toBlack, receivedPlay) {
    if (!receivedPlay) {
      handleSendMessage(JSON.stringify(nextSquares), toWhite, toBlack);
    }
    const nextHistory = [...history.map(g => g.slice().map(r => r.slice())), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
    setWhiteScores([...whiteScores.slice(0, currentMove + 1),
    whiteScores[currentMove] + toWhite + whiteIsNext]);
    setBlackScores([...blackScores.slice(0, currentMove + 1),
    blackScores[currentMove] + toBlack + !whiteIsNext]);
    let validMoveAvailable = checkValidMovePossible(nextSquares, whiteIsNext);
    setValidMoveAvailable(validMoveAvailable);
    setWinner(checkWinner(whiteScores[currentMove] + toWhite + whiteIsNext,
      blackScores[currentMove] + toBlack + !whiteIsNext));
  }

  function forfeitTurn() {
    const nextGrid = currentGrid.map(r => r.slice())
    const nextHistory = [...history.map(g => g.slice().map(r => r.slice())), nextGrid];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
    setWhiteScores([...whiteScores, currentWhiteScore]);
    setBlackScores([...blackScores, currentBlackScore]);

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
    setWhiteScores([...whiteScores.slice(0, currentMove + 1)]);
    setBlackScores([...blackScores.slice(0, currentMove + 1)]);

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
            <Col className="score-col-pvp">
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

        </Col>
        <Col className="board-col" md={4} lg={3} xl={2} >
          <Board
            key={currentMove}
            currentGrid={currentGrid.slice().map(r => r.slice())}
            team={team}
            whiteIsNext={whiteIsNext}
            onPlay={handlePlay}
            testId={'game_board'}
          />
        </Col>
        <Col className="scores-col">
          <Row>
            <Col className="score-col-pvp">
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
    </Row>

    </Container>
  );
}

function checkWinner(whiteScore, blackScore) {
  if ((whiteScore + blackScore === 64) ||
    (whiteScore === 0) || (blackScore === 0)) {
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


