import '@testing-library/jest-dom';
import '@testing-library/user-event';
import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';
import ScoreCard from '@/app/components/scorecard';


test("Test scorecard shows correct text on turn and forfeit button invisible", () => {
    render(
        <ScoreCard
            team={'White'}
            score={2}
            whiteIsNext={true}
            validMoveAvailable={true}
            forfeitTurn={null}
            winner={null}
            testId={'white_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('white_scorecard');
    expect(scorecard.children[1].children[1].textContent).toBe('Make a brilliant move, pupil!');
    expect(scorecard.children[2].firstChild).toHaveClass('invisible');
    expect(scorecard).toHaveClass('border-info');
});

test("Test when not players turn show correct text", () => {
    render(
        <ScoreCard
            team={'Black'}
            score={2}
            whiteIsNext={true}
            validMoveAvailable={true}
            forfeitTurn={null}
            winner={null}
            testId={'black_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('black_scorecard');
    expect(scorecard.children[1].children[1].textContent).toBe('Patiently await your turn, pupil.');
    expect(scorecard.children[2].firstChild).toHaveClass('invisible');
    expect(scorecard).not.toHaveClass('border-info');
})

test("Test scorecard shows forfeit turn when no valid move", async () => {
    const mockForfeitTurn = jest.fn();
    const user = userEvent.setup();
    render(
        <ScoreCard
            team={'White'}
            score={2}
            whiteIsNext={true}
            validMoveAvailable={false}
            forfeitTurn={mockForfeitTurn}
            winner={null}
            testId={'white_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('white_scorecard');
    const forfeitButton = scorecard.children[2].firstChild
    expect(forfeitButton).not.toHaveClass('invisible');
    expect(scorecard.children[1].children[1].textContent).toBe('No valid moves found!');
    await user.click(forfeitButton);
    expect(mockForfeitTurn).toHaveBeenCalled();
});

test("Test winner awarded highest praises", () => {
    render(
        <ScoreCard
            team={'Black'}
            score={64}
            whiteIsNext={true}
            validMoveAvailable={true}
            forfeitTurn={null}
            winner={'black'}
            testId={'black_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('black_scorecard');
    expect(scorecard.firstChild.firstChild.textContent).toBe('👑 Black 👑');
    expect(scorecard.children[1].children[1].textContent)
            .toBe('Crowned in victory and lathered in sweet glory!');
    expect(scorecard).toHaveClass('border-warning'); // glorious golden outline
    expect(scorecard.children[2].firstChild).toHaveClass('invisible');
});

test("Test loser is bestowed maximum shame", () => {
    render(
        <ScoreCard
            team={'White'}
            score={0}
            whiteIsNext={true}
            validMoveAvailable={true}
            forfeitTurn={null}
            winner={'black'}
            testId={'white_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('white_scorecard');
    expect(scorecard.children[1].children[1].textContent).toBe("Mission failed, we'll get 'em next time.")
    expect(scorecard).toHaveClass('border-danger'); // red outline
});

test("Test tie shows properly", () => {
    render(
        <ScoreCard
            team={'White'}
            score={32}
            whiteIsNext={true}
            validMoveAvailable={true}
            forfeitTurn={null}
            winner={'tie'}
            testId={'white_scorecard'}
        />
    );
    const scorecard = screen.getByTestId('white_scorecard');
    expect(scorecard.children[1].children[1].textContent).toBe('Tie! Another round so glory can be awarded?');
    expect(scorecard.children[2].firstChild).toHaveClass('invisible');
    expect(scorecard).toHaveClass('border-info');
});