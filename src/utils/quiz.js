export const SESSION_SIZE = 50;
export const TIME_LIMIT_SECONDS = 15 * 60;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickSessionQuestions(allQuestions, seenIds, count = SESSION_SIZE) {
  const seen = new Set(seenIds);
  const pool = allQuestions.filter((q) => !seen.has(q.id));

  if (pool.length < count) {
    return { questions: [], exhausted: true };
  }

  return { questions: shuffle(pool).slice(0, count), exhausted: false };
}

export function scoreSession(questions, answers) {
  let correct = 0;
  const wrong = [];

  questions.forEach((question, index) => {
    const chosen = answers[index];
    if (chosen === question.correctIndex) {
      correct += 1;
    } else {
      wrong.push({
        question,
        chosenIndex: chosen,
        questionNumber: index + 1,
      });
    }
  });

  return { correct, total: questions.length, wrong };
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
