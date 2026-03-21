# ETEST Compass — Official PRD

**Version:** v1.1
**Scope:** US universities only
**Positioning:** AI-powered university intelligence, profile structuring, expectation-setting, counselor handoff, AI-assisted booking, and a multi-agent school-data pipeline powered by Bright Data and Codex.

## 1. Product summary

ETEST Compass is an AI-powered US university intelligence and expectation-setting platform for Vietnamese students. It combines a structured student profile builder, a recommendation engine with **Current Outlook** and **Projected Outlook**, budget-aware school ranking, counselor handoff, and AI-assisted booking.

The school-data layer is maintained by a **multi-agent pipeline**. The orchestration layer uses the **OpenAI Agents SDK**; the web-access layer uses **Bright Data** for reliable access to official university pages; and **Codex** acts as the repair and maintenance agent when extraction logic breaks or page structures change.

The product exists to support ETEST’s premium consulting model, not replace it. The app gives ETEST a stronger first diagnostic, clearer transparency, and faster lead qualification, while counselors keep ownership of the premium human work.

## 2. Product principles

### 2.1 Human-in-the-loop, always

The system may structure profiles, explain requirements, estimate fit, and recommend next steps. It may not replace counselor judgment on narrative strategy, essay positioning, interview prep, final school-list curation, or profile improvement plans.

### 2.2 No hard exclusions

The engine must **not** hard-remove a school solely because:

* a test is missing
* a deadline is tight
* a document is incomplete
* the school is above budget
* the student is early-stage and underdeveloped

Instead, the engine must show:

* current competitiveness
* current readiness
* deadline pressure
* affordability fit
* required actions
* counselor intervention value

### 2.3 US-only, holistic logic

The analyzer must reflect US admissions as a holistic process using both hard factors and soft factors. It cannot behave like a pure threshold engine. GPA, rigor, trend, test profile, activities, impact, leadership, spike, and essay potential all matter.

### 2.4 Budget is part of fit, not an afterthought

Recommendation quality must incorporate:

* tuition
* estimated cost of attendance
* living cost
* scholarship availability signal
* family budget
* willingness to stretch
* scholarship dependence

### 2.5 Two official outlooks

Every recommendation must include:

* **Current Outlook**
* **Projected Outlook**

These are mandatory outputs, not optional enhancements.

### 2.6 Catalog-first, agent-maintained architecture

User-facing recommendation, chat, and counselor handoff must read from a **validated school catalog**, not from raw live scraping on every query. Live scraping is reserved for scheduled refreshes, manual refreshes, and repair workflows.

## 3. Target users

### Primary

US-bound Vietnamese student prospects in:

* Grade 9–10
* Grade 11
* Grade 12 / gap year

### Secondary

Parents who want:

* cost visibility
* trust
* transparency
* next-step clarity

### Internal

ETEST counselors who want:

* structured lead packets
* recommendations with rationale
* timing and affordability flags
* faster consult prep

## 4. Goals

### Primary goals

* Turn messy student input into a structured admissions profile
* Recommend US schools in Reach / Target / Safety tiers
* Factor admissions, timing, and budget into recommendations
* Set expectations without prematurely ruling out schools
* Convert qualified users into booked counselor consultations

### Secondary goals

* Reduce counselor research time
* Improve transparency and trust with parents
* Give ETEST a data-backed pre-consultation diagnostic
* Create a scalable school intelligence layer for future use

### Non-goals

* Full CRM replacement
* Full essay-writing platform
* Visa operations platform
* Guaranteed admissions predictions
* Replacing premium counselor strategy

## 5. Core user flow

1. Student starts onboarding
2. Student enters grade, intended majors, academic profile, tests, activities, timing, and budget
3. AI Profile Builder converts raw input into a structured profile
4. School Data Agent pulls normalized US school data
5. Recommendation Engine scores schools on admission fit, timing/readiness, affordability, and strategic fit
6. Student sees Reach / Target / Safety recommendations
7. Each school card shows Current Outlook, Projected Outlook, budget fit, cost, deadline pressure, and key blockers
8. Student asks follow-up questions in chat
9. AI offers counselor handoff
10. Profile and recommendation packet are sent to mock ETEST API
11. Student books a consultation in chat

## 6. Functional requirements

## 6.1 University Data Agent

### Purpose

Maintain a structured, source-backed catalog of US university data for recommendations, chat, and counselor handoff.

### MVP requirements

The agentic pipeline must produce, for each school:

* school_name
* state
* city
* official_admissions_url
* rounds
* deadlines_by_round
* english_requirements
* test_policy
* required_materials
* tuition_annual_usd
* estimated_cost_of_attendance_usd
* living_cost_estimate_usd
* scholarship_availability_flag
* scholarship_notes
* source_urls
* extracted_at
* last_verified_at
* extraction_confidence
* validation_status

### Source-of-truth policy

Each published field must store:

* value
* source URL
* extraction timestamp
* last verified timestamp
* extraction method
* confidence score

### Refresh policy

The pipeline must support:

* scheduled refresh
* per-school manual refresh
* change-triggered refresh
* repair-triggered refresh after parser failure

### Codex repair triggers

Codex must be invoked when:

* a required field disappears
* extraction confidence falls below threshold
* schema validation fails
* page layout drift breaks the current parser
* conflicting values are detected between official school pages
* regression tests fail after a school-site update

## 6.1A Multi-Agent School Data Pipeline

### Purpose

Maintain a fresh, source-backed, repairable catalog of US university admissions and cost data without putting fragile scraping workflows directly in front of end users.

### Architecture decision

The system will use **Option B**:

* Planner Agent
* Fetcher Agent
* Extractor Agent
* Validator Agent
* Codex Repair Agent
* Publish/Review Agent

### Agent responsibilities

#### 1. Planner Agent

Maintains a source registry for each school and decides which official pages should be scraped.

Outputs:

* canonical admissions URL
* tuition / cost URL
* financial aid / scholarship URL
* application round / deadline URL
* fetch priority
* refresh cadence

Rules:

* official university pages are preferred
* third-party pages are fallback only and must be flagged
* each school record must preserve source provenance

#### 2. Fetcher Agent

Retrieves public web data from school sources.

Tooling:

* use **Bright Data Web Scraper API** for known, stable official URLs and scheduled extraction jobs
* use **Bright Data Browser API** when a school page requires full rendering, user-like interaction, session handling, or more advanced unblocking

#### 3. Extractor Agent

Transforms fetched content into the ETEST school schema.

Responsibilities:

* map page content into structured fields
* normalize deadline formats
* normalize tuition and cost fields to USD where needed
* extract policy text for English tests, SAT/ACT, required materials, and aid notes
* attach source URLs and extraction timestamps to every field

#### 4. Validator Agent

Checks whether extracted records are safe to publish.

Responsibilities:

* schema validation
* required-field completeness checks
* confidence scoring
* contradiction detection across school pages
* freshness checks
* unit normalization checks
* official-source policy enforcement

Outputs:

* publishable
* publishable with warning
* repair needed
* manual review needed

#### 5. Codex Repair Agent

Repairs extraction logic when school pages drift or validations fail.

Inputs:

* failing source page
* current extractor/parser logic
* validation error report
* target schema
* existing tests

Outputs:

* parser/config patch
* updated extraction rules
* regression tests
* diff summary
* confidence/risk note

#### 6. Publish/Review Agent

Moves validated records into the production school catalog.

Rules:

* no field is user-visible until it has passed validation
* low-confidence records must remain flagged
* Codex-generated patches must pass tests before publication
* production publication can require human approval in full implementation

## 6.1B Data Pipeline Flow

1. **Planner Agent** selects official pages for each school.
2. **Fetcher Agent** retrieves page content through Bright Data.
3. **Extractor Agent** converts raw content into schema fields.
4. **Validator Agent** scores confidence, detects conflicts, and decides whether to publish, repair, or escalate.
5. **Codex Repair Agent** patches extraction logic and tests when needed.
6. **Publish/Review Agent** writes approved records to the school catalog.
7. The product UI, recommendation engine, and chat assistant read from the **published catalog**, not from raw scraping jobs.

## 6.2 AI Profile Builder

### Purpose

Convert raw student input into a normalized, analyzable profile.

### Inputs

* grade / age
* graduation year
* school curriculum
* Vietnamese GPA
* subject grades
* grade trend
* intended majors
* IELTS / TOEFL
* SAT / ACT
* AP / honors if relevant
* extracurriculars
* leadership
* awards
* volunteering / projects
* essay status
* recommender status
* documents available
* preferred geography / campus type
* budget information

### Budget inputs

Budget must be collected explicitly. Required fields:

* **target annual all-in budget** in USD
* **maximum stretch annual budget** in USD
* whether the family **needs scholarships / aid**
* whether the student is **scholarship-first**, **balanced**, or **admission-safe**
* optional location cost sensitivity

### Derived profile outputs

* GPA normalization
* major-relevant academic strength
* test competitiveness band
* extracurricular depth
* leadership score
* impact score
* spike tags
* application readiness state
* affordability sensitivity
* scholarship dependence
* stage classification:

  * Early Builder
  * Pre-Applicant
  * Active Applicant

### Product rule

The builder must capture both:

* **current state**
* **planned milestones**

Examples:

* IELTS not taken yet, but test booked
* SAT score exists, retake planned
* essays not started, but timeline still reasonable
* no counselor yet, but willingness to engage is high

## 6.3 Recommendation Engine

### Purpose

Recommend schools in Reach / Target / Safety while setting realistic expectations.

### Core scoring dimensions

Every school must be scored on five axes:

**1. Admission Fit**
How competitive is the student relative to the school’s holistic expectations?

**2. Readiness Fit**
How realistic is it to complete a strong application by the relevant round?

**3. Budget Fit**
How aligned is the school with the student’s all-in budget after considering tuition, living cost, and available scholarship / aid signals?

**4. Preference Fit**
How aligned is the school with the student’s stated goals and preferences?

**5. Improvement Upside**
How much can ETEST-guided improvement change the student’s position?

### Official budget logic

Budget must influence both **ranking** and **explanation**.

For each school, the engine must compute:

* sticker cost estimate
* estimated all-in annual cost
* budget delta vs target budget
* budget delta vs stretch budget
* scholarship availability signal
* financial stretch label

### Financial stretch labels

* **Within Budget**
* **Stretch**
* **High Stretch**
* **Very High Stretch**

### Policy on budget

Budget must not hard-remove a school by default.
Instead:

* severe mismatch lowers recommendation score
* severe mismatch lowers shortlist priority
* severe mismatch adds a visible warning
* severe mismatch increases counselor handoff urgency

### Tier logic

The system still returns:

* Reach
* Target
* Safety

But tier generation must use **admission outlook first** and **budget fit as a meaningful adjustment**.

### Official no-hard-rule policy

The engine must **not** hard-reject a school because a student:

* has not yet taken IELTS
* has not yet finished essays
* is close to a deadline
* is above current budget
* is missing a required document

Instead it must show:

* what is missing
* how serious it is
* how much time remains
* whether this is plausible this cycle
* whether it becomes stronger in a later round or future cycle
* whether a counselor can improve the odds

## 6.4 Current Outlook and Projected Outlook

These are official required outputs.

### Current Outlook — definition

Current Outlook is the system’s view of the student’s standing **today**, using only:

* current scores
* current academics
* current activities
* current documents
* current budget
* current timing

### Projected Outlook — definition

Projected Outlook is the system’s view of the student’s standing **by application time**, assuming the student completes explicitly stated milestones such as:

* scheduled test dates
* target score improvements
* essay completion
* document completion
* activity milestones
* selected application round

### Rules for Projected Outlook

* It must be based on explicit assumptions, not fantasy
* It must list the assumptions that drive the projection
* If assumptions are weak or user input is missing, confidence must be lower
* Budget assumptions remain unchanged unless the user explicitly changes budget or the system has a defensible scholarship scenario

### Required output fields per school

* Current Outlook
* Projected Outlook
* confidence level
* budget fit
* deadline pressure
* top reasons for fit
* top blockers
* recommended next actions
* counselor escalation prompt if needed

## 6.5 Grade-aware recommendation behavior

### Early Builder (Grades 9–10)

Engine behavior:

* more room for aspirational recommendations
* stronger weight on improvement upside
* lower weight on immediate readiness
* budget still matters, but not as heavily as in final-cycle planning

### Pre-Applicant (Grade 11)

Engine behavior:

* balanced weight across competitiveness, readiness, and budget
* stronger timeline sensitivity
* stronger emphasis on test planning and school-list shaping

### Active Applicant (Grade 12 / gap year)

Engine behavior:

* readiness and deadline pressure matter much more
* budget matters materially because families are entering real application decisions
* aspirational schools can remain visible, but warnings must be stronger

### Recommended default weights

**Grade 9–10**

* Admission Fit: 35
* Improvement Upside: 25
* Budget Fit: 20
* Preference Fit: 10
* Readiness Fit: 10

**Grade 11**

* Admission Fit: 35
* Readiness Fit: 20
* Budget Fit: 20
* Improvement Upside: 15
* Preference Fit: 10

**Grade 12 / gap year**

* Admission Fit: 30
* Readiness Fit: 30
* Budget Fit: 20
* Preference Fit: 10
* Improvement Upside: 10

### Strategy mode adjustment

User-selected strategy mode changes weights:

* **Scholarship-first:** increase Budget Fit weight
* **Balanced:** keep defaults
* **Admission-safe:** increase Readiness Fit and reduce aspirational bias

## 6.6 Recommendation experience

### Main recommendation view

The UI must show three sections:

* Reach
* Target
* Safety

### Required school card fields

* school name
* location
* tuition
* estimated all-in annual cost
* scholarship / aid availability flag
* Current Outlook
* Projected Outlook
* Budget Fit
* Deadline Pressure
* key fit reasons
* key blockers
* last verified timestamp
* official source links
* CTA to talk to ETEST

### Compare mode

Student can compare 2–3 schools on:

* admission outlook
* projected outlook
* budget fit
* estimated annual cost
* deadlines
* missing requirements
* counselor urgency

## 6.7 AI Chat Assistant

### Purpose

Help students understand recommendations, complete missing data, and convert to consultation.

### Core capabilities

* explain why a school is Reach / Target / Safety
* explain why a school is Within Budget / Stretch / High Stretch
* explain Current Outlook vs Projected Outlook
* ask for missing information
* answer school requirement questions using scraped data
* suggest what to improve next
* recommend counselor handoff
* collect booking preferences

### Boundaries

The assistant may not:

* guarantee admission
* guarantee scholarships
* replace essay or interview strategy
* pretend projected outlook is certain

## 6.8 Counselor handoff

### Purpose

Send counselors a clean, strategic lead instead of raw chat clutter.

### Required payload

* student info
* structured profile
* student stage
* intended majors
* budget profile
* scholarship need
* top recommended schools
* Current Outlook / Projected Outlook per school
* deadline pressure summary
* affordability summary
* top blockers
* improvement upside summary
* AI chat summary
* booking intent

## 6.9 Booking through chat

### MVP flow

1. AI offers consultation
2. Student selects topic and time preference
3. System checks mock ETEST slots
4. AI presents options
5. Student confirms
6. Booking is created

### Full implementation

* rescheduling
* reminders
* counselor matching
* online / offline preference
* topic routing
* parent attendance option

## 6.10 Admin / counselor console

### MVP

* school catalog browser
* scrape status view
* low-confidence school records
* lead queue
* booking list

### Full implementation

* manual field override
* change history
* counselor notes
* recommendation overrides
* counselor feedback loop into engine
* stale-data alerts

## 7. Hackathon MVP scope

### Included

* US schools only
* curated school catalog
* school-level data only
* profile builder
* recommendation engine
* budget-aware ranking
* Current Outlook / Projected Outlook
* Reach / Target / Safety output
* AI chat
* counselor handoff
* booking via mock API
* simplified multi-agent ingestion pipeline

### Excluded

* program-level scraping
* full scholarship forecasting engine
* parent dashboard
* document OCR
* CRM replacement
* essay review system

### Hackathon architecture scope

For the hackathon, the multi-agent pipeline may be simplified to:

* Planner Agent
* Fetcher Agent
* Extractor + Validator Agent
* Codex Repair Agent
* Publish step

### Hackathon implementation guidance

* keep the pipeline asynchronous
* run scheduled refreshes instead of scraping on every user query
* allow manual refresh for a single school
* show validation status and last verified timestamp in the admin view
* keep Codex in the **repair path**, not in the user-facing recommendation path

## 8. Technical architecture

### Orchestration layer

Use the **OpenAI Agents SDK** as the primary orchestration framework for the scraping workflow.

### Web access layer

Use **Bright Data** as the web-access substrate.

Recommended split:

* hosted Bright Data MCP for fast hackathon integration
* Bright Data Web Scraper API for recurring, known, structured official URLs
* Bright Data Browser API for dynamic or interaction-heavy school pages
* Bright Data Web Access APIs when unblocking, proxy rotation, sessions, fingerprinting, and CAPTCHA handling are required at scale

### Codex integration layer

Use **Codex** only for engineering and repair tasks inside the scraping pipeline.

Approved Codex use cases:

* generate or patch extractor logic
* repair broken selectors or parsing rules
* write regression tests
* summarize extraction failures
* propose safe diffs for review
* assist with schema migrations

Disallowed Codex use cases:

* direct source of truth for school facts
* bypassing source attribution
* publishing unsourced values directly to the catalog

### Implementation note

If the main backend is Python, the Codex repair worker should run as a **Node sidecar** or separate service because the Codex SDK is documented as a server-side TypeScript library that requires Node.js 18+.

## 9. Guardrails for agentic scraping

1. **No live scrape dependency for recommendations**
   Recommendation generation, Current Outlook, Projected Outlook, and budget fit must use the latest **published** catalog snapshot.

2. **No unsourced publication**
   Every user-visible school fact must link back to a stored source URL.

3. **No untested Codex patch publication**
   Codex-generated fixes must pass extraction tests before publication.

4. **Official sources first**
   The planner must prioritize official university pages.

5. **Low-confidence records must be visible internally**
   Counselors/admins should see low-confidence or stale fields in the console.

## 10. Success metrics

### User-side

* profile completion rate
* recommendation generation rate
* school comparison usage
* booking conversion rate
* chat-to-handoff conversion

### Business-side

* counselor prep time saved
* lead quality
* consultation conversion rate
* override rate
* stale data rate
* percentage of recommendations with valid source links and cost data

## 10.1 Risks and mitigations

### Risk: Multi-agent complexity slows the hackathon build

**Mitigation:** keep Option B confined to background ingestion and use a published catalog for the student experience.

### Risk: Codex-generated parser fixes introduce bad data

**Mitigation:** require validation, regression tests, and review before production publication.

### Risk: School pages change frequently

**Mitigation:** use Codex as a repair agent, preserve raw source snapshots, and keep change detection in the validator.

### Risk: Dynamic or protected school pages break simple scraping

**Mitigation:** escalate from Bright Data Web Scraper API to Browser API when pages require rendering, sessions, or unblocking.

## 11. Final product rule

This app is an **expectation-setting engine**, not a gatekeeping engine.

It should tell students and parents:

* what is possible now
* what becomes possible with improvement
* what is financially realistic
* what is time-sensitive
* when ETEST’s human expertise becomes especially valuable

The school-data subsystem is officially defined as a **multi-agent Bright Data + Codex pipeline**, while recommendations remain budget-aware and always show **Current Outlook** and **Projected Outlook**.
