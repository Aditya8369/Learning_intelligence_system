# Personalized Learning Intelligence System
## Project Plan

> **Working title:** Personalized Learning Intelligence System (PLIS)  
> **Purpose:** Build a learning platform that understands what a student is struggling with, recommends what to study next, and offers an AI tutor grounded in the student's actual course material.

---

## 1. The idea in simple words

Most study tools help students *find information*. Our system should help students decide **what they need to learn next, why they need it, and how to practise it**.

A student uploads course notes or PDFs, studies a topic, and answers short quizzes. The system tracks performance topic by topic, estimates which concepts are well understood and which are still shaky, and recommends the next useful activity. An AI tutor can explain the course material, answer questions with sources, and generate practice questions. Each new assessment helps update the student's learning profile.

The key idea is the **learning loop**:

1. Assess the student.
2. Estimate topic-level understanding.
3. Find knowledge gaps and prerequisite gaps.
4. Recommend a useful next action.
5. Help the student learn and practise.
6. Assess again and update the estimate.

This connected loop is the main product. The chatbot is one feature inside it, not the whole project.

## 2. The problem we want to solve

Students often face several related problems:

- **Too much material:** They do not know what to focus on first.
- **Hidden weaknesses:** A high overall score can hide gaps in specific concepts.
- **One-size-fits-all study plans:** Most notes and courses present the same sequence to everyone.
- **Passive studying:** Reading explanations can feel productive without proving that the student can apply the concept.
- **Scattered tools:** Notes, quizzes, progress tracking, and AI help live in different places.
- **Unreliable AI answers:** A general chatbot may answer from broad knowledge rather than the exact syllabus, and may invent details or miss the course's terminology.
- **Poor feedback loops:** Students may repeat easy topics or move on before prerequisites are secure.

We want to make studying more focused, more measurable, and easier to act on.

## 3. What we want to build

A web application with four connected parts.

### 3.1 Student knowledge profile

The platform keeps a topic-by-topic record of the student's learning history.

It can use signals such as:
- Quiz correctness.
- Question topic and difficulty.
- Number of attempts.
- Time taken, where available and appropriate.
- Recent performance and time since practice.
- Prerequisite relationships between concepts.

The system estimates mastery per topic rather than treating one total score as the full picture. These estimates are **probabilities or indicators, not perfect measurements of a person's knowledge**. We must show uncertainty and avoid claiming certainty from very little data.

### 3.2 Personalized learning recommendations

The platform recommends an actionable next step, for example:

- Review a concept.
- Learn a missing prerequisite.
- Read a specific section of the course material.
- Attempt a short quiz.
- Practise a harder question.
- Revisit a topic that has not been practised recently.

Recommendations should consider:
- Low estimated mastery.
- Topic importance.
- Prerequisites.
- Review timing and forgetting risk.
- Recent mistakes.
- Available course resources.

Each recommendation should explain **why it was selected**. We should start with a transparent ranking algorithm and evaluate it before considering more complex recommendation models.

### 3.3 Course-grounded AI tutor

Students can ask questions about their own uploaded course material. The tutor should:

- Retrieve relevant passages from course documents.
- Explain a concept in simple language.
- Link answers to source document sections or page numbers when available.
- Generate practice questions grounded in the material.
- Explain why an answer is correct or incorrect.
- Use the learner's topic profile to adjust explanations and practice.
- Say when the provided material does not contain enough evidence to answer confidently.

This feature will use **retrieval-augmented generation (RAG)**. RAG helps the model use relevant course content, but it does not automatically guarantee correctness. We need citation checks, tests, and clear limits.

### 3.4 Progress and learning analytics

The student dashboard should make progress understandable at a glance:

- Topic mastery heatmap.
- Strong, developing, and weak topics.
- Progress over time.
- Recent quiz performance.
- Repeated mistake patterns.
- Recommended next actions and reasons.
- Topics that may need review.

An instructor view can be considered if time allows. The first release should prioritize a reliable student experience rather than building several interfaces at once.

## 4. How can this be better than ChatGPT or ordinary study apps?

We should not claim that we are better than ChatGPT at every task. ChatGPT and existing learning platforms are broad, capable tools. Our advantage should be **specialization and integration for a student's ongoing learning process**.

| Capability | General AI chatbot | Typical study tool | Our intended advantage |
|---|---|---|---|
| Answer a question | Strong general-purpose capability | Varies | Answers grounded in the student's course material, with sources where possible |
| Track topic mastery over time | Not usually a dedicated, persistent feature of a basic chat | Often tracks scores or completion | Maintains a topic-level learner model and updates it after assessments |
| Choose what to study next | Usually needs the student to ask | May follow a fixed course sequence | Recommends next steps using mastery, prerequisites, and review timing |
| Connect mistakes to a plan | Can explain a mistake in conversation | Depends on the app | Uses recurring error patterns to shape later practice |
| Combine tutor, assessment, and progress | Possible through prompting, but often manually coordinated | Features vary | One integrated workflow where each assessment updates recommendations |
| Explain why something is recommended | Depends on the interaction | Varies | Shows interpretable reasons for recommendations |
| Measure effectiveness | Requires a separate evaluation setup | Varies | We can test mastery prediction, retrieval quality, and recommendation behaviour |

**Our defensible value proposition:** instead of making the student repeatedly ask, "What should I study now?", the system uses their learning history to propose a reasoned next action and then checks whether learning appears to improve.

ChatGPT can also be used as a tutor, create quizzes, and remember information in some setups. Our project is not based on claiming that those things are impossible elsewhere. It is based on building a dedicated, transparent, testable learning workflow around a defined syllabus.

## 5. Example student journey

Imagine a student studying DBMS.

1. The student uploads notes covering SQL joins, normalization, indexing, and transactions.
2. The system organizes the content into topics and prerequisite links.
3. The student takes a short diagnostic quiz.
4. The mastery model estimates that joins are developing, NULL handling is weak, and basic SELECT queries are relatively strong.
5. The recommendation engine suggests reviewing NULL semantics before doing more advanced JOIN questions.
6. The tutor retrieves the relevant notes and explains the idea with a worked example.
7. It generates a short, source-grounded quiz.
8. The student answers the questions. The system logs the results and updates the mastery estimate.
9. The dashboard shows the change in evidence and recommends the next step.

This demonstrates the full system. A standalone chatbot would stop after step 6.

## 6. Main technical components

### A. Course ingestion and topic organization
- Accept PDFs and, if time allows, other text formats.
- Extract text and preserve document/page metadata.
- Split content into meaningful chunks.
- Create embeddings for semantic retrieval.
- Attach topic labels and source locations.
- Build or maintain a topic prerequisite graph.

### B. Learner-event data layer
Store structured records for learners, topics, questions, quiz attempts, responses, mastery updates, recommendations, and content sources. Use a relational database for reliable history and queries.

### C. Mastery estimation
Start with a simple historical-accuracy baseline. Then implement **Bayesian Knowledge Tracing (BKT)** for topic-level sequential estimates if the data supports the model.

BKT represents a learner's estimated probability of knowing a skill and updates that estimate using correct or incorrect responses and parameters such as learning, guessing, and slipping. It needs enough observations to be useful; a few answers are not proof of mastery.

**Optional extension:** compare with Item Response Theory (IRT), which accounts for question difficulty and learner ability. Do not implement every candidate model just to make the technology list longer.

### D. Recommendation engine
Start with a transparent weighted ranking algorithm and prerequisite constraints. Potential ranking signals include mastery gap, topic importance, review timing, and recent errors. Keep a record of recommendation reasons so we can inspect and evaluate its decisions.

### E. RAG tutor and quiz generation
- Retrieve relevant chunks using semantic search and optionally keyword search.
- Pass the question, retrieved evidence, and relevant learner context to an LLM.
- Ask for structured responses where appropriate.
- Include source references.
- Validate generated question structure and answer fields.
- Test unsupported questions and cases where source material is insufficient.

### F. Analytics and interface
Provide an accessible interface for quizzes, tutor interactions, recommendations, and topic progress. Show the reasoning behind recommendations and avoid presenting mastery estimates as unquestionable facts.

### G. Evaluation
Create reproducible test sets and compare components against simple baselines. Log failures and report limitations honestly.

## 7. Recommended technologies

Choose technologies that support the product without making deployment unnecessarily complicated.

| Area | Recommended choice | Why we need it |
|---|---|---|
| Main language | Python | ML, data processing, backend, and evaluation |
| Backend API | FastAPI + Pydantic | Endpoints, input validation, structured responses |
| Frontend | React or Next.js | Interactive web application and dashboards |
| Styling | Tailwind CSS or a simple component library | Consistent UI without spending weeks on styling |
| Relational database | PostgreSQL | Users, topics, quiz questions, attempts, and mastery history |
| Vector search | pgvector with PostgreSQL, or a separate vector database if necessary | Search course chunks by semantic similarity |
| PDF extraction | PyMuPDF or pypdf | Extract course text and source metadata |
| Embeddings | A suitable embedding model/API | Represent text for semantic retrieval |
| LLM | One API-accessible model initially | Tutor responses, explanations, and structured quiz generation |
| Mastery model | Python implementation of BKT; compare with a simple baseline | Track changing estimates of topic knowledge |
| ML utilities | scikit-learn, if needed | Baselines, preprocessing, metrics, and optional classifiers |
| Graph representation | NetworkX initially, or relational tables for prerequisites | Represent topic dependencies and check valid learning paths |
| Charts | Plotly or a React chart library | Mastery heatmaps and progress visualizations |
| Testing | pytest | Test API routes, model updates, retrieval, and recommendation rules |
| Version control | Git + GitHub | Collaboration, history, reviews, and issues |
| Deployment | A suitable frontend host plus a backend/database host | Publish a working demo |

### Keep the initial stack small

For the first version, we do **not** need:
- Multiple autonomous agents.
- A custom-trained foundation model.
- A complex microservice architecture.
- A separate database for every component.
- Kubernetes or elaborate orchestration.
- A paid service for every task.

Build a modular monolith first: one backend application with clear internal modules. Split services only if there is a real reason.

## 8. Data we need

The project needs both course content and structured assessment events.

### Course content
- Lecture notes and textbooks we are allowed to use.
- Topic names and definitions.
- Source page or section metadata.
- Prerequisite relationships.
- Optional links between topics and practice questions.

### Assessment data
A useful question record may include:
- Question ID.
- Topic ID.
- Difficulty label.
- Question text and options.
- Correct answer.
- Explanation.
- Source reference.
- Question type.

A useful attempt record may include:
- Learner ID or pseudonymous identifier.
- Question ID and topic ID.
- Submitted answer.
- Correct/incorrect result.
- Timestamp.
- Attempt number.
- Optional response time.

We can begin with a small, manually reviewed dataset and simulated learner histories for initial testing. Simulated data lets us test the learning loop, but it cannot establish real-world effectiveness. Later, real user testing should use consent, minimal data collection, and appropriate privacy protections.

## 9. What makes the project academically strong?

The implementation should be accompanied by experiments, not just feature screenshots.

| Component | Evaluation plan |
|---|---|
| Mastery model | Compare future-response prediction against simple historical-accuracy or frequency baselines |
| Recommendation engine | Check prerequisite violations, relevance, consistency, and simulated learner outcomes |
| RAG retrieval | Check whether the retrieved passages actually support the test question |
| Tutor answers | Evaluate factual correctness, grounding, source attribution, and abstention when evidence is missing |
| Quiz generation | Review answer correctness, source support, topic alignment, and difficulty |
| Complete workflow | Test whether assessment results reliably update mastery, recommendations, and dashboard history |

Use train/test separation that respects the task. For sequential prediction, do not use future responses to predict the past. Record model settings, test cases, metrics, and known failures.

A small controlled user study may be valuable if practical, but do not claim that simulated improvements prove that students learn better in real life.

## 10. Development roadmap

The exact duration depends on the team, course requirements, and available time. Build in the following order rather than promising a deadline before estimating the work.

### Phase 1 — Define the foundation
- Select one pilot subject.
- Define topics and prerequisite relationships.
- Design the database and API contracts.
- Create the repository, README, and architecture notes.
- Agree on module ownership and Git workflow.

**Exit condition:** every team member understands the data flow and what their module must provide.

### Phase 2 — Build the learning loop
- Create a question bank and assessment interface.
- Record attempts and results.
- Implement a simple mastery baseline.
- Implement BKT and compare its predictions where enough data is available.
- Build an initial recommendation algorithm.

**Exit condition:** completing a quiz changes the learner's state and can change the next recommendation.

### Phase 3 — Add course-grounded assistance
- Implement PDF ingestion and source-aware chunking.
- Add embeddings and retrieval.
- Build tutor responses with source references.
- Generate and validate practice questions.
- Connect assessments to mastery updates.

**Exit condition:** the tutor can answer supported questions, cite relevant content, and handle unsupported questions responsibly.

### Phase 4 — Dashboard and integration
- Build mastery heatmaps and progress history.
- Show recommendation explanations.
- Integrate the frontend and backend.
- Add automated tests and error handling.
- Verify that all components use consistent topic and learner identifiers.

**Exit condition:** the complete student journey works without manual intervention.

### Phase 5 — Evaluate and demonstrate
- Compare against simple baselines.
- Run retrieval and answer-quality tests.
- Test cold-start learners with little history.
- Test missing content and insufficient evidence.
- Document limitations and results.
- Deploy a stable demonstration.

**Exit condition:** we can explain what works, what does not, and what the experiments actually show.

## 11. Team organization

For a five-person group, suggested module ownership is:

1. **Project lead and intelligence:** system architecture, mastery estimation, recommendations, integration, and evaluation coordination.
2. **Data and assessment:** course ingestion, topic taxonomy, question bank, quiz logic, and assessment validation.
3. **RAG and tutor:** retrieval, citations, LLM prompts, and quiz-generation integration.
4. **Backend and persistence:** API contracts, database models, learner history, and authentication if required.
5. **Frontend and analytics:** student interface, quiz screens, progress visualizations, and dashboard.

These are initial ownership areas, not silos. Everyone should review the architecture and understand how the complete system works. Agree on API contracts before parallel implementation, use small pull requests, and integrate frequently.

## 12. Scope: what is essential and what can wait?

### Must have
- One pilot subject.
- Topic taxonomy and prerequisite graph.
- Quiz attempt logging.
- Topic-level mastery estimates.
- Personalized recommendations with explanations.
- RAG tutor with source references.
- Quiz feedback and mastery updates.
- Progress dashboard.
- Evaluation against basic baselines.

### Should have if time allows
- Spaced-repetition scheduling.
- Difficulty-aware assessments.
- Mistake classification.
- Instructor dashboard.
- IRT comparison.
- More than one subject.
- Learner-controlled study goals.

### Not required for the first version
- Multiple AI agents.
- Training a foundation model.
- A sophisticated social-learning network.
- Mobile applications for every platform.
- Claims of proven learning gains without a real evaluation.

## 13. Main risks and how we will handle them

- **Too much scope:** deliver one complete learning loop before adding advanced features.
- **Sparse assessment history:** use conservative estimates and show when confidence is low.
- **Badly generated questions:** validate structure and source support, and manually review a test sample.
- **Incorrect or unsupported tutor answers:** use retrieval, citations, evaluation tests, and appropriate abstention.
- **Misleading recommendations:** explain the ranking reasons and compare against simple baselines.
- **Synthetic data that looks better than reality:** disclose it and test on real interactions where feasible.
- **Integration problems:** agree on schemas, API contracts, and ownership early.
- **Privacy and secrets:** keep API keys in environment variables, commit only `.env.example`, and collect the minimum necessary learner data.

## 14. What success looks like

The project is successful when a student can use one connected workflow to:

1. Learn from their course material.
2. Take a quiz.
3. See an updated topic-level mastery estimate.
4. Understand why a topic needs attention.
5. Receive a useful next-step recommendation.
6. Ask the tutor for help grounded in the course.
7. Practise again and see the learner model update.
8. Review their progress and learning history.

The technical success criteria are equally important: reproducible evaluation, meaningful baselines, traceable recommendations, tested data flow, and honest limitations.

## 15. Immediate next steps

1. Create the GitHub repository and commit this plan.
2. Select the pilot subject and initial topic list.
3. Agree on the first database schema and API contracts.
4. Create a small reviewed question bank.
5. Build the assessment-to-mastery-to-recommendation loop before expanding the tutor.
6. Track decisions, tasks, experiments, and limitations in the repository.

---

## Final principle

**We are not trying to build another chatbot. We are building a system that uses evidence from a student's learning history to decide what they should practise next, helps them practise it, and checks what changed.**

The LLM makes explanations easier. The mastery model, recommendation logic, data, and evaluation make this a learning intelligence project.
