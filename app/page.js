'use client';
import Button from "react-bootstrap/Button";
import { useState } from "react";
import MatchIDModal from "./components/matchIDModal";

export default function HomePage() {
  const [modalShow, setModalShow] = useState(false);

  return (<>
    <div>
      <Button
        variant="outline-info"
        href="/local"
      >
        Play Local Match
      </Button>
      <Button
        variant="outline-info"
        onClick={() => setModalShow(true)}
      >
        Player vs Player
      </Button>
      <MatchIDModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
      </MatchIDModal>
  </div>
  </>)
}


