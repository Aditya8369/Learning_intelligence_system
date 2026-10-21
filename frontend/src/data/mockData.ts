import { Topic, Question, CourseDocument, TutorMessage } from '../types';

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'relational_algebra',
    name: 'Relational Algebra & Set Operations',
    category: 'Foundations',
    description: 'Formal foundations of relational queries: Selection (Ïƒ), Projection (Ï€), Cartesian Product (Ã—), Set Union, Difference, and Joins.',
    prerequisites: [],
    estimatedMastery: 0.86,
    confidence: 0.90,
    bktParams: { pL0: 0.35, pT: 0.18, pG: 0.20, pS: 0.08 },
    attemptsCount: 14,
    correctCount: 12,
    lastPracticed: '2 days ago',
    errorPatterns: ['Confusing Selection (horizontal filtering) with Projection (vertical attribute selection)'],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 2',
      section: '2.3 Relational Algebra Operators',
      pages: 'pp. 42-58'
    }
  },
  {
    id: 'sql_basics',
    name: 'Basic SQL SELECT & Aggregations',
    category: 'Query Languages',
    description: 'Declarative querying with SELECT, FROM, WHERE, GROUP BY, HAVING, and standard aggregation functions (COUNT, SUM, AVG).',
    prerequisites: ['relational_algebra'],
    estimatedMastery: 0.82,
    confidence: 0.88,
    bktParams: { pL0: 0.40, pT: 0.20, pG: 0.22, pS: 0.10 },
    attemptsCount: 18,
    correctCount: 15,
    lastPracticed: 'Yesterday',
    errorPatterns: ['Filtering aggregated columns in WHERE instead of HAVING clause'],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 3',
      section: '3.1 Structured Query Language Fundamentals',
      pages: 'pp. 64-88'
    }
  },
  {
    id: 'null_semantics',
    name: 'NULL Semantics & Three-Valued Logic (3VL)',
    category: 'Query Languages',
    description: 'Behavior of unknown values in SQL, truth values (TRUE, FALSE, UNKNOWN), IS NULL predicates, and subtle outer join implications.',
    prerequisites: ['sql_basics'],
    estimatedMastery: 0.34,
    confidence: 0.75,
    bktParams: { pL0: 0.25, pT: 0.12, pG: 0.25, pS: 0.15 },
    attemptsCount: 9,
    correctCount: 3,
    lastPracticed: '3 days ago',
    errorPatterns: [
      'Using "WHERE col = NULL" instead of "WHERE col IS NULL"',
      'Assuming NOT (UNKNOWN) evaluates to TRUE in WHERE predicates'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 3',
      section: '3.4 Three-Valued Logic & Missing Data',
      pages: 'pp. 98-105'
    }
  },
  {
    id: 'sql_joins',
    name: 'SQL Joins & Multi-Table Relations',
    category: 'Query Languages',
    description: 'Inner Joins, Left/Right/Full Outer Joins, Cross Joins, Self Joins, and join condition placement in ON vs WHERE.',
    prerequisites: ['sql_basics', 'null_semantics'],
    estimatedMastery: 0.54,
    confidence: 0.80,
    bktParams: { pL0: 0.30, pT: 0.15, pG: 0.20, pS: 0.12 },
    attemptsCount: 12,
    correctCount: 6,
    lastPracticed: 'Today',
    errorPatterns: [
      'Accidentally converting LEFT JOIN into INNER JOIN by placing right-table filter in WHERE',
      'Cartesian explosion from missing join predicates'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 4',
      section: '4.2 Join Semantics and Outer Relations',
      pages: 'pp. 112-134'
    }
  },
  {
    id: 'normalization_1_3nf',
    name: 'Functional Dependencies & Normalization (1NF - 3NF)',
    category: 'Schema Design',
    description: 'Eliminating insertion, deletion, and update anomalies through First Normal Form (atomicity), 2NF (full functional dependency), and 3NF (transitive dependency removal).',
    prerequisites: ['relational_algebra'],
    estimatedMastery: 0.42,
    confidence: 0.72,
    bktParams: { pL0: 0.25, pT: 0.14, pG: 0.20, pS: 0.14 },
    attemptsCount: 8,
    correctCount: 3,
    lastPracticed: '4 days ago',
    errorPatterns: [
      'Confusing partial functional dependency (violates 2NF) with transitive dependency (violates 3NF)',
      'Identifying candidate keys incorrectly when composite keys exist'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 7',
      section: '7.3 Normal Forms based on Primary Keys',
      pages: 'pp. 210-238'
    }
  },
  {
    id: 'bcnf',
    name: 'Boyce-Codd Normal Form (BCNF) & Lossless Decomposition',
    category: 'Schema Design',
    description: 'Strict normal form where every determinant must be a candidate key, and properties of lossless-join and dependency preservation.',
    prerequisites: ['normalization_1_3nf'],
    estimatedMastery: 0.28,
    confidence: 0.65,
    bktParams: { pL0: 0.20, pT: 0.10, pG: 0.22, pS: 0.16 },
    attemptsCount: 5,
    correctCount: 1,
    lastPracticed: '5 days ago',
    errorPatterns: [
      'Assuming all 3NF relations automatically satisfy BCNF when overlapping candidate keys exist',
      'Forgetting that BCNF decomposition cannot always preserve all functional dependencies'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 7',
      section: '7.5 Boyce-Codd Normal Form & Decomposition Tests',
      pages: 'pp. 240-252'
    }
  },
  {
    id: 'indexing_btree',
    name: 'Indexing Structures & B+ Trees',
    category: 'Physical Optimization',
    description: 'Dense vs sparse indices, clustered vs non-clustered, B+ tree leaf chaining, balanced node splits, and range query access costs.',
    prerequisites: ['sql_joins'],
    estimatedMastery: 0.62,
    confidence: 0.78,
    bktParams: { pL0: 0.30, pT: 0.16, pG: 0.18, pS: 0.10 },
    attemptsCount: 10,
    correctCount: 6,
    lastPracticed: '3 days ago',
    errorPatterns: [
      'Thinking secondary indexes physically reorder table rows on disk',
      'Overlooking leaf node traversal efficiency in B+ trees compared to standard B-trees'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 11',
      section: '11.3 Tree-Structured Indexing: B+ Trees',
      pages: 'pp. 345-372'
    }
  },
  {
    id: 'acid_transactions',
    name: 'ACID Properties & Concurrency Control',
    category: 'Transactions',
    description: 'Atomicity, Consistency, Isolation, Durability, Two-Phase Locking (2PL), serializability graphs, deadlocks, and transaction isolation levels.',
    prerequisites: ['indexing_btree'],
    estimatedMastery: 0.38,
    confidence: 0.70,
    bktParams: { pL0: 0.25, pT: 0.12, pG: 0.20, pS: 0.15 },
    attemptsCount: 7,
    correctCount: 2,
    lastPracticed: '6 days ago',
    errorPatterns: [
      'Believing Read Committed prevents non-repeatable reads',
      'Conflating Strict 2PL with basic 2PL in cascading rollback prevention'
    ],
    courseRef: {
      document: 'DBMS_Comprehensive_Core.pdf',
      chapter: 'Chapter 14',
      section: '14.2 Concurrency Control & Two-Phase Locking',
      pages: 'pp. 440-475'
    }
  }
];

export const QUESTION_BANK: Question[] = [
  {
    id: 'q-null-1',
    topicId: 'null_semantics',
    topicName: 'NULL Semantics & Three-Valued Logic (3VL)',
    difficulty: 'Foundational',
    questionText: 'What is the evaluated boolean result of the expression `NULL = NULL` in standard SQL three-valued logic, and will a row with this condition be returned in a `WHERE` clause?',
    codeSnippet: 'SELECT * FROM Students WHERE NULL = NULL;',
    options: [
      { id: 'A', text: 'TRUE; the row is returned because both operands are identical NULL values.' },
      { id: 'B', text: 'FALSE; NULL cannot equal anything, so the row is rejected.' },
      { id: 'C', text: 'UNKNOWN; the row is not returned because WHERE clauses only accept conditions that evaluate to TRUE.' },
      { id: 'D', text: 'Syntax Error; direct equality comparisons with NULL are forbidden by database parsers.' }
    ],
    correctOptionId: 'C',
    explanation: 'In SQL Three-Valued Logic (3VL), comparing any value with NULL using comparison operators (=, !=, <, >) yields UNKNOWN. In a WHERE clause, rows are only returned if the filter expression evaluates strictly to TRUE (UNKNOWN is treated as false for row filtering).',
    optionFeedback: {
      'A': 'Incorrect. NULL represents an unknown value, not a distinct value equal to itself. NULL = NULL yields UNKNOWN.',
      'B': 'Incorrect. It does not evaluate to FALSE; it evaluates to UNKNOWN (the third truth value).',
      'C': 'Correct! In SQL, NULL = NULL evaluates to UNKNOWN. A WHERE clause filters out both FALSE and UNKNOWN values.',
      'D': 'Incorrect. The syntax is valid and compiles, but does not produce TRUE.'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '3.4 Three-Valued Logic and Missing Information',
      page: 102,
      quote: 'Comparisons with NULL always result in the truth value UNKNOWN. SQL WHERE clauses only admit tuples for which the condition evaluates strictly to TRUE.'
    }
  },
  {
    id: 'q-null-2',
    topicId: 'null_semantics',
    topicName: 'NULL Semantics & Three-Valued Logic (3VL)',
    difficulty: 'Intermediate',
    questionText: 'Given a table `Employees` where the `bonus` column contains values (500, 1000, NULL), what is the output of `SELECT COUNT(*), COUNT(bonus) FROM Employees;`?',
    codeSnippet: 'SELECT COUNT(*), COUNT(bonus) FROM Employees;',
    options: [
      { id: 'A', text: 'COUNT(*) = 3, COUNT(bonus) = 3' },
      { id: 'B', text: 'COUNT(*) = 3, COUNT(bonus) = 2' },
      { id: 'C', text: 'COUNT(*) = 2, COUNT(bonus) = 2' },
      { id: 'D', text: 'COUNT(*) = 3, COUNT(bonus) = NULL' }
    ],
    correctOptionId: 'B',
    explanation: 'COUNT(*) counts every row in the result set regardless of NULLs. However, COUNT(column_name) ignores NULL entries and only counts non-NULL occurrences. Hence COUNT(*) is 3, while COUNT(bonus) is 2.',
    optionFeedback: {
      'A': 'Incorrect. COUNT(column) ignores NULL entries.',
      'B': 'Correct! COUNT(*) tallies all 3 tuples, whereas COUNT(bonus) excludes the NULL value, tallying 2.',
      'C': 'Incorrect. COUNT(*) does not ignore NULLs across the tuple.',
      'D': 'Incorrect. Aggregation functions like COUNT never return NULL (they return an integer, 0 or greater).'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '3.4 Three-Valued Logic and Missing Information',
      page: 104,
      quote: 'Except for COUNT(*), all aggregate functions ignore null values in their input collection.'
    }
  },
  {
    id: 'q-joins-1',
    topicId: 'sql_joins',
    topicName: 'SQL Joins & Multi-Table Relations',
    difficulty: 'Intermediate',
    questionText: 'Consider a LEFT OUTER JOIN query where a filter on the right table is accidentally placed in the WHERE clause instead of the ON clause. What is the effect?',
    codeSnippet: `SELECT c.name, o.order_id 
FROM Customers c 
LEFT OUTER JOIN Orders o ON c.id = o.customer_id
WHERE o.status = 'SHIPPED';`,
    options: [
      { id: 'A', text: 'Customers without orders are still preserved, with order_id and status shown as NULL.' },
      { id: 'B', text: 'The query behaves as an INNER JOIN, eliminating customers who have no orders or whose orders are not shipped.' },
      { id: 'C', text: 'A runtime SQL error is thrown because WHERE cannot reference right-side tables of a LEFT JOIN.' },
      { id: 'D', text: 'The query returns all customers, but replaces non-shipped order IDs with 0.' }
    ],
    correctOptionId: 'B',
    explanation: 'Placing a condition on the right table (`o.status = "SHIPPED"`) in the WHERE clause converts the LEFT JOIN into an INNER JOIN. For unmatched customers, `o.status` is NULL; the expression `NULL = "SHIPPED"` evaluates to UNKNOWN, which the WHERE clause filters out!',
    optionFeedback: {
      'A': 'Incorrect. For unmatched customers, o.status is NULL. The WHERE clause tests NULL = "SHIPPED", which fails the filter.',
      'B': 'Correct! This is one of the most common SQL misconceptions. Filter predicates on the optional table belong in the ON clause to preserve outer join semantics.',
      'C': 'Incorrect. The query is syntactically valid SQL.',
      'D': 'Incorrect. SQL WHERE clauses filter out unmatched tuples entirely.'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '4.2 Join Semantics and Outer Relations',
      page: 119,
      quote: 'A WHERE clause condition referencing attributes of the preserved table or nullable right side will filter out unmatched tuples generated by LEFT OUTER JOIN, turning it effectively into an INNER JOIN.'
    }
  },
  {
    id: 'q-norm-1',
    topicId: 'normalization_1_3nf',
    topicName: 'Functional Dependencies & Normalization (1NF - 3NF)',
    difficulty: 'Foundational',
    questionText: 'A relation R(A, B, C, D) has primary key (A, B). The functional dependency B -> C holds. Which normal form is violated by this dependency?',
    codeSnippet: 'Relation: R(A, B, C, D)\nPrimary Key: {A, B}\nFunctional Dependencies: {A, B} -> D, B -> C',
    options: [
      { id: 'A', text: '1NF (First Normal Form)' },
      { id: 'B', text: '2NF (Second Normal Form)' },
      { id: 'C', text: '3NF (Third Normal Form) only, while 2NF is satisfied' },
      { id: 'D', text: 'BCNF only; 1NF, 2NF, and 3NF are all satisfied' }
    ],
    correctOptionId: 'B',
    explanation: '2NF requires that every non-prime attribute (C, D) must be fully functionally dependent on the whole candidate key. Here, C depends on B alone, which is a proper subset of the candidate key {A, B}. This is a partial functional dependency, which directly violates 2NF.',
    optionFeedback: {
      'A': 'Incorrect. 1NF only requires atomic values in attributes.',
      'B': 'Correct! Attribute C depends on {B}, a proper subset of the composite candidate key {A, B}. This partial dependency violates 2NF.',
      'C': 'Incorrect. Because 2NF is violated, the relation cannot be in 3NF.',
      'D': 'Incorrect. 2NF is already violated.'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '7.3 Normal Forms based on Primary Keys',
      page: 218,
      quote: 'A relation is in 2NF if it is in 1NF and no non-prime attribute is functionally dependent on a proper subset of any candidate key.'
    }
  },
  {
    id: 'q-bcnf-1',
    topicId: 'bcnf',
    topicName: 'Boyce-Codd Normal Form (BCNF) & Lossless Decomposition',
    difficulty: 'Advanced',
    questionText: 'Under what specific condition can a relation be in Third Normal Form (3NF) but NOT in Boyce-Codd Normal Form (BCNF)?',
    options: [
      { id: 'A', text: 'When there is a transitive dependency between non-prime attributes.' },
      { id: 'B', text: 'When a non-trivial functional dependency X -> Y has a determinant X that is not a superkey, but Y is a prime attribute (part of a candidate key).' },
      { id: 'C', text: 'When multi-valued attributes exist within the primary key.' },
      { id: 'D', text: '3NF and BCNF are mathematically identical; every 3NF relation is also in BCNF.' }
    ],
    correctOptionId: 'B',
    explanation: 'In 3NF, for any non-trivial FD X -> Y, either X is a superkey OR Y is a prime attribute. BCNF removes the second concession: in BCNF, X must ALWAYS be a superkey. When Y is prime but X is not a superkey, the relation is in 3NF but violates BCNF.',
    optionFeedback: {
      'A': 'Incorrect. Transitive dependencies between non-prime attributes violate 3NF.',
      'B': 'Correct! 3NF permits X -> Y where X is not a superkey as long as Y is part of some candidate key. BCNF does not allow this exception.',
      'C': 'Incorrect. Multi-valued attributes violate 1NF and 4NF.',
      'D': 'Incorrect. BCNF is strictly stronger than 3NF.'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '7.5 Boyce-Codd Normal Form & Decomposition Tests',
      page: 242,
      quote: 'The difference between 3NF and BCNF arises when a relation has multiple overlapping candidate keys and an FD has a prime attribute on the right side with a non-superkey determinant.'
    }
  },
  {
    id: 'q-acid-1',
    topicId: 'acid_transactions',
    topicName: 'ACID Properties & Concurrency Control',
    difficulty: 'Intermediate',
    questionText: 'Which concurrency anomaly is prevented by the REPEATABLE READ isolation level that is permitted under the READ COMMITTED level?',
    options: [
      { id: 'A', text: 'Dirty Read (reading uncommitted writes)' },
      { id: 'B', text: 'Non-Repeatable Read (Fuzzy Read: seeing modified data upon re-reading the same row)' },
      { id: 'C', text: 'Phantom Read (seeing new inserted rows matching a range query)' },
      { id: 'D', text: 'Deadlocks' }
    ],
    correctOptionId: 'B',
    explanation: 'READ COMMITTED prevents Dirty Reads, but allows Non-Repeatable Reads (where another committed transaction modifies and commits a row between two reads). REPEATABLE READ holds read locks until transaction commit (or uses MVCC snapshot isolation), guaranteeing that re-reading the same row returns identical data.',
    optionFeedback: {
      'A': 'Incorrect. Dirty Reads are already prevented by READ COMMITTED.',
      'B': 'Correct! Non-Repeatable Reads occur when data read in a transaction changes before completion. REPEATABLE READ prevents this.',
      'C': 'Incorrect. Phantom Reads are typically only prevented in SERIALIZABLE mode (or specialized range locks).',
      'D': 'Incorrect. Isolation levels do not prevent deadlocks.'
    },
    sourceCitation: {
      document: 'DBMS_Comprehensive_Core.pdf',
      section: '14.2 Concurrency Control & Two-Phase Locking',
      page: 452,
      quote: 'Non-repeatable read occurs when a transaction rereads data it has previously read and finds that data has been modified by another committed transaction. REPEATABLE READ prohibits this anomaly.'
    }
  }
];

export const COURSE_DOCUMENTS: CourseDocument[] = [
  {
    id: 'doc-1',
    title: 'DBMS Comprehensive Core (Syllabus & Lecture Notes)',
    filename: 'DBMS_Comprehensive_Core.pdf',
    size: '14.2 MB',
    totalPages: 486,
    topicsCovered: ['Relational Algebra', 'SQL Basics', 'NULL Semantics', 'Joins', '1NF-3NF', 'BCNF', 'Indexing', 'ACID'],
    chunksCount: 842,
    status: 'indexed',
    summary: 'Core reference text for CS304: Relational Database Systems. Contains rigorous operator definitions, normalization proofs, SQL execution semantics, B+ Tree indexing algorithms, and concurrency isolation schedules.'
  },
  {
    id: 'doc-2',
    title: 'SQL Join & NULL Semantics CheatSheet & Case Studies',
    filename: 'SQL_Joins_and_3VL_Mastery.pdf',
    size: '3.8 MB',
    totalPages: 48,
    topicsCovered: ['NULL Semantics', 'SQL Joins', 'Query Languages'],
    chunksCount: 112,
    status: 'indexed',
    summary: 'Focused supplementary module analyzing 3-valued truth tables, outer join edge cases, anti-semi-joins, and performance pitfalls with nullable foreign keys.'
  },
  {
    id: 'doc-3',
    title: 'Normalization & Functional Dependency Worked Proofs',
    filename: 'Normalization_Decomposition_Proofs.pdf',
    size: '5.1 MB',
    totalPages: 76,
    topicsCovered: ['Functional Dependencies', '1NF-3NF', 'BCNF'],
    chunksCount: 198,
    status: 'indexed',
    summary: 'Step-by-step canonical decomposition algorithms, candidate key discovery using Armstrong axioms, and dependency preservation test matrices.'
  }
];

export const INITIAL_TUTOR_MESSAGES: TutorMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    content: `Hello! I am your course-grounded AI tutor for **Database Management Systems (DBMS)**.

I use your uploaded lecture material and your topic knowledge profile to tailor explanations. Right now, your learner profile shows that you are solid in **Relational Algebra (86%)**, but developing in **SQL Joins (54%)** and currently weak in **NULL Semantics & 3VL (34%)**.

How can I help you today? You can ask a concept question, request a step-by-step worked example, or have me generate a grounded practice problem!`,
    timestamp: 'Just now',
    citations: [
      {
        document: 'DBMS_Comprehensive_Core.pdf',
        chapter: 'Chapter 3',
        section: '3.4 Three-Valued Logic and Missing Information',
        page: 98,
        snippet: 'NULL in SQL does not mean zero or empty string; it denotes unknown or inapplicable values. Consequently, any arithmetic or relational operator involving NULL evaluates to NULL or UNKNOWN.'
      }
    ],
    suggestedPrompts: [
      'Why does NULL = NULL evaluate to UNKNOWN?',
      'Explain how a LEFT JOIN turns into an INNER JOIN with WHERE',
      'Show the step-by-step test for Boyce-Codd Normal Form (BCNF)',
      'Draw concept flowchart for SQL Query Execution pipeline'
    ]
  }
];
