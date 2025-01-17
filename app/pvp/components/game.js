"use client";
import { Board } from "./board";
import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScoreCard from "./scoreCard";
import ControlsCard from "./controlsCard";
import { LastMessageContext } from "../page";


export default function Game({ handleSendMessage, team, currentMove, currentGrid}) {

  let currentBlackScore = 2;
  let currentWhiteScore = 2;
  let whiteIsNext = true;
  let validMoveAvailable = true;
  let winner = null;

  function handlePlay(row, col) {
    if (team !== (currentMove % 2)) {
      handleSendMessage({
        type: 'play',
        player: team,
        row: row,
        col: col
      });
    }
  }

  return (
    <Container>
      <Row>
        <Col className="scores-col">
          <Row>
            <Col className="score-col-pvp">
              <ScoreCard
                teamColor={"Black"}
                team={team}
                score={currentBlackScore}
                whiteIsNext={whiteIsNext}
                validMoveAvailable={validMoveAvailable}
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
            sendMessage={handlePlay}
            testId={'game_board'}
          />
        </Col>
        <Col className="scores-col">
          <Row>
            <Col className="score-col-pvp">
              <ScoreCard
                teamColor={"White"}
                team={team}
                score={currentWhiteScore}
                whiteIsNext={whiteIsNext}
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