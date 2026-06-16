import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueStrings(arr) {
  return [...new Set(arr.map(String))];
}

function numericDistractors(correct, count = 4) {
  const n = Number(correct);
  const offsets = [2, 3, 5, 7, 11, -2, -3, n * 0.1, n * 0.2, Math.round(n / 2)];
  const pool = offsets
    .map((o) => (Number.isInteger(n) ? Math.round(n + o) : Math.round((n + o) * 100) / 100))
    .filter((v) => v !== n && v > 0);
  return uniqueStrings(pool).slice(0, count);
}

function makeQuestion(id, category, type, question, correct, distractors, explanation) {
  const options = shuffle(uniqueStrings([correct, ...distractors]).slice(0, 5));
  return {
    id,
    category,
    type,
    question,
    options,
    correctIndex: options.indexOf(String(correct)),
    explanation,
  };
}

const questions = [];
let counter = 0;

function add(category, type, question, correct, distractors, explanation) {
  counter += 1;
  questions.push(
    makeQuestion(
      `q-${String(counter).padStart(4, '0')}`,
      category,
      type,
      question,
      correct,
      distractors,
      explanation,
    ),
  );
}

// ─── Verbal: Analogies (relationship-based, CCAT style) ───

const analogyPairs = [
  ['PAINTER', 'BRUSH', 'SURGEON', 'SCALPEL', 'Worker to primary tool.'],
  ['CUB', 'BEAR', 'COLT', 'HORSE', 'Young to adult animal.'],
  ['MICROSCOPE', 'BACTERIA', 'TELESCOPE', 'GALAXY', 'Instrument to what it reveals.'],
  ['EPILOGUE', 'NOVEL', 'APPENDIX', 'BOOK', 'Closing section to larger work.'],
  ['ARID', 'DESERT', 'FRIGID', 'TUNDRA', 'Climate quality to environment.'],
  ['CENSURE', 'CRITICIZE', 'LAUD', 'PRAISE', 'Formal verb to common verb with same meaning.'],
  ['QUART', 'GALLON', 'MINUTE', 'HOUR', 'Smaller unit to larger unit.'],
  ['PROLOGUE', 'BEGINNING', 'EPILOGUE', 'ENDING', 'Literary part to its narrative role.'],
  ['MITIGATE', 'LESSEN', 'EXACERBATE', 'WORSEN', 'Verb to simpler synonym.'],
  ['PHILANTHROPIST', 'DONATE', 'ARSONIST', 'BURN', 'Actor to characteristic action.'],
  ['CONDUCTOR', 'ORCHESTRA', 'CAPTAIN', 'SHIP', 'Leader to group led.'],
  ['ANATOMY', 'BODY', 'GEOLOGY', 'EARTH', 'Field of study to subject.'],
  ['ACOUSTIC', 'SOUND', 'OPTICAL', 'LIGHT', 'Adjective describing a physical medium.'],
  ['RECLUSIVE', 'SECLUDED', 'GREGARIOUS', 'SOCIAL', 'Personality trait to behavior style.'],
  ['Catalyst', 'ACCELERATE', 'OBSTACLE', 'HINDER', 'Thing that affects progress.'],
  ['PERIPHERAL', 'EDGE', 'CENTRAL', 'CORE', 'Position descriptor to location.'],
  ['PROSECUTOR', 'ACCUSE', 'DEFENSE', 'DEFEND', 'Legal role to action.'],
  ['DORMANT', 'INACTIVE', 'VIGILANT', 'ALERT', 'State of readiness.'],
  ['METAPHOR', 'FIGURATIVE', 'STATEMENT', 'LITERAL', 'Language type to meaning mode.'],
  ['PREDECESSOR', 'BEFORE', 'SUCCESSOR', 'AFTER', 'Role relative to timeline.'],
  ['SKEPTICAL', 'DOUBTFUL', 'CREDULOUS', 'TRUSTING', 'Attitude toward belief.'],
  ['AMPHIBIAN', 'FROG', 'MAMMAL', 'WHALE', 'Class to example animal.'],
  ['CARTOGRAPHER', 'MAP', 'CHRONICLER', 'HISTORY', 'Creator to creation.'],
  ['VACILLATE', 'WAVER', 'RESOLVE', 'DECIDE', 'Verb describing certainty of choice.'],
  ['INCREMENT', 'ADDITION', 'DECREMENT', 'SUBTRACTION', 'Process word to operation.'],
];

for (const [a, b, c, answer, explanation] of analogyPairs) {
  add(
    'verbal',
    'analogy',
    `${a} is to ${b} as ${c} is to ___`,
    answer,
    ['HARVEST', 'MARGIN', 'VERTEX', 'CIPHER', 'PLATEAU', 'BASTION'],
    explanation,
  );
}

// ─── Verbal: Antonyms (harder vocabulary) ───

const antonymPairs = [
  ['COPIOUS', 'SCARCE'],
  ['AMELIORATE', 'WORSEN'],
  ['EPHEMERAL', 'LASTING'],
  ['BELLIGERENT', 'PEACEFUL'],
  ['LOQUACIOUS', 'TACITURN'],
  ['PRAGMATIC', 'IDEALISTIC'],
  ['VERACIOUS', 'DISHONEST'],
  ['MITIGATE', 'INTENSIFY'],
  ['PERFUNCTORY', 'THOROUGH'],
  ['INSIPID', 'FLAVORFUL'],
  ['PUSILLANIMOUS', 'COURAGEOUS'],
  ['SANGUINE', 'PESSIMISTIC'],
  ['OBSEQUIOUS', 'ASSERTIVE'],
  ['LACONIC', 'VERBOSE'],
  ['INIMICAL', 'FRIENDLY'],
  ['PROLIFIC', 'UNPRODUCTIVE'],
  ['TACIT', 'EXPLICIT'],
  ['ADROIT', 'CLUMSY'],
  ['MAGNANIMOUS', 'PETTY'],
  ['PERNICIOUS', 'BENEFICIAL'],
];

for (const [word, answer] of antonymPairs) {
  add(
    'verbal',
    'antonym',
    `Which word is most nearly OPPOSITE in meaning to ${word}?`,
    answer,
    ['SIMILAR', 'ANALOGOUS', 'IDENTICAL', 'COMPARABLE', 'RELATED'],
    `${word} and ${answer} express opposite meanings.`,
  );
}

// ─── Verbal: Sentence completion (contrast & inference) ───

const sentenceTemplates = [
  ['Despite the CEO\'s ______ public apology, internal audits revealed the misconduct continued for months.', 'SINCERE', ['HALFHEARTED', 'TOKEN', 'FORCED', 'DELAYED'], '"Despite" signals the apology did not match ongoing misconduct — it appeared sincere outwardly.'],
  ['The witness gave a ______ account, omitting several details that later proved crucial.', 'PARTIAL', ['EXHAUSTIVE', 'NEUTRAL', 'CHRONOLOGICAL', 'VIVID'], 'Omitting crucial details implies the account was incomplete.'],
  ['Although the proposal was ______ in scope, the committee rejected it for lacking feasibility.', 'AMBITIOUS', ['NARROW', 'MODEST', 'ROUTINE', 'MINOR'], 'Rejection for feasibility despite large scope fits "ambitious."'],
  ['The diplomat\'s remarks were deliberately ______ so that neither side could claim a clear victory.', 'AMBIGUOUS', ['FORCEFUL', 'PARTISAN', 'CONFRONTATIONAL', 'PRECISE'], 'Neither side claiming victory suggests ambiguous wording.'],
  ['Her critique was not malicious but rather ______, aimed at improving the draft.', 'CONSTRUCTIVE', ['VINDICTIVE', 'SUPERFICIAL', 'RANDOM', 'REDUNDANT'], 'Aimed at improvement implies constructive intent.'],
  ['The contract language was so ______ that both legal teams interpreted key clauses differently.', 'VAGUE', ['PRECISE', 'STANDARD', 'CONCISE', 'ROUTINE'], 'Different interpretations imply vague language.'],
  ['The researcher\'s findings were ______ by three independent labs before publication.', 'REPLICATED', ['DISPUTED', 'IGNORED', 'WITHHELD', 'RUSHED'], 'Independent labs confirming results means replicated.'],
  ['The market reaction was ______; prices swung wildly within a single trading session.', 'VOLATILE', ['STABLE', 'PREDICTABLE', 'GRADUAL', 'MUTED'], 'Wild price swings indicate volatility.'],
  ['He remained ______ under cross-examination, refusing to alter his timeline.', 'STEADFAST', ['EVASIVE', 'CONTRITE', 'INDifferent', 'APOLOGETIC'], 'Refusing to alter his story shows steadfastness.'],
  ['The novel\'s protagonist is ______ rather than heroic, motivated mostly by self-preservation.', 'ANTIHERO', ['VILLAINOUS', 'MYTHIC', 'SAINTLY', 'ONE-DIMENSIONAL'], 'Self-preservation over heroism fits an antihero.'],
];

for (const [sentence, answer, distractors, explanation] of sentenceTemplates) {
  add('verbal', 'sentence_completion', sentence, answer, distractors, explanation);
}

// ─── Verbal: Syllogisms (multiple-choice conclusions) ───

const syllogisms = [
  ['All project managers attend the weekly sync. Jordan is a project manager. Which must be true?', 'Jordan attends the weekly sync', ['Jordan leads the sync', 'Everyone at the sync is a project manager', 'Jordan is a senior manager', 'Only managers attend the sync'], 'If all PMs attend and Jordan is a PM, Jordan must attend.'],
  ['No part-time staff have building access after 6 PM. Some interns are part-time staff. Which must be true?', 'Some interns may lack after-hours access', ['All interns lack after-hours access', 'No interns are part-time', 'All part-time staff are interns', 'Every intern has after-hours access'], 'Some interns being part-time means at least some may lack access; we cannot say all.'],
  ['If a report is flagged, it is reviewed. This report was not reviewed. What follows?', 'This report was not flagged', ['This report was flagged', 'All unreviewed reports are approved', 'Review always leads to flagging', 'Flagged reports are never reviewed'], 'Contrapositive: not reviewed → not flagged.'],
  ['All valid licenses expire within two years. Maria\'s license is valid. Which is necessarily true?', 'Maria\'s license will expire within two years', ['Maria renewed her license yesterday', 'Maria\'s license never expires', 'Only Maria has a valid license', 'Expired licenses are always invalid'], 'Valid licenses expire within two years, so Maria\'s must.'],
  ['Some candidates passed the screen. All who passed the screen were interviewed. Which must be true?', 'Some candidates were interviewed', ['All candidates were interviewed', 'No candidates passed', 'All interviewees failed', 'Only one candidate passed'], 'Some passed → those some were interviewed.'],
];

for (const [prompt, answer, distractors, explanation] of syllogisms) {
  add('verbal', 'syllogism', prompt, answer, distractors, explanation);
}

// ─── Verbal: Attention to detail ───

function mutateCode(code, index) {
  const chars = code.split('');
  const repl = '0123456789'[Math.floor(Math.random() * 10)];
  chars[index] = chars[index] === repl ? '8' : repl;
  return chars.join('');
}

for (let i = 0; i < 60; i++) {
  const base = String(100000000 + Math.floor(Math.random() * 899999999));
  const diffIndex = Math.floor(Math.random() * base.length);
  const variant = Math.random() > 0.5 ? base : mutateCode(base, diffIndex);
  const same = base === variant;
  add(
    'verbal',
    'attention_to_detail',
    `Are these codes identical?\nA: ${base}\nB: ${variant}`,
    same ? 'Same' : 'Different',
    ['Same', 'Different'].filter((x) => x !== (same ? 'Same' : 'Different')).concat(['Cannot tell']),
    same ? 'Every digit matches in order.' : 'At least one digit differs — compare left to right.',
  );
}

// ─── Math: Number series (multi-step patterns) ───

const seriesGenerators = [
  {
    name: 'Fibonacci-style',
    gen: (a, b) => {
      const seq = [a, b];
      while (seq.length < 5) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
      const next = seq[2] + seq[3];
      return { seq: seq.slice(0, 4), next, note: 'Each term is the sum of the two before it.' };
    },
  },
  {
    name: 'Squares',
    gen: (n) => {
      const seq = [1, 2, 3, 4].map((k) => (k + n) ** 2);
      const next = (5 + n) ** 2;
      return { seq, next, note: 'Terms follow consecutive squares.' };
    },
  },
  {
    name: 'Multiply then add',
    gen: (m, a) => {
      let x = 2;
      const seq = [];
      for (let i = 0; i < 4; i++) {
        seq.push(x);
        x = x * m + a;
      }
      const next = x;
      return { seq, next, note: `Multiply by ${m}, then add ${a} each step.` };
    },
  },
  {
    name: 'Second difference',
    gen: (start, d1) => {
      const seq = [start];
      let step = d1;
      for (let i = 1; i < 4; i++) {
        seq.push(seq[i - 1] + step);
        step += 1;
      }
      const next = seq[3] + (step);
      return { seq, next, note: 'The gap between terms increases by 1 each time.' };
    },
  },
  {
    name: 'Alternating double/halve offset',
    gen: (start) => {
      let x = start;
      const seq = [x];
      for (let i = 1; i < 4; i++) {
        x = i % 2 === 1 ? x * 2 + 1 : x + 3;
        seq.push(x);
      }
      const next = 4 % 2 === 1 ? x * 2 + 1 : x + 3;
      return { seq, next, note: 'Two alternating rules govern odd and even steps.' };
    },
  },
  {
    name: 'Prime gaps',
    gen: () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
      const start = Math.floor(Math.random() * 6);
      const seq = primes.slice(start, start + 4);
      const next = primes[start + 4];
      return { seq, next, note: 'Consecutive prime numbers.' };
    },
  },
];

for (const { gen } of seriesGenerators) {
  for (let seed = 0; seed < 12; seed++) {
    const { seq, next, note } = gen(2 + (seed % 5), 1 + (seed % 4));
    add(
      'math',
      'number_series',
      `What comes next? ${seq.join(', ')}, ?`,
      String(next),
      numericDistractors(next),
      note,
    );
  }
}

// ─── Math: Word problems (discount, ratio, rate, fraction) ───

for (let price = 60; price <= 180; price += 30) {
  for (const pct of [15, 20, 25, 30]) {
    const discount = Math.round((price * pct) / 100);
    const sale = price - discount;
    add(
      'math',
      'word_problem',
      `A jacket priced at $${price} is discounted by ${pct}%. What is the sale price?`,
      String(sale),
      numericDistractors(sale),
      `${pct}% of $${price} = $${discount}. Sale price = $${price} − $${discount} = $${sale}.`,
    );
  }
}

for (let a = 2; a <= 6; a++) {
  for (let b = 2; b <= 6; b++) {
    const total = (a + b) * 10;
    const partA = a * 10;
    add(
      'math',
      'word_problem',
      `A ${a}:${b} ratio of vinegar to oil makes ${total} cups of dressing. How many cups are vinegar?`,
      String(partA),
      numericDistractors(partA),
      `Total parts = ${a + b}. Vinegar = ${a}/${a + b} × ${total} = ${partA} cups.`,
    );
  }
}

for (let speed1 = 40; speed1 <= 60; speed1 += 10) {
  for (let speed2 = 50; speed2 <= 70; speed2 += 10) {
    if (speed2 <= speed1) continue;
    const avg = (speed1 + speed2) / 2;
    add(
      'math',
      'word_problem',
      `A train travels ${speed1} mph for 2 hours, then ${speed2} mph for 2 hours. What is its average speed for the trip?`,
      String(avg),
      numericDistractors(avg),
      `Total distance ÷ total time. Same time each leg → average of ${speed1} and ${speed2} = ${avg} mph.`,
    );
  }
}

for (const denom of [3, 4, 5, 6, 8]) {
  for (const num of [1, 2, 3, 5]) {
    if (num >= denom) continue;
    const value = num * 12;
    const whole = (value * denom) / num;
    add(
      'math',
      'arithmetic',
      `If ${num}/${denom} of a number is ${value}, what is the number?`,
      String(whole),
      numericDistractors(whole),
      `If ${num}/${denom}×x = ${value}, then x = ${value} × ${denom}/${num} = ${whole}.`,
    );
  }
}

for (let workers = 3; workers <= 8; workers++) {
  const days = 12;
  const totalWork = workers * days;
  for (const newWorkers of [workers + 2, workers + 4]) {
    const newDays = Math.round(totalWork / newWorkers);
    add(
      'math',
      'word_problem',
      `${workers} workers finish a job in ${days} days. How many days for ${newWorkers} workers at the same rate?`,
      String(newDays),
      numericDistractors(newDays),
      `Total work = ${workers}×${days} = ${totalWork} worker-days. ${newWorkers} workers → ${totalWork}/${newWorkers} ≈ ${newDays} days.`,
    );
  }
}

// ─── Math: Tables / data interpretation ───

for (let q1 = 100; q1 <= 160; q1 += 30) {
  const q2 = q1 + 30;
  const q3 = q2 + 25;
  const q4 = q3 + 35;
  const total = q1 + q2 + q3 + q4;
  add(
    'math',
    'table',
    `Quarterly revenue (in $K): Q1=${q1}, Q2=${q2}, Q3=${q3}, Q4=${q4}. What is total annual revenue?`,
    String(total),
    numericDistractors(total),
    `$${q1}K + $${q2}K + $${q3}K + $${q4}K = $${total}K.`,
  );

  const avg = Math.round(total / 4);
  add(
    'math',
    'table',
    `Quarterly revenue (in $K): Q1=${q1}, Q2=${q2}, Q3=${q3}, Q4=${q4}. What is the average per quarter?`,
    String(avg),
    numericDistractors(avg),
    `Total $${total}K ÷ 4 quarters = $${avg}K average.`,
  );
}

// ─── Math: Ratios & percentages (CCAT speed math) ───

for (let base = 120; base <= 360; base += 60) {
  const pct = 15 + (base % 4) * 5;
  const result = Math.round((base * pct) / 100);
  add(
    'math',
    'percentage',
    `${pct}% of ${base} is closest to which value?`,
    String(result),
    numericDistractors(result),
    `${pct}% of ${base} = ${result}.`,
  );
}

for (let x = 20; x <= 100; x += 10) {
  const y = x * 2.5;
  add(
    'math',
    'arithmetic',
    `If x is 40% of y, and x = ${x}, what is y?`,
    String(y),
    numericDistractors(y),
    `x = 0.4y → y = x/0.4 = ${x}/0.4 = ${y}.`,
  );
}

// ─── Spatial: Shape / rotation series ───

const rotationSeries = [
  ['▲ facing up', '▶ facing right', '▼ facing down', '◀ facing left', 'Shapes rotate 90° clockwise.'],
  ['□ unfilled', '■ filled', '□ unfilled', '■ filled', 'Fill alternates each step.'],
  ['● one dot', '●● two dots', '●●● three dots', '●●●● four dots', 'Dot count increases by one.'],
  ['△ 3 sides', '□ 4 sides', '⬠ 5 sides', '⬡ 6 sides', 'Side count increases by one.'],
  ['small ○', 'medium ○', 'large ○', 'medium ○', 'Size grows then resets in a wave pattern.'],
];

for (const [s1, s2, s3, s4, note] of rotationSeries) {
  for (let offset = 0; offset < 4; offset++) {
    const steps = [s1, s2, s3, s4];
    const seq = steps.slice(offset).concat(steps.slice(0, offset)).slice(0, 4);
    const next = steps[(offset + 4) % 4];
    add(
      'spatial',
      'shape_series',
      `What comes next in the series?\n${seq.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n5. ?`,
      next,
      steps.filter((s) => s !== next),
      note,
    );
  }
}

// ─── Spatial: Matrix patterns ───

const matrixTemplates = [
  ['Row 1: 2, 4, 8. Row 2: 3, 9, 27. Row 3: 4, 16, ?', '64', 'Row 3 squares then cubes: 4, 4², 4³.'],
  ['Row 1: 5, 10, 15. Row 2: 7, 14, 21. Row 3: 9, 18, ?', '27', 'Each row adds its first number repeatedly.'],
  ['Col A: 1, 4, 9. Col B: 2, 5, 10. Col C: 3, 6, 11. Next in Col C?', '12', 'Column C adds 3, then 3, then 1 more each row (+3 pattern with +1 increment).'],
  ['Top-left 1, top-middle 2, top-right 6 (1×2). Bottom-left 2, bottom-middle 4, bottom-right ?', '8', 'Bottom-right = bottom-middle × bottom-left ÷ top-left pattern: 4×2=8.'],
];

for (const [prompt, answer, note] of matrixTemplates) {
  for (let i = 0; i < 15; i++) {
    add('spatial', 'matrix', prompt, answer, numericDistractors(Number(answer)), note);
  }
}

// ─── Spatial: Odd one out (visual attributes) ───

const oddOneSets = [
  [['3 sides', '4 sides', '5 sides', '4 sides'], '3 sides', 'Only shape with 3 sides; others are quadrilaterals or more.'],
  [['All corners 90°', 'All corners 90°', 'All corners 60°', 'All corners 90°'], 'All corners 60°', 'Equilateral triangle angles vs right angles.'],
  [['Clockwise spiral', 'Clockwise spiral', 'Counter-clockwise spiral', 'Clockwise spiral'], 'Counter-clockwise spiral', 'Rotation direction differs.'],
  [['Filled shape', 'Filled shape', 'Outline only', 'Filled shape'], 'Outline only', 'Only unfilled shape.'],
  [['2 lines of symmetry', '2 lines of symmetry', '0 lines of symmetry', '2 lines of symmetry'], '0 lines of symmetry', 'Only shape lacking symmetry listed.'],
  [['Circle', 'Ellipse', 'Square', 'Oval'], 'Square', 'Only shape with straight edges.'],
];

for (const [items, answer, explanation] of oddOneSets) {
  for (let i = 0; i < 12; i++) {
    const shuffled = shuffle(items);
    add(
      'spatial',
      'odd_one_out',
      `Which does NOT belong?\n${shuffled.map((s, idx) => `${String.fromCharCode(65 + idx)}. ${s}`).join('\n')}`,
      answer,
      items.filter((x) => x !== answer),
      explanation,
    );
  }
}

// ─── Spatial: Letter / symbol rotation ───

const letterCycles = ['A', 'C', 'F', 'J', 'O'];
for (let offset = 0; offset < letterCycles.length; offset++) {
  const seq = Array.from({ length: 4 }, (_, i) => letterCycles[(offset + i) % letterCycles.length]);
  const next = letterCycles[(offset + 4) % letterCycles.length];
  add(
    'spatial',
    'shape_series',
    `Letters follow a fixed skip pattern: ${seq.join(', ')}, ?`,
    next,
    letterCycles.filter((l) => l !== next),
    'Letter positions advance by increasing intervals (+2, +3, +4…).',
  );
}

// ─── Verbal: extra syllogism variants ───

const extraSyllogisms = [
  ['Every finished report is archived. Report 42 is archived. Can we conclude Report 42 is finished?', 'No — archived reports may include drafts', ['Yes — all archived reports are finished', 'Report 42 is unfinished', 'Only Report 42 is archived', 'Archiving means finishing'], 'Archiving is necessary for finished reports, but other reports may also be archived.'],
  ['No employees without clearance enter the lab. Sam entered the lab. What must be true?', 'Sam has clearance', ['Sam is an employee', 'Sam lacks clearance', 'Only Sam entered', 'Clearance is not required'], 'If only cleared people enter and Sam entered, Sam must have clearance.'],
  ['All beta testers received the patch. Some beta testers reported bugs. Which must be true?', 'Some patch recipients reported bugs', ['All bug reporters are beta testers', 'No bugs were reported', 'Only non-testers report bugs', 'The patch was not sent'], 'Some beta testers got the patch and reported bugs → some recipients reported bugs.'],
];

for (const [prompt, answer, distractors, explanation] of extraSyllogisms) {
  for (let i = 0; i < 5; i++) {
    add('verbal', 'syllogism', prompt, answer, distractors, explanation);
  }
}

// ─── Dedupe & write ───

const unique = new Map();
for (const q of questions) {
  const key = `${q.question}|${q.options.join('|')}`;
  if (!unique.has(key)) unique.set(key, q);
}

const finalQuestions = [...unique.values()];

// Balance check
const counts = finalQuestions.reduce((acc, q) => {
  acc[q.category] = (acc[q.category] || 0) + 1;
  return acc;
}, {});

const outPath = join(__dirname, '..', 'src', 'data', 'questions.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(finalQuestions, null, 2));
console.log(`Generated ${finalQuestions.length} questions → ${outPath}`);
console.log('By category:', counts);
