import Timer from './Timer';

export default function QuizScreen({
  questions,
  currentIndex,
  answers,
  secondsLeft,
  onSelectAnswer,
  onNext,
  onPrev,
  onGoTo,
  onSubmit,
  onExit,
}) {
  const question = questions[currentIndex];
  const selected = answers[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="quiz-screen">
      <header className="quiz-header">
        <button type="button" className="btn btn-ghost btn-menu" onClick={onExit}>
          ← Back to main menu
        </button>
        <Timer secondsLeft={secondsLeft} />
        <div className="progress">
          Question {currentIndex + 1} of {questions.length}
          <span className="progress-answered"> · {answeredCount} answered</span>
        </div>
      </header>

      <div className="card question-card">
        <span className="category-tag">{question.category}</span>
        <p className="question-text">{question.question}</p>

        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={option}
              type="button"
              className={`option ${selected === index ? 'option-selected' : ''}`}
              onClick={() => onSelectAnswer(currentIndex, index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-nav">
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={currentIndex === 0}>
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            Submit test
          </button>
        )}
      </div>

      <div className="question-dots">
        {questions.map((q, index) => (
          <button
            key={q.id}
            type="button"
            className={`dot ${index === currentIndex ? 'dot-active' : ''} ${answers[index] !== null ? 'dot-answered' : ''}`}
            onClick={() => onGoTo(index)}
            aria-label={`Go to question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
