'use client';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import MatchIDModal from "./components/matchIDModal";

export default function HomePage() {
  const [modalShow, setModalShow] = useState(false);

  return (<>
    <Container>
      <Row>
        <Col className="home-selection-col">
          <Button
            variant="outline-info"
            href="/local"
            className="mode-selection-button"
          >Play Local Match
          </Button>
          <Button
            variant="outline-info"
            onClick={() => setModalShow(true)}
            className="mode-selection-button"
          >Player vs Player
          </Button>
          <MatchIDModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
          </MatchIDModal>
        </Col>

      </Row>
      
  </Container>
  </>)
}


