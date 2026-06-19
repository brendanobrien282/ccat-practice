import { formatTime, SESSION_SIZE, TIME_LIMIT_SECONDS } from '../utils/quiz';
import { getBankStats } from '../utils/storage';

export default function StartScreen({ questions, onStart, onReset }) {
  const stats = getBankStats(questions);
  const canStart = stats.remaining >= SESSION_SIZE;

  const categoryCounts = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { key: 'verbal', label: 'Verbal' },
    { key: 'math', label: 'Math & logic' },
    { key: 'spatial', label: 'Spatial' },
  ];

  return (
    <div className="card start-screen">
      <h1>Brendan&apos;s CCAT Prep</h1>
      <p className="subtitle">
        Train like the real exam: {SESSION_SIZE} questions, {TIME_LIMIT_SECONDS / 60} minutes.
      </p>
      <p className="pass-hint">Most employers look for a score of at least 28/50.</p>

      <div className="stats-grid">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total questions</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.remaining}</span>
          <span className="stat-label">Unused questions</span>
        </div>
        <div className="stat">
          <span className="stat-value">{Math.floor(stats.remaining / SESSION_SIZE)}</span>
          <span className="stat-label">Full runs left</span>
        </div>
      </div>

      <div className="category-breakdown">
        {categories.map(({ key, label }) => (
          <span key={key} className="category-pill">
            {label}: {categoryCounts[key] || 0}
          </span>
        ))}
      </div>

      {!canStart ? (
        <div className="notice notice-warning">
          <p>You've used every question in the bank. Reset progress to practice again.</p>
          <button type="button" className="btn btn-primary" onClick={onReset}>
            Reset progress
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary btn-large" onClick={onStart}>
          Start practice test
        </button>
      )}

      <ul className="rules">
        <li>Each session picks {SESSION_SIZE} questions you haven't seen yet.</li>
        <li>Timer: {formatTime(TIME_LIMIT_SECONDS)} — auto-submits when time runs out.</li>
        <li>Answer every question; you can move forward and back.</li>
        <li>At the end you'll see your score and review wrong answers.</li>
      </ul>

      {stats.seen > 0 && canStart && (
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          Reset progress ({stats.seen} seen)
        </button>
      )}
    </div>
  );
}
