import { useState } from "react";

export const Square = ({value, onSquareClick, whiteIsNext, testId}) => {
    const [hoverValue, setHoverValue] = useState('');

    function handleMouseEnter() {
      if (value !== '') {
        // only apply hover effect to empty cells
        return;
      }
      else {
        if (whiteIsNext) {
          setHoverValue('white-hover');
        }
        else {
          setHoverValue('black-hover');
        }
      }
    }

    function handleMouseLeave() {
      if (value !== '') {
        return;
      }
      else {
        setHoverValue('');
      }
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