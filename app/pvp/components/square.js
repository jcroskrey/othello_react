import { useState } from "react";

export const Square = ({value, onSquareClick, team, testId}) => {
    const hoverColor = team === 1 ? 'white-hover' : 'black-hover'; 
    const [hoverValue, setHoverValue] = useState('');

    function handleMouseEnter() {
      if (value !== '') {
        // only apply hover effect to empty cells
        return;
      }
      setHoverValue(hoverColor);
    }

    function handleMouseLeave() {
      if (value !== '') {
        return;
      }
      setHoverValue('');
    }

    return (
        <td 
          data-testid={testId}
          className={'cell'} 
          onClick={onSquareClick} 
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
          >
            <div className={value + hoverValue}></div>
        </td>
    );
  };