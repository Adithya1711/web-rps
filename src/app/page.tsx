'use client'
import React, { useState, useRef } from 'react';

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

const shuffleSequence = [
  'rock',
  'scissors',
  'paper',
  'rock',
  'paper',
  'scissors'
];

export default function Home() {
  const [stage, setStage] = useState<'pick'|'shuffling'|'show' >('pick');
  const [userChoice, setUserChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ user: 0, computer: 0 });
  const [shuffleIdx, setShuffleIdx] = useState(0);
  const shuffleInterval = useRef<NodeJS.Timeout | null>(null);
  const [showVs, setShowVs] = useState(false);

  function reset() {
    setUserChoice('');
    setComputerChoice('');
    setResult('');
    setShowVs(false);
    setStage('pick');
  }

  function play(choice: string) {
    setUserChoice(choice);
    setStage('shuffling');
    setShowVs(true);

    // Start shuffling (simulate computer thinking)
    let idx = 0;
    shuffleInterval.current = setInterval(() => {
      setShuffleIdx(idx % shuffleSequence.length);
      idx++;
    }, 110);

    setTimeout(() => {
      if (shuffleInterval.current) clearInterval(shuffleInterval.current);

      // Pick computer choice
      const computerPick = choices[Math.floor(Math.random() * choices.length)].name;
      setComputerChoice(computerPick);
      setShuffleIdx(0);
      setStage('show');

      // Calculate result and score
      const whoWon = decideWinner(choice, computerPick);
      setResult(whoWon);
      setScore((score) => {
        if (whoWon === "You win!") return { ...score, user: score.user + 1 };
        if (whoWon === "Computer wins!") return { ...score, computer: score.computer + 1 };
        return score;
      });

      // After delay, reset the round, keep the score
      setTimeout(() => {
        reset();
      }, 1800);
    }, 1300);
  }

  // Responsive font sizes and transitions with Tailwind
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-200 to-white font-sans">
      <div className="flex-1 flex flex-col items-center">
        <div className="mt-8 flex items-center justify-center">
          <div className="bg-white/90 rounded-3xl shadow-2xl px-3 xs:px-5 sm:px-12 py-4 sm:py-10 w-full max-w-xl md:max-w-2xl flex flex-col items-center relative overflow-hidden transition-all">
            {/* Scoreboard always shows at the top */}
            <div className="flex items-center justify-between gap-8 mt-6 text-[1.08rem]
              bg-gradient-to-r from-blue-100/80 via-cyan-100/90 to-blue-50/90
              rounded-lg px-6 py-2.5 shadow-md w-full max-w-xs
              border border-blue-200
              text-slate-700 font-medium">
              <div>👤 You: {score.user}</div>
              <div>🤖 Computer: {score.computer}</div>
            </div>
            
            {/* Spacer */}
            <div className="h-8"></div>

            {/* The option buttons */}
            <div
              className={`
                flex gap-6 w-full justify-center z-10 transition-all duration-500 ease-in-out
                ${stage === 'pick'
                  ? 'mt-[64px] mb-[52px]'
                  : 'scale-75 mt-[-2rem] mb-2 pointer-events-none opacity-75'}
              `}
            >
              {choices.map((c) => (
                <button
                  key={c.name}
                  className={`
                    text-[4rem] md:text-[5rem] px-5 py-2 rounded-xl shadow
                    font-medium border-2 bg-white
                    transition-all duration-300
                    ${stage === 'pick'
                      ? 'hover:scale-110 focus:scale-110 active:scale-105'
                      : 'cursor-default'}
                    ${userChoice === c.name && stage !== 'pick'
                      ? 'ring-4 ring-teal-300 border-teal-400'
                      : 'border-gray-100'}
                  `}
                  disabled={stage !== 'pick'}
                  style={{
                    filter:
                      stage !== 'pick' && userChoice !== c.name
                        ? 'grayscale(0.7) saturate(0.7) brightness(0.96)' : undefined,
                    zIndex: userChoice === c.name ? 20 : 10
                  }}
                  onClick={() => play(c.name)}
                  title={c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                >
                  {c.emoji}
                </button>
              ))}
            </div>

            {/* The VS Battle section */}
            <div className={`
                flex flex-col items-center justify-center
                transition-all duration-500
                ${showVs ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              `}
              style={{
                minHeight: '7rem',
                marginTop: stage === 'pick' ? '2.2rem' : '1.1rem',
                marginBottom: stage === 'pick' ? '-1.7rem' : '0',
                pointerEvents: 'none'
              }}
            >
              {showVs && (
                <>
                  <div className="flex items-center justify-center mb-3 min-h-[4rem]">
                    <span className="text-[3.8rem] md:text-[4.6rem] transition-all"
                      style={{
                        filter: stage==='shuffling' ? 'shuffling' : undefined,
                        transition: 'filter 0.14s'
                      }}
                    >
                      {stage === 'pick'
                        ? ''
                        : stage === 'shuffling'
                          ? choices.find(c => c.name === shuffleSequence[shuffleIdx])?.emoji
                          : choices.find(c => c.name === userChoice)?.emoji
                      }
                    </span>
                    <span className="text-xl text-slate-300 font-bold mx-5 select-none">vs</span>
                    <span className="text-[3.8rem] md:text-[4.6rem] transition-all">
                      {stage === 'shuffling'
                        ? choices.find(c => c.name === shuffleSequence[shuffleIdx])?.emoji
                        : stage === 'pick'
                          ? ''
                          : choices.find(c => c.name === computerChoice)?.emoji
                      }
                    </span>
                  </div>

                  {/* RESULT */}
                  <div className={`
                    min-h-[2.1rem] text-2xl font-semibold mb-1 transition-all duration-300
                    ${stage === 'show' ? 'opacity-100 scale-105 text-purple-700' : 'opacity-0 scale-90'}
                  `}>
                    {stage === 'show' && (
                      <span>{result}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer or controls could go here if needed */}
    </div>
  );
}