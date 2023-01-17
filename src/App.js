import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { boardDefault, generateWordSet } from "./Words";
import React, { useState, createContext, useEffect } from "react";
import GameOver from "./components/GameOver";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [currAttempt, setCurrAttempt] = useState({
    attempt: 0,
    letterPosition: 0,
  });
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");

  // const correctWord = "RIGHT"

  useEffect(() => {
    generateWordSet().then((words) => {
      console.log(words);
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []);

  function clearRow() {
    const newBoard = [...board];
    newBoard[currAttempt.attempt] = ["", "", "", "", ""];
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPosition: 0 });
  }

  function onEnter() {
    if (currAttempt.letterPosition !== 5) return;
    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }
    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPosition: 0 });
    } else {
      alert("Word Not Found!");
      clearRow();
      return;
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }

    setCurrAttempt({
      attempt: currAttempt.attempt + 1,
      letterPosition: 0,
    });
  }

  function onSelectLetter(keyValue) {
    if (currAttempt.letterPosition > 4) return;

    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPosition] = keyValue;
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPosition: currAttempt.letterPosition + 1,
    });
  }

  function onDelete() {
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPosition - 1] = "";
    if (currAttempt.letterPosition === 0) return;
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPosition: currAttempt.letterPosition - 1,
    });
  }

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          onSelectLetter,
          onDelete,
          onEnter,
          correctWord,
          disabledLetters,
          setDisabledLetters,
          gameOver,
          setGameOver,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
