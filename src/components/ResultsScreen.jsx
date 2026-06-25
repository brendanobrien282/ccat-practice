import { formatTime } from '../utils/quiz';

export default function ResultsScreen({ result, timeUsedSeconds, onRestart, onHome }) {
  const { correct, total, wrong } = result;
  const pct = Math.round((correct / total) * 100);
  const passed = correct >= 28;

  return (
    <div className="results-screen">
      <div className="card results-summary">
        <h1>Test complete</h1>
        <span className={`pass-badge ${passed ? 'pass-badge-pass' : 'pass-badge-fail'}`}>
          {passed ? 'Passing score' : 'Below passing score'}
        </span>
        <div className="score-circle">
          <span className="score-value">{correct}/{total}</span>
          <span className="score-pct">{pct}%</span>
        </div>
        <p className="time-used">Time used: {formatTime(timeUsedSeconds)}</p>
        <div className="results-actions">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            New practice test
          </button>
          <button type="button" className="btn btn-secondary" onClick={onHome}>
            Back to main menu
          </button>
        </div>
      </div>

      {wrong.length > 0 ? (
        <section className="review-section">
          <h2>Review ({wrong.length} wrong)</h2>
          {wrong.map(({ question, chosenIndex, questionNumber }) => (
            <article key={question.id} className="card review-card">
              <p className="review-meta">Question {questionNumber} · {question.category}</p>
              <p className="question-text">{question.question}</p>
              <p className="review-answer wrong-answer">
                Your answer: {chosenIndex !== null ? question.options[chosenIndex] : '(skipped)'}
              </p>
              <p className="review-answer correct-answer">
                Correct answer: {question.options[question.correctIndex]}
              </p>
              <p className="explanation">{question.explanation}</p>
            </article>
          ))}
        </section>
      ) : (
        <div className="card perfect-score">
          <p>Perfect score — no mistakes to review!</p>
        </div>
      )}
    </div>
  );
}
