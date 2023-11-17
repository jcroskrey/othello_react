import '@testing-library/jest-dom';
import '@testing-library/user-event';
import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';
import { Board } from '@/app/components/board';
import { experimental } from '@/next.config';


const generateEmptyGrid = (n) => {
    return Array(n).fill().map(() => Array(n).fill(null));
}

test("Test nxn grid renders with n rows and n cells", () => {
    render(
        <Board 
          currentGrid={generateEmptyGrid(2)}
          whiteIsNext={true}
          onPlay={null}
          testId={'game_board'}
        /> 
    );
    const board = screen.getByTestId('game_board');
    expect(screen.getByTestId('0_0')).toBeInTheDocument();
    // number of <tr> (row) elements in the board component
    expect(board.firstChild.firstChild.childNodes).toHaveLength(2);
    // number of <td> (cell) elements in a row of the board component
    expect(board.firstChild.firstChild.firstChild.childNodes).toHaveLength(2);
});

test("Test click empty square with no valid flips does nothing", async () => {
    const user = userEvent.setup();
    const mockHandlePlay = jest.fn();
    render(
        <Board
          currentGrid={generateEmptyGrid(2)}
          whiteIsNext={true}
          onPlay={mockHandlePlay}
          testId={'game_board'}
        /> 
    );
    const targetSquare = screen.getByTestId('0_0');
    await user.click(targetSquare);
    expect(mockHandlePlay).not.toHaveBeenCalled();
    expect(targetSquare.firstChild).not.toHaveClass('white');
});

test("Test clicking filled square does nothing", async () => {
    const user = userEvent.setup();
    const grid = generateEmptyGrid(2);
    grid[0][0] = 1; // black
    render(
        <Board
          currentGrid={grid}
          whiteIsNext={true}
          onPlay={null}
          testId={'game_board'}
        /> 
    );
    const targetSquare = screen.getByTestId('0_0');
    await user.click(targetSquare);
    expect(targetSquare.firstChild).toHaveClass('black');
    expect(targetSquare.firstChild).not.toHaveClass('white');
});

test("Test valid white move makes flips in all directions", async () => {
    const user = userEvent.setup();
    const startingGrid = [
        [0, null, 0, null, 0],
        [null, 1, 1, 1, null],
        [0, 1, null, 1, 0],
        [null, 1, 1, 1, null],
        [0, null, 0, null, 0]
    ]
    const mockOnPlay = jest.fn();
    render(
        <Board
          currentGrid={startingGrid}
          whiteIsNext={true}
          onPlay={mockOnPlay}
          testId={'game_board'}
        />
    );
    const targetSquare = screen.getByTestId('2_2');
    await user.click(targetSquare);
    // check that each black tile has been flipped to white
    const expectedNextGrid = [
        [0, null, 0, null, 0],
        [null, 0, 0, 0, null],
        [0, 0, 0, 0, 0],
        [null, 0, 0, 0, null],
        [0, null, 0, null, 0]
    ]
    const expectedToWhite = 8;
    const expectedToBlack = -8;
    expect(mockOnPlay).toHaveBeenCalledWith(expectedNextGrid, expectedToWhite, expectedToBlack);
});

test("Test black move only flips in only valid directions", async () => {
    const user = userEvent.setup();
    const startingGrid = [
        [1, null, null, null, null],
        [null, 0, 0, 0, null], 
        [1, 0, null, 0, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]
    const mockOnPlay = jest.fn();
    render(
        <Board
          currentGrid={startingGrid}
          whiteIsNext={false}
          onPlay={mockOnPlay}
          testId={'game_board'}
        />
    );
    await user.click(screen.getByTestId("2_2"));
    const expectedNextGrid = [
        [1, null, null, null, null],
        [null, 1, 0, 0, null],
        [1, 1, 1, 0, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]
    const expectedToWhite = -2;
    const expectedToBlack = 2;
    expect(mockOnPlay).toHaveBeenCalledWith(expectedNextGrid, expectedToWhite, expectedToBlack);
});

