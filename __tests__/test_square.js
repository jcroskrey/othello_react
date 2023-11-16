import '@testing-library/jest-dom';
import '@testing-library/user-event';
import { Square } from "@/app/components/square";
import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';

test("Tests null square renders empty", () => {
    render(
        <table>
            <tbody>
                <tr>
                    <Square value={null} testID={'0_0'}/>
                </tr>
            </tbody>
        </table>
    );
    const square = screen.getByTestId('0_0');
    expect(square.firstChild).not.toHaveClass('white');
    expect(square.firstChild).not.toHaveClass('black');
});

test("Test Square with value===white has classname===white", () => {
    render(
        <table>
            <tbody>
                <tr>
                    <Square value={'white'} testID={'0_0'}/>
                </tr>
            </tbody>
        </table>
    );
    const square = screen.getByTestId('0_0');
    expect(square.firstChild).toHaveClass('white');
    expect(square.firstChild).not.toHaveClass('black');
});

test("Square click handler called", async () => {
    const user = userEvent.setup();
    const mockHandleClick = jest.fn();
    render(
        <table>
            <tbody>
                <tr>
                    <Square 
                      value={null} 
                      testID='0_0'
                      onSquareClick={mockHandleClick}
                    />
                </tr>
            </tbody>
        </table>
    );
    await user.click(screen.getByTestId('0_0'));
    expect(mockHandleClick).toHaveBeenCalled();
});

test("Square hovered has shadow tile classname", async () => {
    const user = userEvent.setup();
    render(
        <table>
            <tbody>
                <tr>
                    <Square 
                    value={null}
                    onSquareClick={null}
                    whiteIsNext={true}
                    testID='0_0'
                    />
                </tr>
            </tbody>
        </table>
    );
    const square = screen.getByTestId('0_0');
    await user.hover(square);
    // TODO: NOT DONE
});