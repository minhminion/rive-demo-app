
import React, { useEffect, useState } from 'react'
import { generateSudoku } from '../utils/sudoku'

interface SudokuCell {
  num: number | string
  readOnly: boolean
  isWrong: boolean | null
}

enum SudokuGameMode {
  Standard,
  SandBox,
  Free,
}

const GameModeOption = [
  {
    title: 'Standard',
    value: SudokuGameMode.Standard,
  },
  {
    title: 'SandBox',
    value: SudokuGameMode.SandBox,
  },
  {
    title: 'Free',
    value: SudokuGameMode.Free,
  },
]

const SudokuScreen = () => {
  const MAX_LEVEL = 7
  const MIN_LEVEL = 3
  const MAX_WRONG_ANS = 3

  const [gameMode, setGameMode] = useState<SudokuGameMode>(
    SudokuGameMode.Standard,
  )
  const [countWrongAns, setCountWrongAns] = useState(0)
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

    setCountWrongAns(0)
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

        if (value.readOnly) return

        if (initCell.num !== value.num) {
          value.isWrong = true
          countWrongAns++
          value.num = initCell.num
        } else {
          value.isWrong = false
        }
      }),
    )

    setSudoku(answerSudoku)

    if (countWrongAns > 0) {
      alert('False')
    } else {
      alert('Correct')
    }
  }

  const handleOnChangeCell = (value: number, row: number, cell: number) => {
    const updateSudoku = JSON.parse(JSON.stringify(sudoku))
    let tempCountWrong = countWrongAns
    updateSudoku[row][cell].num = value

    if (!isNaN(value)) {
      switch (gameMode) {
        case SudokuGameMode.Standard:
          updateSudoku[row][cell].isWrong =
            initSudoku[row][cell].num === value ? false : true
          break
        default:
          updateSudoku[row][cell].isWrong = null
          break
      }
      updateSudoku[row][cell].isWrong === true &&
      tempCountWrong++
    }
    
    setCountWrongAns(tempCountWrong)
    setSudoku(updateSudoku)

    checkCountWrong(tempCountWrong)
  }

  const checkCountWrong = (number: number) => {
    if (number === MAX_WRONG_ANS) {
      checkCorrectSudoku()
    }
  }

  const handleChangeLevel = (value: number) => {
    if (isNaN(value) || value > MAX_LEVEL || value < MIN_LEVEL) {
      setGameLevel(MIN_LEVEL)
      return
    } else {
      setGameLevel(value)
      return
    }
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
      <div style={{ display: 'block', color: 'white' }}>
        <div style={{ marginBottom: 10 }}>
          <h3>Wrong Ans: {countWrongAns}</h3>
          <input
            name="gameLevel"
            type="number"
            min={MIN_LEVEL}
            max={MAX_LEVEL}
            value={gameLevel}
            onChange={(e) => handleChangeLevel(parseInt(e.target.value))}
          />
          <button name="gameRefresh" onClick={(e) => initialGame(gameLevel)}>
            Refresh
          </button>
          <button name="gameCheck" onClick={(e) => checkCorrectSudoku()}>
            Check
          </button>
        </div>
        <div>
          Game Mode
          <br />
          {GameModeOption.map((item: any) => (
            <label className="container">
              {item.title}
              <input
                type="radio"
                name="gameMode"
                checked={item.value === gameMode}
                value={item.value}
                onChange={() => setGameMode(item.value)}
              />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
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
