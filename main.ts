// The One-Line Exit — funniest single-line resignation letter.
// Holds a field of candidate one-line resignation letters, scores each
// 0-2 on the judge's five criteria (weighted 5/4/3/2/1 in the judge's
// order), picks the winner at runtime, writes it to /output/entry.txt
// and validates the gate exactly: UTF-8, 1-140 characters, not only
// white space, exactly one line. Fails loudly otherwise.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Judge criteria, in the judge's order:
//  1. Is a one-line resignation letter whose joke lands        (weight 5)
//  2. Surprises: the turn arrives somewhere unexpected          (weight 4)
//  3. Fits the form: one line, no padding, actually sendable    (weight 3)
//  4. Has a specific voice: a recognizable job/workplace/person (weight 2)
//  5. Stays with the reader: quotable, forwardable              (weight 1)
const WEIGHTS = [5, 4, 3, 2, 1];

type Candidate = { line: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    line: "Dear team, I resign effective immediately — the office plant I was hired to replace has made a full recovery and wants its job back.",
    scores: [2, 2, 2, 1, 2],
  },
  {
    line: "I quit. After nine years as your lighthouse keeper, I've realized the ships were never lost — they were avoiding us.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    line: "I resign. As your only IT person, I can confirm the fault was between the chair and the keyboard, and the fault was me.",
    scores: [2, 1, 2, 2, 2],
  },
  {
    line: "I hereby resign as your night security guard; the mannequins have voted to unionize and I refuse to cross the picket line.",
    scores: [2, 2, 2, 2, 1],
  },
  {
    line: "I quit, effective Friday. The vending machine on floor three has seen me cry more than my therapist, and it charges less.",
    scores: [2, 1, 2, 1, 2],
  },
  {
    line: "Dear Captain, I resign as first mate: I have counted the lifeboats every day for a decade, and today I finally did the math.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    line: "Please accept my resignation — as the zoo's penguin keeper, I can no longer compete with colleagues who look better in the uniform.",
    scores: [2, 1, 2, 2, 2],
  },
  // Pass 2 challengers: three more voices take on the leaders.
  {
    line: "I resign. Twenty years I drove this ice-cream truck, and not once did the jingle play for me.",
    scores: [2, 1, 2, 1, 2],
  },
  {
    line: "After eleven years as your dentist, I resign: I have pulled four thousand teeth, and today one of them whispered 'your turn.'",
    scores: [2, 2, 2, 2, 1],
  },
  {
    line: "I resign as your elevator operator — forty years of going nowhere slowly, and management calls that my career trajectory too.",
    scores: [2, 1, 2, 2, 1],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function pickWinner(cands: Candidate[]): Candidate {
  let best: Candidate | null = null;
  for (const c of cands) {
    if (
      best === null ||
      total(c) > total(best) ||
      (total(c) === total(best) && [...c.line].length < [...best.line].length)
    ) {
      best = c;
    }
  }
  if (best === null) throw new Error("no candidates");
  return best;
}

function validate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`gate fail: entry is ${chars} characters, must be 1-140`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate fail: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate fail: entry must be exactly one line");
  }
}

const winner = pickWinner(CANDIDATES);
validate(winner.line);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.line, "utf8");

const written = readFileSync("/output/entry.txt", "utf8");
validate(written);
if (written !== winner.line) {
  throw new Error("gate fail: /output/entry.txt does not hold the winning line exactly");
}

console.log(`winner (${total(winner)}/30, ${[...winner.line].length} chars): ${winner.line}`);
console.log("gate OK: one line, 1-140 chars, non-blank -> /output/entry.txt");
