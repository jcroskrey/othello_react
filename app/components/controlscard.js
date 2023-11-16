import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";


export default function ControlsCard({currentMove, goToMove, winner}) {

    let undoDisabled = 'enabled';
    if (winner != null || currentMove === 0) {
        undoDisabled = 'disabled';
    }

    let resetDisabled = 'enabled';
    if (currentMove === 0) {
        resetDisabled = 'disabled';
    }

    function handleClick(resetOrUndo) {
        if (resetOrUndo === 'reset') {
            goToMove(0);
        }
        else {
            goToMove(currentMove - 1);
        }
    }

    return (
        <Card className="controls-card" key='controlscard'>
            <Card.Header className="text-center">
                <h4>Salutations Pupils!</h4>
            </Card.Header>
            <Card.Body>
                <span className='text-center'>
                    <p>Basic Rules</p>
                </span>
                <span className='text-secondary'>
                    <p>1. Place tiles on the board flanking your opponents tiles and causing them to flip.</p>
                    <p>2. Flanking your opponent happens when a row is bordered by discs of your color.</p>
                    <p>3. If you cannot outflank any of your opponents discs on your turn, you must forfeit your turn.</p>
                    <p>4. Have the most tiles in your color to win!</p>
                    <p>Note: flipped tiles do not also trigger a flank. Only tiles flanked by your play are flipped.</p>
                </span>
                
                
            </Card.Body>
            <Card.Footer className="text-center">
                <Row>
                    <Col>
                        <div className="d-grid">
                           <Button 
                           className={undoDisabled}
                           variant="outline-info"
                           onClick={() => handleClick('undo')}
                           >
                                Undo
                            </Button> 
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid">
                            <Button 
                            className={resetDisabled}
                            variant="outline-info"
                            onClick={() => handleClick('reset')}
                            >
                                Reset
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}