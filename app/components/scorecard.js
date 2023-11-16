import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


export default function ScoreCard({team, score, whiteIsNext, validMoveAvailable, forfeitTurn, winner}) {

    let styling = 'text-center ' + team.toLowerCase() + '-scorecard';

    // Set the card outline based on turn
    let turnOutline = '';
    if ((whiteIsNext && team.toLowerCase() === 'white') || 
        (!whiteIsNext && team.toLowerCase() === 'black')) {
        turnOutline = 'info';
    }
    // Set the card details based on valid moves
    let buttonInvisible = 'invisible';
    let bodyText = 'Patiently await your turn, pupil.';
    if ((!validMoveAvailable && team.toLowerCase() === 'white' && whiteIsNext && winner === null) ||
        (!validMoveAvailable && team.toLowerCase() === 'black' && !whiteIsNext && winner === null)) {
        // if it's your turn, and you have no valid moves available then the option 
        // to forfeight is enabled.
        buttonInvisible = '';
        bodyText = 'No valid moves found!';
    }
    else if ((validMoveAvailable && team.toLowerCase() === 'white' && whiteIsNext) ||
             (validMoveAvailable && team.toLowerCase() === 'black' && !whiteIsNext))  {
        // if it's your turn, and you have a play available display this text
        bodyText = 'Inch closer to victory with each expertly placed move, pupil.'
    }

    let teamNameText = team;
    if ((team.toLowerCase() === 'white' && winner === 'white') ||
        (team.toLowerCase() === 'black' && winner === 'black')) {
            // set the winners formatting
            teamNameText = '👑 ' + team + ' 👑';
            bodyText = 'Crowned in victory and lathered in sweet glory!';
            buttonInvisible = 'invisible';
            turnOutline = 'warning';
        }
    else if ((team.toLowerCase() === 'white' && winner === 'black') ||
        (team.toLowerCase() === 'black' && winner === 'white')) {
        // set the losers formatting
        bodyText = "Mission failed, we'll get 'em next time.";
        buttonInvisible = 'invisible';
        turnOutline = 'danger';
    }
    else if (winner === 'tie') {
        bodyText = 'Tie! Another round so glory can finally be awarded?';
        buttonInvisible = 'invisible';
        turnOutline = 'info';
    }
    
    return (
        <Card border={turnOutline} className={styling}>
            <Card.Header className="text-center">
                <h4>{teamNameText}</h4>
            </Card.Header>
            <Card.Body>
                <h1>{score}</h1>
                <span className="text-secondary">{bodyText}</span>
            </Card.Body>
            <Card.Footer className="text-center">
                <Button variant='outline-info' className={buttonInvisible} onClick={() => forfeitTurn()}>Forfeit Turn</Button>
            </Card.Footer>
        </Card>
    );
}