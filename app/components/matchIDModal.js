import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

export default function MatchIDModal(props) {

    function handleSubmit() {
      let matchId = document.getElementById('matchIDInput').value 
      // TODO: validate matchId
      window.location.pathname = '/match/' + matchId + '/';
      
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
            />
        </Modal.Body>
        
        <Modal.Footer className="text-center">
            <Button 
                variant="outline-info" 
                type="submit"
                onClick={() => handleSubmit()}
            >
                Join Match
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }