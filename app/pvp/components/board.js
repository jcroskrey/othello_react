import { Square } from './square';

export const Board = ({currentGrid, team, sendMessage, testId}) => {
  function handleClick(row, col) {
      sendMessage(row, col);
  }

  return (
    <div className={"board"} data-testid={testId}>
      <table>
        <tbody>
          {currentGrid.map((row, i) => { return (
            <tr key={"row_" + i}>
            {
              row.map((col, j) => {
                const color_ = currentGrid[i][j] === null ? '': currentGrid[i][j] === 0 ? 'white':'black';
                return (
                  <Square 
                    key={i+"_"+j}
                    value={color_}
                    onSquareClick={() => handleClick(i, j)}
                    team={team}
                    testId={i+"_"+j}
                  />
                )
              })
            }
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
};