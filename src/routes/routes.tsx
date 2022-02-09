import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RiveScreen from '../pages/RiveScreen'
import SudokuScreen from '../pages/SudokuScreen'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sudoku" element={<SudokuScreen />} />
      <Route path="/" element={<RiveScreen />} />
    </Routes>
  )
}

export default AppRoutes
