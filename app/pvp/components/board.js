import { Square } from './square';

export const Board = ({currentGrid, team, whiteIsNext, onPlay, testId}) => {
  function handleClick(row, col) {
    console.log(team, whiteIsNext);
      if (team != whiteIsNext) {
          // team is int, whiteIsNext is bool
          // team == 0 is black, team == 1 is white
          // if it's not our turn, don't do anything
          return;
      }
      const nextGrid = currentGrid.slice();
      if (nextGrid[row][col] !== null) {
          return;
      }
      const [validClick, validFlips] = findValidFlips(nextGrid, row, col, whiteIsNext);
      if (!validClick) {
        return;
      }
      let toWhite;
      let toBlack;
      nextGrid[row][col] = whiteIsNext ? 0 : 1;
      toWhite = whiteIsNext ? validFlips.length : -validFlips.length;
      toBlack = whiteIsNext ? -validFlips.length: validFlips.length;
      makeFlips(nextGrid, validFlips);
      onPlay(nextGrid, toWhite, toBlack, false);
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

function findValidFlips(grid, row, col, whiteIsNext) {
  let checkVal = whiteIsNext ? 1 : 0;
  let currVal = whiteIsNext ? 0 : 1;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  var validFlips = []; // directions where a neighbor is present
  for (let i = 0; i < directions.length; i++) {
    let dir = directions[i];
    let row_check = row + dir[0];
    let col_check = col + dir[1];
    let numPushed = 0;
    // check for neighbors === checkVal
    while ((0 <= row_check && row_check < grid.length) &&
        (0 <= col_check && col_check < grid[0].length) &&
        (grid[row_check][col_check] === checkVal)) {
          // Push directions to validFlips list
          validFlips.push([row_check, col_check]);
          numPushed = numPushed + 1;
          row_check = row_check + dir[0];
          col_check = col_check + dir[1];
        }
    if (row_check < 0 || row_check >= grid.length ||
        col_check < 0 || col_check >= grid[0].length ||
        grid[row_check][col_check] !== currVal) {
      // pop the number of possible flips we just added since they are invalid.
      for (let i = 0; i < numPushed; i++) {
        validFlips.pop();
      }
    }
  }
  return [validFlips.length > 0, validFlips];
}

function makeFlips(grid, validFlips) {
  for (let i = 0; i < validFlips.length; i++) {
    const [flipRow, flipCol] = validFlips[i];
    // flip from 0 to 1, or from 1 to 0
    grid[flipRow][flipCol] = 1 - grid[flipRow][flipCol];
  }
}