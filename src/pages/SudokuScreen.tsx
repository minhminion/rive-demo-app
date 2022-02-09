import React, { useEffect, useState } from 'react'
import { generateSudoku } from '../utils/sudoku'

interface SudokuCell {
  num: number | string
  readOnly: boolean
  isWrong: boolean | null
}

const SudokuScreen = () => {
  const MAX_LEVEL = 7
  const MIN_LEVEL = 3

  const [gameLevel, setGameLevel] = useState(MIN_LEVEL)
  const [initSudoku, setInitSudoku] = useState<SudokuCell[][]>([
    [{ num: '', readOnly: true, isWrong: false }],
  ])
  const [sudoku, setSudoku] = useState<SudokuCell[][]>([
    [{ num: 0, readOnly: true, isWrong: false }],
  ])

  useEffect(() => {
    // initialGame(Math.floor(Math.random() * (MAX_LEVEL - MIN_LEVEL) + MIN_LEVEL))
    initialGame(gameLevel)
  }, [gameLevel])

  const initialGame = (level: number) => {
    let defaultSudokuMatrix = generateSudoku()

    setInitSudoku(JSON.parse(JSON.stringify(defaultSudokuMatrix)))

    for (let i = 0; i < defaultSudokuMatrix.length; ++i) {
      let k = 0
      while (k < level) {
        let randomColumnIndex = Math.floor(
          Math.random() * defaultSudokuMatrix.length,
        )
        if (defaultSudokuMatrix[i][randomColumnIndex].num !== '') {
          k++
          defaultSudokuMatrix[i][randomColumnIndex].num = ''
          defaultSudokuMatrix[i][randomColumnIndex].readOnly = false
        }
      }
    }

    setSudoku(defaultSudokuMatrix)
  }

  const checkCorrectSudoku = () => {
    let countWrongAns = 0
    const answerSudoku = JSON.parse(JSON.stringify(sudoku))
    answerSudoku.forEach((row: SudokuCell[], rowIndex: number) =>
      row.forEach((value: SudokuCell, cellIndex: number) => {
        const initCell = initSudoku[rowIndex][cellIndex]

        if(value.readOnly) return

        if (initCell.num !== value.num) {
          value.isWrong = true
          countWrongAns++
          if (value.num === '') value.num = initCell.num
        } else {
          value.isWrong = false
        }
      }),
    )

    setSudoku(answerSudoku)
    console.log("🚀 Minh =====>  ~ file: SudokuScreen.tsx ~ line 67 ~ answerSudoku", answerSudoku)

    if (countWrongAns > 0) {
      alert('False')
    } else {
      alert('Correct')
    }
  }

  const handleOnChangeCell = (value: number, row: number, cell: number) => {
    const updateSudoku = [...sudoku]
    updateSudoku[row][cell].num = value

    setSudoku(updateSudoku)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'block' }}>
        Setting
        <input
          name="gameLevel"
          type="number"
          value={gameLevel}
          onChange={(e) => setGameLevel(parseInt(e.target.value))}
        />
        <button name="gameRefresh" onClick={(e) => initialGame(gameLevel)}>
          Refresh
        </button>
        <button name="gameCheck" onClick={(e) => checkCorrectSudoku()}>
          Check
        </button>
      </div>
      <div className="sudoku">
        <div className="sudoku__board">
          {sudoku.map((row, index) => {
            return (
              <div className="sudoku__row" key={index}>
                {row.map((value, cell_index) => (
                  <div
                    key={cell_index}
                    className={`sudoku__cell ${
                      value?.readOnly === false ? 'sudoku__cell--hidden' : ''
                    } sudoku__cell--isWrong--${value.isWrong}`}
                  >
                    <input
                      onChange={(e) =>
                        handleOnChangeCell(
                          parseInt(e.target.value.charAt(0)),
                          index,
                          cell_index,
                        )
                      }
                      disabled={value?.readOnly}
                      type={'number'}
                      value={value.num}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SudokuScreen
