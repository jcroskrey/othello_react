import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


export default function ScoreCard({
    teamColor, 
    team, // which team is the player, 0 is black, 1 is white
    score, 
    whiteIsNext, 
    validMoveAvailable, 
    forfeitTurn,
    winner,
    testId
    }) {

    let styling = 'text-center scorecard-pvp';

    // Set the card outline based on turn
    let turnOutline = '';
    if ((whiteIsNext && teamColor.toLowerCase() === 'white') || 
        (!whiteIsNext && teamColor.toLowerCase() === 'black')) {
        turnOutline = 'info';
    }
    // Set the card details based on valid moves
    let whoAmI = team === 0 ? 'black' : 'white';
    let myTurn = team === 0 && !whiteIsNext;
    let bodyText = 'Patiently awaiting a crushing blow...';
    let teamColorNameText = teamColor;
    if (myTurn) {
        bodyText = 'Crush your opponent with your intellect and skill.'
    }
    let buttonInvisible = 'invisible';
    if ((!validMoveAvailable && teamColor.toLowerCase() === 'white' && whiteIsNext && winner === null) ||
        (!validMoveAvailable && teamColor.toLowerCase() === 'black' && !whiteIsNext && winner === null)) {
        // if it's your turn, and you have no valid moves available then the option 
        // to forfeight is enabled.
        buttonInvisible = '';
        bodyText = 'No valid moves found!';
    }
    else if ((validMoveAvailable && team === 1 && whiteIsNext && teamColorNameText.toLowerCase() === whoAmI) ||
             (validMoveAvailable && team === 0 && !whiteIsNext && teamColorNameText.toLowerCase() === whoAmI))  {
        // if it's your turn, and you have a play available display this text
        bodyText = 'Strike a crushing blow to your opponent.'
    }
    else if ((team === 1 && whiteIsNext && teamColorNameText.toLowerCase() !== whoAmI) ||
             (team === 0 && !whiteIsNext && teamColorNameText.toLowerCase() !== whoAmI)) {
        bodyText = 'Contemplating crushing blow...';
    }

    if (teamColorNameText.toLowerCase() === whoAmI) {
        teamColorNameText += ' (you)';
    } else {
        teamColorNameText += ' (opponent)';
    }
    if ((teamColor.toLowerCase() === 'white' && winner === 'white') ||
        (teamColor.toLowerCase() === 'black' && winner === 'black')) {
            // set the winners formatting
            teamColorNameText = '👑 ' + team + ' 👑';
            bodyText = 'Crowned in victory and lathered in sweet glory!';
            buttonInvisible = 'invisible';
            turnOutline = 'warning';
        }
    else if ((teamColor.toLowerCase() === 'white' && winner === 'black') ||
        (teamColor.toLowerCase() === 'black' && winner === 'white')) {
        // set the losers formatting
        bodyText = "Mission failed, we'll get 'em next time.";
        buttonInvisible = 'invisible';
        turnOutline = 'danger';
    }
    else if (winner === 'tie') {
        bodyText = 'Tie! Another round so glory can be awarded?';
        buttonInvisible = 'invisible';
        turnOutline = 'info';
    }
    
    return (
        <Card border={turnOutline} className={styling} data-testid={testId}>
            <Card.Header className="text-center">
                <h4>{teamColorNameText}</h4>
            </Card.Header>
            <Card.Body>
                <h1>{score}</h1>
                <span className="text-secondary">{bodyText}</span>
            </Card.Body>
            <Card.Footer className="text-center">
                <Button 
                variant='outline-info' 
                className={buttonInvisible} 
                onClick={() => forfeitTurn()}
                data-testid={teamColor.toLowerCase() + '_forfeit_button'}
                >Forfeit Turn</Button>
            </Card.Footer>
        </Card>
    );
}