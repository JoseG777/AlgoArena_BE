import mongoose from 'mongoose';
import TriviaProblem from '../model/triviaProblem';

const triviaData = [
  {
    question: 'What is the time complexity of binary search?',
    correct_answer: 'O(log n)',
    incorrect_answers: ['O(n)', 'O(n log n)', 'O(1)'],
    category: 'Algorithms',
    difficulty: 'easy',
  },
  {
    question: 'Which data structure uses FIFO?',
    correct_answer: 'Queue',
    incorrect_answers: ['Stack', 'Tree', 'Graph'],
    category: 'Data Structures',
    difficulty: 'easy',
  },
  {
    question: 'Which scheduling algorithm is preemptive?',
    correct_answer: 'Round Robin',
    incorrect_answers: ['FCFS', 'SJF', 'Priority Scheduling'],
    category: 'Operating Systems',
    difficulty: 'medium',
  },
  {
    question: 'Which data structure is used in a depth-first search (DFS)?',
    correct_answer: 'Stack',
    incorrect_answers: ['Queue', 'Array', 'Linked List'],
    category: 'Algorithms',
    difficulty: 'easy',
  },
  {
    question: 'In an OS, what is a deadlock?',
    correct_answer: 'A state where processes wait indefinitely for resources held by each other.',
    incorrect_answers: [
      'A process running infinitely without I/O.',
      'An interrupted process during execution.',
      'A terminated process that is still in memory.',
    ],
    category: 'Operating Systems',
    difficulty: 'medium',
  },
  {
    question: 'Which normal form removes transitive dependency?',
    correct_answer: '3NF',
    incorrect_answers: ['1NF', '2NF', 'BCNF'],
    category: 'DBMS',
    difficulty: 'medium',
  },
  {
    question: 'Which algorithm is used to find the shortest path in a weighted graph?',
    correct_answer: 'Dijkstra’s Algorithm',
    incorrect_answers: ['Prim’s Algorithm', 'Kruskal’s Algorithm', 'Bellman-Ford'],
    category: 'Algorithms',
    difficulty: 'medium',
  },
  {
    question: 'Which data structure is best for implementing recursion?',
    correct_answer: 'Stack',
    incorrect_answers: ['Queue', 'Linked List', 'Tree'],
    category: 'Data Structures',
    difficulty: 'easy',
  },
  {
    question: 'What is the main function of a database index?',
    correct_answer: 'To speed up query retrieval operations.',
    incorrect_answers: [
      'To ensure data integrity.',
      'To reduce database size.',
      'To remove duplicate records.',
    ],
    category: 'DBMS',
    difficulty: 'easy',
  },
  {
    question: 'In paging, what does the TLB store?',
    correct_answer: 'Recent virtual-to-physical address translations.',
    incorrect_answers: [
      'Only page table entries.',
      'Disk block mappings.',
      'Kernel data structures.',
    ],
    category: 'Operating Systems',
    difficulty: 'hard',
  },
];

(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://prabodhkc:Triviaquestion@cluster0.bcqw6mb.mongodb.net/?appName=Cluster0',
    );
    console.log('✅ Connected to MongoDB');

    await TriviaProblem.deleteMany({});
    await TriviaProblem.insertMany(triviaData);
    console.log('✅ Trivia problems seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding trivia problems:', error);
  } finally {
    process.exit();
  }
})();
