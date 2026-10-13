# Project brief — one editorial line

Eight questions, answered out loud, so every project tells its story the same
way. Full version, with the voice rules and the targets:
**[Project brief — one editorial line](https://claude.ai/code/artifact/d3e37d2f-fb6a-483f-b231-7cd3f10e33c6)**

Record the answers, do not write them. The problem is never too little to say,
it is too much, and a time budget out loud does the cutting that a blank page
will not.

| # | Question | Budget | Fills |
|---|---|---|---|
| 1 | Someone at a party asks what it is. What do you say? | 1 sentence | `description` |
| 2 | What was annoying you before this existed? | 30 sec | `why` |
| 3 | What turned out to be hard that you did not expect? | 45 sec | `problem` |
| 4 | **Three calls that could have gone the other way.** What you chose, why, and what it cost. | 1 min each | `decisions` |
| 5 | Five things true about it a screenshot would not tell me. | 1 min | `highlights` |
| 6 | What does it run on? | 20 sec | `stack` |
| 7 | Which part was yours? | 20 sec | `role` |
| 8 | What would you do differently now? | 30 sec | the closing line |

Three more for work done for an employer: where yours ends and the team's
begins, what changed because of it, and what can actually be published.

## Why question 4 carries it

Eleven of the twenty-four records have a decision log, and those eleven are the
ones that read as work rather than as a list of things that exist.

Each call has three parts and the third is what makes it credible: what you
chose, why, and **what it cost**. Without the cost it reads as marketing. Pick
the arguable ones — not "I used TypeScript", but the ones where a competent
person could have gone the other way.

## What finished looks like

Measured from the records already in `src/data/projects.ts`, so these are the
house numbers rather than a style guide's.

| Field | Target |
|---|---|
| `description` | 110–180 characters, one sentence (average is 109) |
| `why` | 165–245 characters, two sentences |
| `highlights` | 5 to 7 (Yggdrasil's 18 is an outlier, not a target) |
| `decisions` | 3, each with its cost |
| `problem` / `solution` | only if there was one — 1 of 24 has them |

A record is finished when a stranger reads it in forty seconds and comes away
knowing what the thing is, what was hard, and one call you made that they would
not have. Listing technologies is not finished: everything on the site runs on
something, so a stack alone separates nothing.

See also [project-assets.md](project-assets.md) for what images a project needs.
