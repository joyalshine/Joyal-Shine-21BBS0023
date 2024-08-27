import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home/Home';
import { Routes, Route } from 'react-router-dom'
import GameDisplay from './Pages/GameDisplay/GameDisplay';

function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game/:gameId' element={<GameDisplay />} />
        {/* <Route path='*' element={<PageNotFound />} /> */}
      </Routes>
    </>
  )
  // return (
    // <div class="game-container">
    //     <h1>Current Player: A</h1>
    //     <div class="grid-container">
    //         <div class="grid-item" id="A-P1">A-P1</div>
    //         <div class="grid-item selected" id="A-P2">A-P2</div>
    //         <div class="grid-item" id="A-H1">A-H1</div>
    //         <div class="grid-item" id="A-H2">A-H2</div>
    //         <div class="grid-item" id="A-P3">A-P3</div>

    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>

    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>

    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>
    //         <div class="grid-item"></div>

    //         <div class="grid-item" id="B-P1">B-P1</div>
    //         <div class="grid-item" id="B-P2">B-P2</div>
    //         <div class="grid-item" id="B-H1">B-H1</div>
    //         <div class="grid-item" id="B-H2">B-H2</div>
    //         <div class="grid-item" id="B-P3">B-P3</div>
    //     </div>

    //     <div class="selected-info">Selected: A-P2</div>

    //     <div class="controls">
    //         <button onclick="move('L')">L</button>
    //         <button onclick="move('R')">R</button>
    //         <button onclick="move('F')">F</button>
    //         <button onclick="move('B')">B</button>
    //     </div>
    // </div>
  // );
}

export default App;
