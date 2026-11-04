# chouMi

The home of the agents that built Altradits, and the skills they use to design, create and run an automated agency.

Moved here from altradits/altradits on 31 October 2026, so altradits.com can focus on open source, Bitcoin learning and free community tools.

## What's here

| Part | Where |
|---|---|
| Stan, the orchestrator | `lib/stan.js` |
| The agent team and their personas | `lib/agents.js`, `lib/agent.js`, `docs/agents.md` |
| Department workers and QA | `lib/workers.js`, `lib/qa.js`, `data/qa-experts.js` |
| Leads, proposals and approvals | `lib/crm.js`, `lib/ops.js` |
| Marketing, social and warm-ups | `lib/marketing.js`, `lib/social.js`, `lib/warmup.js`, `data/marketing*.js` |
| Follow-ups and the mailing list | `lib/followups.js`, `lib/subscribers.js`, `data/templates.js` |
| Continual learning | `lib/learning.js` |
| Career agent and job hunt | `lib/career.js`, `lib/jobs.js`, `apply-extension/` |
| Brand and service catalog | `data/brand.js`, `data/catalog.js`, `data/playbooks.js` |
| Agency pages | `va.html`, `products.html`, `portal.html`, `proposal.html`, `team.html`, `join.html`, `hunt.html`, `collect.html` |
| Security reviewer agent | `.claude/agents/security-reviewer.md` |

## Status

This is a snapshot of the agency side: the team, the departments, the marketing
engine, the career agent and the pages they serve. It is not deployed anywhere.

- The Ye₿ente wallet code stayed in altradits; `lib/ywallet.js` here is a stub
  that says so, and the wallet's own tests stayed with it.
- The test suite runs (`npm test`) and CI runs it on every pull request and
  every push to main, with dependency audits.
- No deploy script was copied: there is no live site to deploy to. The server
  settings live in altradits, and the rebuild guide lives in private notes.
- Every commit on main's first-parent line is signed; CI refuses anything else.

## Licence

MIT. See `LICENSE`.
