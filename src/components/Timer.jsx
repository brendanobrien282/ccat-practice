import { formatTime } from '../utils/quiz';

export default function Timer({ secondsLeft }) {
  const urgent = secondsLeft <= 60;

  return (
    <div className={`timer ${urgent ? 'timer-urgent' : ''}`} aria-live="polite">
      <span className="timer-label">Time left</span>
      <span className="timer-value">{formatTime(secondsLeft)}</span>
    </div>
  );
}
