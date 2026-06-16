const SEEN_KEY = 'ccat-seen-question-ids';

export function getSeenQuestionIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markQuestionsSeen(ids) {
  const seen = new Set(getSeenQuestionIds());
  ids.forEach((id) => seen.add(id));
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

export function resetProgress() {
  localStorage.removeItem(SEEN_KEY);
}

export function getBankStats(allQuestions) {
  const seen = new Set(getSeenQuestionIds());
  const remaining = allQuestions.filter((q) => !seen.has(q.id)).length;
  return {
    total: allQuestions.length,
    seen: seen.size,
    remaining,
  };
}
