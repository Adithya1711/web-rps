'use client'
import React, { useState } from 'react';

const choices = [
  { name: 'rock', emoji: '✊' },
  { name: 'paper', emoji: '✋' },
  { name: 'scissors', emoji: '✌️' },
];

function decideWinner(user: string, computer: string) {
  if (user === computer) return "It's a tie!";
  if (
    (user === 'rock' && computer === 'scissors') ||
    (user === 'scissors' && computer === 'paper') ||
    (user === 'paper' && computer === 'rock')
  ) return "You win!";
  return "Computer wins!";
}

export default function Home() {
  const [userChoice, setUserChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ user: 0, computer: 0 });

  function play(choice: string) {
    const computerPick = choices[Math.floor(Math.random() * choices.length)].name;
    setUserChoice(choice);
    setComputerChoice(computerPick);
    const whoWon = decideWinner(choice, computerPick);
    setResult(whoWon);
    setScore((score) => {
      if (whoWon === "You win!") return { ...score, user: score.user + 1 };
      if (whoWon === "Computer wins!") return { ...score, computer: score.computer + 1 };
      return score;
    });
  }

  function reset() {
    setUserChoice('');
    setComputerChoice('');
    setResult('');
    setScore({ user: 0, computer: 0 });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-white font-sans">
      <div className="bg-white/90 rounded-3xl shadow-2xl px-10 py-12 max-w-sm w-full flex flex-col items-center">
        <h1 className="mb-3 font-bold text-2xl tracking-tight">Rock Paper Scissors</h1>

        <div className="flex gap-4 my-6">
          {choices.map((c) => (
            <button
              key={c.name}
              className={`text-4xl px-5 py-2 rounded-xl shadow 
                transition-all duration-300 font-medium 
                border-2 ${
                  userChoice === c.name
                    ? 'bg-gradient-to-r from-green-200 to-yellow-100 border-teal-400 ring-2 ring-teal-300'
                    : 'bg-white border-gray-100 hover:bg-gradient-to-r hover:from-purple-100 hover:to-amber-50'
                }`}
              onClick={() => play(c.name)}
              title={c.name.charAt(0).toUpperCase() + c.name.slice(1)}
            >
              {c.emoji}
            </button>
          ))}
        </div>

        <div className="h-6 mb-2 text-lg font-semibold text-slate-600">
          {result}
        </div>

        <div className="text-gray-400 mt-2 text-lg tracking-wide min-h-[2.2rem] flex items-center">
          {userChoice ? (
            <>
              <span>{choices.find(c => c.name === userChoice)?.emoji}</span>
              <span className="mx-2">vs</span>
              <span>{choices.find(c => c.name === computerChoice)?.emoji}</span>
            </>
          ) : (
            <span>Pick your move</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-8 mt-6 text-[1.08rem] bg-gray-50 rounded-lg px-6 py-2.5 shadow-sm w-full max-w-xs">
          <div>👤 You: {score.user}</div>
          <div>🤖 Computer: {score.computer}</div>
        </div>

        <button
          className="mt-5 text-gray-400 text-base hover:text-purple-500 transition-colors"
          onClick={reset}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}