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

function makeQuestion(id, category, type, question, correct, distractors, explanation) {
  const options = shuffle([correct, ...distractors.slice(0, 4)]);
  return {
    id,
    category,
    type,
    question,
    options,
    correctIndex: options.indexOf(correct),
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

const analogyPairs = [
  ['BIRD', 'NEST', 'BEE', 'HIVE', 'Birds live in nests; bees live in hives.'],
  ['PAINTER', 'BRUSH', 'WRITER', 'PEN', 'A painter uses a brush; a writer uses a pen.'],
  ['DOCTOR', 'HOSPITAL', 'TEACHER', 'SCHOOL', 'Doctors work in hospitals; teachers work in schools.'],
  ['FISH', 'WATER', 'BIRD', 'AIR', 'Fish live in water; birds live in air.'],
  ['KEY', 'LOCK', 'PASSWORD', 'ACCOUNT', 'A key opens a lock; a password opens an account.'],
  ['AUTHOR', 'BOOK', 'COMPOSER', 'SYMPHONY', 'An author creates a book; a composer creates a symphony.'],
  ['CATERPILLAR', 'BUTTERFLY', 'TADPOLE', 'FROG', 'A caterpillar becomes a butterfly; a tadpole becomes a frog.'],
  ['LENS', 'CAMERA', 'ENGINE', 'CAR', 'A lens is part of a camera; an engine is part of a car.'],
  ['SHEEP', 'FLOCK', 'WOLF', 'PACK', 'Sheep gather in flocks; wolves gather in packs.'],
  ['THERMOMETER', 'TEMPERATURE', 'SCALE', 'WEIGHT', 'A thermometer measures temperature; a scale measures weight.'],
  ['ARCHITECT', 'BLUEPRINT', 'CHEF', 'RECIPE', 'An architect follows a blueprint; a chef follows a recipe.'],
  ['GLOVE', 'HAND', 'SOCK', 'FOOT', 'A glove covers a hand; a sock covers a foot.'],
  ['PUPIL', 'TEACHER', 'PATIENT', 'DOCTOR', 'A pupil learns from a teacher; a patient is treated by a doctor.'],
  ['SEED', 'PLANT', 'EGG', 'CHICK', 'A seed grows into a plant; an egg hatches into a chick.'],
  ['MAP', 'GEOGRAPHER', 'SCORE', 'COMPOSER', 'A map is used by a geographer; a score is used by a composer.'],
  ['SWORD', 'KNIGHT', 'WAND', 'WIZARD', 'A sword is a knight\'s tool; a wand is a wizard\'s tool.'],
  ['CLOCK', 'TIME', 'RULER', 'LENGTH', 'A clock measures time; a ruler measures length.'],
  ['HIVE', 'BEES', 'DEN', 'LIONS', 'A hive houses bees; a den houses lions.'],
  ['PAINTER', 'CANVAS', 'SCULPTOR', 'MARBLE', 'A painter works on canvas; a sculptor works on marble.'],
  ['LIBRARY', 'BOOKS', 'MUSEUM', 'ARTIFACTS', 'A library holds books; a museum holds artifacts.'],
];

for (const [a, b, c, answer, explanation] of analogyPairs) {
  add(
    'verbal',
    'analogy',
    `${a} is to ${b} as ${c} is to ___`,
    answer,
    ['TEMPLE', 'RIVER', 'STONE', 'WINDOW', 'GARDEN', 'MIRROR', 'BRIDGE'],
    explanation,
  );
}

const antonymPairs = [
  ['ABUNDANT', 'SCARCE', 'Abundant means plentiful; scarce means in short supply.'],
  ['BRAVERY', 'COWARDICE', 'Bravery is courage; cowardice is lack of courage.'],
  ['EXPAND', 'SHRINK', 'Expand means to grow larger; shrink means to grow smaller.'],
  ['GENEROUS', 'STINGY', 'Generous means giving freely; stingy means unwilling to give.'],
  ['HASTY', 'DELIBERATE', 'Hasty means rushed; deliberate means careful and planned.'],
  ['TRANSPARENT', 'OPAQUE', 'Transparent lets light through; opaque blocks it.'],
  ['VICTORY', 'DEFEAT', 'Victory is winning; defeat is losing.'],
  ['ANCIENT', 'MODERN', 'Ancient refers to the distant past; modern refers to the present era.'],
  ['CONCEAL', 'REVEAL', 'Conceal means to hide; reveal means to show.'],
  ['FORTIFY', 'WEAKEN', 'Fortify means to strengthen; weaken means to reduce strength.'],
  ['HARMONY', 'DISCORD', 'Harmony is agreement; discord is conflict.'],
  ['INCLUDE', 'EXCLUDE', 'Include means to add in; exclude means to leave out.'],
  ['LITERAL', 'FIGURATIVE', 'Literal means exact; figurative means symbolic.'],
  ['MAXIMUM', 'MINIMUM', 'Maximum is the greatest amount; minimum is the least.'],
  ['NOVEL', 'FAMILIAR', 'Novel means new and unfamiliar; familiar means well known.'],
  ['OPTIMISTIC', 'PESSIMISTIC', 'Optimistic expects good outcomes; pessimistic expects bad ones.'],
  ['PERMANENT', 'TEMPORARY', 'Permanent lasts forever; temporary lasts for a limited time.'],
  ['PROSPERITY', 'POVERTY', 'Prosperity is wealth; poverty is lack of resources.'],
  ['RIGID', 'FLEXIBLE', 'Rigid means stiff and unbending; flexible means adaptable.'],
  ['VERBOSE', 'CONCISE', 'Verbose uses many words; concise uses few.'],
];

for (const [word, answer, explanation] of antonymPairs) {
  add(
    'verbal',
    'antonym',
    `Choose the word most nearly OPPOSITE to: ${word}`,
    answer,
    ['SIMILAR', 'IDENTICAL', 'RELATED', 'COMPARABLE', 'ALIGNED', 'MATCHING'],
    explanation,
  );
}

const sentenceTemplates = [
  ['The scientist published her findings after months of careful ______.', 'RESEARCH', ['VACATION', 'NOISE', 'HASTE', 'LUCK'], 'Research fits the context of careful scientific work.'],
  ['Despite the heavy rain, the outdoor concert was not ______.', 'CANCELED', ['ENJOYED', 'LOUD', 'SHORT', 'FREE'], 'Rain might cause cancellation, but "despite" means it did not happen.'],
  ['The new policy was designed to ______ workplace safety.', 'IMPROVE', ['IGNORE', 'REDUCE', 'COMPLICATE', 'HIDE'], 'Policies about safety typically aim to improve conditions.'],
  ['Her explanation was so ______ that everyone understood immediately.', 'CLEAR', ['CONFUSING', 'VAGUE', 'LENGTHY', 'RANDOM'], 'Understanding immediately suggests clarity.'],
  ['The antique vase was extremely ______ and handled with great care.', 'FRAGILE', ['STURDY', 'COMMON', 'HEAVY', 'CHEAP'], 'Something handled with care is fragile.'],
  ['After the long hike, we were too ______ to continue.', 'EXHAUSTED', ['ENERGETIC', 'EAGER', 'RESTED', 'EXCITED'], 'A long hike leads to exhaustion.'],
  ['The witness gave a ______ account of what happened.', 'DETAILED', ['BRIEF', 'FALSE', 'SILENT', 'RANDOM'], 'Witness accounts are often detailed.'],
  ['The manager praised the team for their ______ effort on the project.', 'DILIGENT', ['LAZY', 'CARELESS', 'MINIMAL', 'DELAYED'], 'Praise suggests diligent effort.'],
  ['The instructions were ______ and easy to follow.', 'STRAIGHTFORWARD', ['COMPLEX', 'HIDDEN', 'CONFLICTING', 'OUTDATED'], 'Easy to follow means straightforward.'],
  ['The noise from construction made it difficult to ______.', 'CONCENTRATE', ['SLEEP', 'EAT', 'DRIVE', 'SING'], 'Noise most commonly disrupts concentration.'],
];

for (const [sentence, answer, distractors, explanation] of sentenceTemplates) {
  add('verbal', 'sentence_completion', sentence, answer, distractors, explanation);
}

const syllogisms = [
  ['All squares are rectangles. All rectangles have four sides. Therefore, all squares have four sides.', 'TRUE', ['FALSE', 'CANNOT DETERMINE'], 'If all squares are rectangles and all rectangles have four sides, squares must have four sides.'],
  ['Some cats are black. All black animals are nocturnal. Therefore, all cats are nocturnal.', 'FALSE', ['TRUE', 'CANNOT DETERMINE'], 'Only some cats are black, so we cannot conclude all cats are nocturnal.'],
  ['No reptiles are mammals. All snakes are reptiles. Therefore, no snakes are mammals.', 'TRUE', ['FALSE', 'CANNOT DETERMINE'], 'Snakes are reptiles, and no reptiles are mammals, so no snakes are mammals.'],
  ['All doctors are professionals. Some professionals are teachers. Therefore, all doctors are teachers.', 'FALSE', ['TRUE', 'CANNOT DETERMINE'], 'Some professionals being teachers does not mean all doctors are teachers.'],
  ['If it rains, the ground gets wet. It is raining. Therefore, the ground is wet.', 'TRUE', ['FALSE', 'CANNOT DETERMINE'], 'This is a valid conditional argument.'],
  ['All roses are flowers. Some flowers fade quickly. Therefore, all roses fade quickly.', 'FALSE', ['TRUE', 'CANNOT DETERMINE'], 'Some flowers fading does not mean all roses do.'],
  ['No students are absent. John is a student. Therefore, John is not absent.', 'TRUE', ['FALSE', 'CANNOT DETERMINE'], 'If no students are absent, John cannot be absent.'],
  ['Some books are novels. All novels have chapters. Therefore, some books have chapters.', 'TRUE', ['FALSE', 'CANNOT DETERMINE'], 'Novels have chapters, and some books are novels, so some books have chapters.'],
];

for (const [prompt, answer, distractors, explanation] of syllogisms) {
  add('verbal', 'syllogism', prompt, answer, distractors, explanation);
}

for (let step = 2; step <= 12; step++) {
  for (let start = 1; start <= 8; start++) {
    const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
    const next = start + 5 * step;
    add(
      'math',
      'number_series',
      `${seq.join(', ')}, ?`,
      String(next),
      [String(next + 1), String(next - 1), String(next + step), String(next - step), String(next + 2)],
      `Add ${step} each time.`,
    );
  }
}

for (let ratio = 2; ratio <= 5; ratio++) {
  for (let start = 1; start <= 6; start++) {
    const seq = Array.from({ length: 5 }, (_, i) => start * ratio ** i);
    const next = start * ratio ** 5;
    add(
      'math',
      'number_series',
      `${seq.join(', ')}, ?`,
      String(next),
      [String(next + ratio), String(next - ratio), String(next * ratio), String(next / ratio), String(next + 1)],
      `Multiply by ${ratio} each time.`,
    );
  }
}

for (let a = 2; a <= 9; a++) {
  for (let b = 2; b <= 9; b++) {
    const seq = [];
    for (let i = 0; i < 5; i++) {
      seq.push(i % 2 === 0 ? a + i : b + i);
    }
    const next = 5 % 2 === 0 ? a + 5 : b + 5;
    add(
      'math',
      'number_series',
      `${seq.join(', ')}, ?`,
      String(next),
      [String(next + 1), String(next - 1), String(a + b), String(a * b), String(next + 2)],
      'Two alternating patterns are combined.',
    );
  }
}

for (let base = 10; base <= 500; base += 17) {
  for (const pct of [10, 15, 20, 25, 30, 40, 50]) {
    const answer = Math.round((base * pct) / 100);
    add(
      'math',
      'percentage',
      `What is ${pct}% of ${base}?`,
      String(answer),
      [String(answer + 5), String(answer - 5), String(answer + 10), String(answer - 10), String(Math.round(base / pct))],
      `${pct}% of ${base} = (${pct}/100) × ${base} = ${answer}.`,
    );
  }
}

for (let a = 2; a <= 12; a++) {
  for (let b = 2; b <= 12; b++) {
    const product = a * b;
    add(
      'math',
      'arithmetic',
      `${a} × ${b} = ?`,
      String(product),
      [String(product + 1), String(product - 1), String(product + a), String(product - b), String(a + b)],
      `${a} multiplied by ${b} equals ${product}.`,
    );
  }
}

for (let total = 20; total <= 200; total += 13) {
  for (const pct of [20, 25, 40, 50]) {
    const part = Math.round((total * pct) / 100);
    add(
      'math',
      'word_problem',
      `A team scored ${part} points, which is ${pct}% of their total possible score. What is the total possible score?`,
      String(total),
      [String(total + 10), String(total - 10), String(part * 2), String(part + pct), String(total + pct)],
      `If ${part} is ${pct}% of total, total = ${part} ÷ (${pct}/100) = ${total}.`,
    );
  }
}

for (let speed = 30; speed <= 70; speed += 10) {
  for (const hours of [2, 3, 4, 5]) {
    const distance = speed * hours;
    add(
      'math',
      'word_problem',
      `A car travels at ${speed} mph for ${hours} hours. How many miles does it travel?`,
      String(distance),
      [String(distance + speed), String(distance - speed), String(speed + hours), String(distance / 2), String(distance + hours)],
      `Distance = speed × time = ${speed} × ${hours} = ${distance} miles.`,
    );
  }
}

const shapeCycles = [
  [['■', '●', '▲'], 'The pattern repeats: square, circle, triangle.'],
  [['○', '□', '△'], 'The pattern repeats: circle, square, triangle outline.'],
  [['↑', '→', '↓', '←'], 'The pattern rotates through directions.'],
  [['1', '2', '4', '8'], 'Each value doubles (shown as a numeric shape sequence).'],
];

for (const [shapes, note] of shapeCycles) {
  for (let offset = 0; offset < 6; offset++) {
    const seq = Array.from({ length: 5 }, (_, i) => shapes[(i + offset) % shapes.length]);
    const next = shapes[(5 + offset) % shapes.length];
    add(
      'spatial',
      'shape_series',
      `What comes next? ${seq.join('  ')}  ?`,
      next,
      shapes.filter((s) => s !== next).concat(['★', '◆']),
      note,
    );
  }
}

const oddOneSets = [
  [['APPLE', 'BANANA', 'CARROT', 'GRAPE'], 'CARROT', 'Carrot is a vegetable; the others are fruits.'],
  [['DOG', 'CAT', 'SNAKE', 'HAMSTER'], 'SNAKE', 'Snake is a reptile; the others are mammals.'],
  [['RED', 'BLUE', 'GREEN', 'TABLE'], 'TABLE', 'Table is not a color.'],
  [['PIANO', 'GUITAR', 'VIOLIN', 'PAINTING'], 'PAINTING', 'Painting is visual art; the others are musical instruments.'],
  [['MONDAY', 'TUESDAY', 'JANUARY', 'FRIDAY'], 'JANUARY', 'January is a month; the others are weekdays.'],
  [['CIRCLE', 'SQUARE', 'TRIANGLE', 'HAPPY'], 'HAPPY', 'Happy is not a shape.'],
  [['OXYGEN', 'NITROGEN', 'WATER', 'HELIUM'], 'WATER', 'Water is a compound; the others are elements.'],
  [['RUN', 'JUMP', 'SWIM', 'CHAIR'], 'CHAIR', 'Chair is a noun; the others are verbs.'],
  [['ADD', 'SUBTRACT', 'MULTIPLY', 'NUMBER'], 'NUMBER', 'Number is not an operation.'],
  [['EAGLE', 'SPARROW', 'PENGUIN', 'ROBIN'], 'PENGUIN', 'Penguin cannot fly; the others are flying birds.'],
];

for (const [items, answer, explanation] of oddOneSets) {
  for (let i = 0; i < 3; i++) {
    const shuffled = shuffle(items);
    add(
      'spatial',
      'odd_one_out',
      `Which does NOT belong? ${shuffled.join(', ')}`,
      answer,
      items.filter((x) => x !== answer),
      explanation,
    );
  }
}

const matrixPatterns = [
  ['Top row: 2, 4, 6. Bottom row: 3, 6, 9. What comes next in the bottom row after 9?', '12', ['10', '11', '15', '18'], 'Bottom row increases by 3; 9 + 3 = 12.'],
  ['Top row: 1, 4, 9. Bottom row: 2, 5, 10. Next in top row after 9?', '16', ['11', '12', '14', '18'], 'Top row follows square numbers: 4² = 16.'],
  ['Column A: 5, 10, 15. Column B: 7, 14, 21. Next in Column A?', '20', ['18', '22', '25', '30'], 'Column A adds 5 each time.'],
  ['Row pattern: (1,2), (3,6), (5,10). What is the second number in the next pair?', '14', ['12', '13', '16', '18'], 'Second number doubles the pattern: 7 → 14.'],
];

for (const [prompt, answer, distractors, explanation] of matrixPatterns) {
  for (let i = 0; i < 5; i++) {
    add('spatial', 'matrix', prompt, answer, distractors, explanation);
  }
}

const unique = new Map();
for (const q of questions) {
  const key = `${q.question}|${q.options.join('|')}`;
  if (!unique.has(key)) unique.set(key, q);
}

const finalQuestions = [...unique.values()];
const outPath = join(__dirname, '..', 'src', 'data', 'questions.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(finalQuestions, null, 2));
console.log(`Generated ${finalQuestions.length} questions → ${outPath}`);
