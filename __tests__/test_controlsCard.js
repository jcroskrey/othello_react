import '@testing-library/jest-dom';
import '@testing-library/user-event';
import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';
import ControlsCard from '@/app/local/components/controlsCard';


test("Test undo and reset buttons disabled if first move", () => {
    render(
        <ControlsCard
          currentMove={0}
          goToMove={null}
          winner={null}
          testId={'controls_card'}
        />
    );
    expect(screen.getByText('Reset')).toBeDisabled();
    expect(screen.getByText('Undo')).toBeDisabled();
});

test("Test undo and reset buttons enabled if not first move", () => {
    render(
        <ControlsCard
          currentMove={1}
          goToMove={null}
          winner={null}
          testId={'controls_card'}
        />
    );
    expect(screen.getByText('Reset')).not.toBeDisabled();
    expect(screen.getByText('Undo')).not.toBeDisabled();
});

test("Test undo disabled if winner not null", () => {
    render(
        <ControlsCard
          currentMove={1}
          goToMove={null}
          winner={'white'}
          testId={'controls_card'}
        />
    );
    expect(screen.getByText('Undo')).toBeDisabled();
    expect(screen.getByText('Reset')).not.toBeDisabled();
});

test("Test goToMove passed correct turn if undo pressed", async () => {
    const mockGoToMove = jest.fn();
    const user = userEvent.setup();
    render(
        <ControlsCard
          currentMove={5}
          goToMove={mockGoToMove}
          winner={null}
          testId={'controls_card'}
        />
    );
    await user.click(screen.getByText('Undo'));
    expect(mockGoToMove).toHaveBeenCalledWith(4);
});

test("Test goToMove passed 0 if reset pressed", async () => {
    const mockGoToMove = jest.fn();
    const user = userEvent.setup();
    render(
        <ControlsCard
          currentMove={5}
          goToMove={mockGoToMove}
          winner={null}
          testId={'controls_card'}
        />
    );
    await user.click(screen.getByText('Reset'));
    expect(mockGoToMove).toHaveBeenCalledWith(0);
});