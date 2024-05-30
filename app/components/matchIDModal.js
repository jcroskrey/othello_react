import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { useRouter } from 'next/navigation';
import { useRef } from "react";

export default function MatchIDModal(props) {
    const matchId = useRef("");
    const router = useRouter();

    function handleChange(event) {
      matchId.current = event.target.value;
      console.log(matchId.current);
    }
  
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
            <Modal.Title>
                Type in a Match ID 
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form.Control
                type="text"
                id="matchIDInput"
                placeholder="Match ID"
                onChange={(e) => handleChange(e)}
            />
        </Modal.Body>
        
        <Modal.Footer className="text-center">
              <Button 
                  variant="outline-info" 
                  type="submit"
                  onClick={() => router.push('/pvp?id=' + matchId.current)} 
              >
                Join Match
              </Button>
        </Modal.Footer>
      </Modal>
    );
  }