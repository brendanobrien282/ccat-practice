import { formatTime, TIME_LIMIT_SECONDS } from '../utils/quiz';

export default function Timer({ secondsLeft }) {
  const urgent = secondsLeft <= 60;
  const pct = (secondsLeft / TIME_LIMIT_SECONDS) * 100;

  return (
    <div className={`timer ${urgent ? 'timer-urgent' : ''}`} aria-live="polite">
      <span className="timer-label">Time left</span>
      <span className="timer-value">{formatTime(secondsLeft)}</span>
      <div className="timer-bar" aria-hidden="true">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
