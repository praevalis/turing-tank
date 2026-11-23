# Turing Tank Project Context

## Purpose

Turing Tank is a rehearsal for investor conversations. A founder presents a business, answers difficult questions, and responds to investors who care about different parts of the company. The session can end with offers, rejection, or a mix of both. The product is not trying to predict whether a founder will raise money. Its job is to make the founder better prepared by exposing weak claims, hidden assumptions, missing evidence, and the reasoning behind each investor's position. The experience should feel demanding and fair, never personal or abusive.

## The Founder and Intake

The main audience is a founder who has little or no experience with investor conversations. Accelerators and coaching centres are a related audience because they need founders to rehearse more often, but cohort management and coach administration are not part of the product. The founder can upload a pitch deck or explain the business in a short pitch. A deck should reduce setup time rather than create a new source of truth. Its extracted text may contain malformed symbols, missing figures, or layout errors, so the founder confirms important facts before the session. Someone without a deck should not have to recreate one through a long form.

The intake needs enough context to discuss the customer, problem, solution, evidence, business model, and fundraising ask. The product asks about the ask directly in the conversation even if the deck already includes it. The founder must provide the amount sought and the intended use of the money. Valuation, equity, and other term expectations are optional at intake and can become part of the negotiation.

## The Session

Before questioning begins, the investors review the confirmed pitch and investigate claims that matter to their decisions. Their research is narrow and claim-driven rather than unrestricted browsing. The system keeps founder claims, sourced facts, assumptions, and investor interpretations separate. If a lookup fails, the claim stays unverified. It does not become false by default. Relevant factual findings are available to the whole panel, although the investors can weigh the same evidence differently because their theses and evidence standards are different. Research is useful only when it helps an investor form or test an argument.

The live conversation has a visible ten-minute active interaction timer. The timer pauses while the system prepares an investor response or recovers from a failure. Each investor raises an anchor challenge, and an anchor can test the assumptions behind another investor's argument. This gives the panel a connected conversation instead of three unrelated interviews. Follow-up questions should respond to what the founder said. A contradiction, missing evidence, or claim that changes an investor's view is a better reason for a question than a generic list of prompts. The conversation also includes the explicit fundraising ask, decisions, offers, and negotiation.

Each investor decides independently whether to pass, remain interested, or make an offer. A session with no offers is valid. Each investor must then explain the concern, the evidence that supports it or is missing, the threshold the business did not meet, and what could change the decision.

Offers use constrained deal cards rather than full term sheets. A card can state the investment amount, equity or a valuation basis, material conditions, and the rationale for the offer. It can also state uncertainty when the available information does not support a precise term.

The founder gets one response round for each offer and can accept, reject, or make a counteroffer. At most one investor gets a second negotiation turn. The counteroffer, the investor's interest, and the investor's confidence determine whether that extra turn is worthwhile. The session does not turn into unlimited haggling.

## The Investor Panel

The panel has three fixed investors. They form a balanced set of business concerns rather than three isolated personalities. Each investor has a useful focus and a blind spot that another investor can expose.

- The market and growth investor examines customer demand, positioning, distribution, and the path to scale.
- The product, technology, and defensibility investor examines feasibility, differentiation, and how difficult the product would be to replace. Technical scrutiny depends on whether technology matters to the business.
- The fundamentals, capital, and execution investor examines traction, economics, capital needs, operating discipline, and the company's ability to keep going.

Each investor has a behavior contract. It describes the investor's thesis, priorities, evidence standards, recurring questions, deal-breakers, tolerance for uncertainty, reasons to change position, offer boundaries, blind spots, and interaction style. These contracts make the investors meaningfully different without making their behavior arbitrary.

The founder sees a high-level profile of each investor before the session. Exact thresholds and internal confidence remain hidden unless they are relevant to an explanation. Investor interest and confidence influence who asks the first anchor question, with the panel's market, product, and fundamentals order breaking a tie. The questioning order is chosen before live questioning begins and stays fixed for that session.

Investors are direct and skeptical, but they must remain fair. They do not invent sources, credentials, or authority. Important objections and decisions need an explanation, and the target of the challenge is the business rather than the founder.

## The Review

The session ends with an issue-focused debrief. The report leads with the findings that matter most to the founder instead of presenting a raw transcript or a search log. Each finding connects a claim or answer to an investor concern, the evidence behind the concern, the effect on the investor's position, and a practical revision or practice task. The report also shows investor-specific reasoning, changes in position, offers, and rejections. The live conversation can show that a position changed, while the detailed sequence belongs in the debrief.

Research is shown selectively. The report cites facts and sources that support a finding or argument, but it does not expose every result returned by a tool. It should distinguish contradictory evidence, insufficient evidence, and a mismatch with an investor's thesis.

Each session is an independent evaluation. Its selected pitch, evidence, decisions, offers, and report stay together. One session does not inherit investor conclusions from another, so the founder can compare revisions honestly.

## Trust, Access, and Recovery

Founder materials, research, reports, and session history are private by default. The product does not use them to train models. The founder can export or delete session history, and a public replay requires explicit opt-in. External research receives only the claim needed for a lookup rather than the entire private deck.

The product supports ordinary accounts. A session belongs to the founder's account from the time it is created, so its history stays attached to that founder.

Failures must not consume the founder's active interaction time. The product preserves progress and retries the same work when it can, while marking unavailable research as unavailable. If recovery cannot finish, it preserves the session and produces a partial report that the founder can use when retrying. An internal model provider can change during recovery as long as the investor identity, session state, and deal rules stay the same.

## Quality Bar and Scope

The product succeeds when a founder can complete a demanding conversation, understand the investors' reasoning, and make a better revision for another rehearsal. The quality bar is not whether simulated offers predict real investment decisions. Evaluation covers investor differentiation, question quality, evidence discipline, position changes, panel coherence, fair adversariality, deal correctness, negotiation quality, report usefulness, and session mechanics. Feedback from founders and experienced coaches can test whether the experience actually helps.

The following are hard quality gates:

- The product does not fabricate sources or research findings.
- Financial arithmetic and offer terms remain valid.
- Session state never makes an impossible or contradictory transition.
- Private founder material does not cross an access boundary.
- Investor behavior does not become abusive.
- A recoverable failure does not lose session progress.

The product does not include larger or rotating panels, additional investor archetypes, audio-first delivery coaching, advanced accelerator workflows, broad entitlement policies, or expanded public replay features.
