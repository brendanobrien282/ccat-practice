import { useCallback, useEffect, useState } from 'react';
import questions from './data/questions.json';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import {
  pickSessionQuestions,
  scoreSession,
  SESSION_SIZE,
  TIME_LIMIT_SECONDS,
} from './utils/quiz';
import {
  getSeenQuestionIds,
  markQuestionsSeen,
  resetProgress,
} from './utils/storage';
import './styles.css';

const VIEWS = {
  START: 'start',
  QUIZ: 'quiz',
  RESULTS: 'results',
};

export default function App() {
  const [view, setView] = useState(VIEWS.START);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT_SECONDS);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [bankVersion, setBankVersion] = useState(0);

  const finishTest = useCallback(() => {
    const used = TIME_LIMIT_SECONDS - secondsLeft;
    setTimeUsedSeconds(used);
    setResult(scoreSession(sessionQuestions, answers));
    markQuestionsSeen(sessionQuestions.map((q) => q.id));
    setView(VIEWS.RESULTS);
  }, [answers, secondsLeft, sessionQuestions]);

  useEffect(() => {
    if (view !== VIEWS.QUIZ) return undefined;

    if (secondsLeft <= 0) {
      finishTest();
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [view, secondsLeft, finishTest]);

  function startTest() {
    const { questions: picked, exhausted } = pickSessionQuestions(
      questions,
      getSeenQuestionIds(),
    );

    if (exhausted) {
      setBankVersion((v) => v + 1);
      setView(VIEWS.START);
      return;
    }

    setSessionQuestions(picked);
    setAnswers(Array(SESSION_SIZE).fill(null));
    setCurrentIndex(0);
    setSecondsLeft(TIME_LIMIT_SECONDS);
    setResult(null);
    setView(VIEWS.QUIZ);
  }

  function handleReset() {
    resetProgress();
    setBankVersion((v) => v + 1);
    setView(VIEWS.START);
  }

  function handleSelectAnswer(index, choice) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choice;
      return next;
    });
  }

  function goToQuestion(index) {
    setCurrentIndex(index);
  }

  function exitToMenu() {
    setSessionQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setSecondsLeft(TIME_LIMIT_SECONDS);
    setResult(null);
    setView(VIEWS.START);
  }

  return (
    <main className="container">
      {view === VIEWS.START && (
        <StartScreen
          key={bankVersion}
          questions={questions}
          onStart={startTest}
          onReset={handleReset}
        />
      )}

      {view === VIEWS.QUIZ && (
        <QuizScreen
          questions={sessionQuestions}
          currentIndex={currentIndex}
          answers={answers}
          secondsLeft={secondsLeft}
          onSelectAnswer={handleSelectAnswer}
          onNext={() => goToQuestion(Math.min(sessionQuestions.length - 1, currentIndex + 1))}
          onGoTo={goToQuestion}
          onPrev={() => goToQuestion(Math.max(0, currentIndex - 1))}
          onSubmit={finishTest}
          onExit={exitToMenu}
        />
      )}

      {view === VIEWS.RESULTS && result && (
        <ResultsScreen
          result={result}
          timeUsedSeconds={timeUsedSeconds}
          onRestart={startTest}
          onHome={() => setView(VIEWS.START)}
        />
      )}
    </main>
  );
}
