import '@testing-library/jest-dom';
import '@testing-library/user-event';
import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';
import Game from '@/app/components/game';

const generateEmptyGrid = (n) => {
    return Array(n).fill().map(() => Array(n).fill(null));
}

test("Test forfeit turn is invisible if there is a valid move", async () => {
    const user = userEvent.setup();
    const initialGrid = generateEmptyGrid(8);
    initialGrid[3][3] = 0;   // 0 is white
    initialGrid[3][4] = 1;   // 1 is black
    initialGrid[4][3] = 1;
    initialGrid[4][4] = 0;

    render(
        <Game 
            optionalInitialGrid={initialGrid}
            optionalStartingMove={0}
        />
    );
    await user.click(screen.getByTestId('4_5'))
    expect(screen.getByTestId('white_scorecard').children[2].firstChild).toHaveClass('invisible');
});

test("Test forfeit turn is visible if there is NO valid move", async () => {
    const user = userEvent.setup();
    const initialGrid = generateEmptyGrid(8);
    initialGrid[3][3] = 1;   // 0 is white
    initialGrid[3][4] = 1;   // 1 is black
    initialGrid[4][3] = 1;
    initialGrid[4][4] = 0;
    render(
        <Game 
            optionalInitialGrid={initialGrid}
            optionalStartingMove={0}
        />
    );
    // need to click because initial state for validMoveAvailable is true. 
    await user.click(screen.getByTestId('4_5'))
    expect(screen.getByTestId('white_scorecard').children[2].firstChild).not.toHaveClass('invisible');
});

test("Test forfeit turn button works", async () => {
    const user = userEvent.setup();
    const initialGrid = generateEmptyGrid(8);
    initialGrid[3][3] = 1;   // 0 is white
    initialGrid[3][4] = 1;   // 1 is black
    initialGrid[4][3] = 1;
    initialGrid[4][4] = 0;
    render(
        <Game 
            optionalInitialGrid={initialGrid}
            optionalStartingMove={0}
        />
    );
    // need to click because initial state for validMoveAvailable is true.
    await user.click(screen.getByTestId('4_5'));
    // now we click "Forfeit Turn"
    await user.click(screen.getByTestId('white_forfeit_button'));
    expect(screen.getByTestId('white_forfeit_button')).toHaveClass('invisible');
    expect(screen.getByTestId('black_scorecard')).toHaveClass('border-info');
});

test("Test Undo button goes to previous turn", async () => {
    const user = userEvent.setup();
    const initialGrid = generateEmptyGrid(8);
    initialGrid[3][3] = 0;   // 0 is white
    initialGrid[3][4] = 1;   // 1 is black
    initialGrid[4][3] = 1;
    initialGrid[4][4] = 0;
    render(
        <Game 
            optionalInitialGrid={initialGrid}
            optionalStartingMove={0}
        />
    );
    await user.click(screen.getByTestId('4_5'));
    await user.click(screen.getByTestId('3_5'));
    await user.click(screen.getByText('Undo'));
    expect(screen.getByTestId('3_5')).not.toHaveClass('white');
    expect(screen.getByTestId('white_scorecard')).toHaveClass('border-info');
    expect(screen.getByTestId('white_scorecard').children[1].firstChild.firstChild.textContent).toEqual("1");
    expect(screen.getByTestId('black_scorecard').children[1].firstChild.firstChild.textContent).toEqual("4");
});

test("Test Reset button resets the game", async () => {
    const user = userEvent.setup();
    const initialGrid = generateEmptyGrid(8);
    initialGrid[3][3] = 0;   // 0 is white
    initialGrid[3][4] = 1;   // 1 is black
    initialGrid[4][3] = 1;
    initialGrid[4][4] = 0;
    render(
        <Game 
            optionalInitialGrid={initialGrid}
            optionalStartingMove={0}
        />
    );
    await user.click(screen.getByTestId('4_5'));
    await user.click(screen.getByTestId('3_5'));
    await user.click(screen.getByText('Reset'));
    expect(screen.getByTestId('3_5')).not.toHaveClass('white');
    expect(screen.getByTestId('4_5')).not.toHaveClass('black');
    expect(screen.getByTestId('black_scorecard')).toHaveClass('border-info');
    expect(screen.getByTestId('white_scorecard').children[1].firstChild.firstChild.textContent).toEqual("2");
    expect(screen.getByTestId('black_scorecard').children[1].firstChild.firstChild.textContent).toEqual("2");
});