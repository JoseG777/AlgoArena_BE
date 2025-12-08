import dotenv from 'dotenv';
import { connectDb } from '../lib/db_connect';
import { Problem } from '../model/Problem';

dotenv.config();

const problems = [
 
{
  problemId: "sum_two_numbers_001",
  title: "Sum of Two Numbers",
  difficulty: "easy",
  problemDescription: `
Given two integers a and b, return their sum.

Input:
- Two integers a and b.

Output:
- Integer sum: a + b.
  `,
  startingCode: {
    typescript: `
export function sumTwoNumbers(a: number, b: number): number {
  // TODO: return the sum of a and b
  return 0;
}
    `,
    python: `
def sum_two_numbers(a, b):
    # TODO: return the sum of a and b
    return 0
    `
  },
  testHarness: {
    typescript: `
import { sumTwoNumbers } from "./solution";

const tests = [
  { args: [1, 2], expected: 3 },
  { args: [-5, 10], expected: 5 },
  { args: [1000000000, 1], expected: 1000000001 },
];

for (const t of tests) {
  const result = sumTwoNumbers(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import sum_two_numbers

tests = [
  { "args": (1,2), "expected": 3 },
  { "args": (-5,10), "expected": 5 },
  { "args": (1000000000,1), "expected": 1000000001 },
]

for t in tests:
    result = sum_two_numbers(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "reverse_string_001",
  title: "Reverse a String",
  difficulty: "easy",
  problemDescription: `
Given a string s, return the reversed version of the string.
  `,
  startingCode: {
    typescript: `
export function reverseString(s: string): string {
  // TODO: reverse the string
  return "";
}
    `,
    python: `
def reverse_string(s):
    # TODO: return reversed string
    return ""
    `
  },
  testHarness: {
    typescript: `
import { reverseString } from "./solution";

const tests = [
  { args: ["abc"], expected: "cba" },
  { args: ["Hello"], expected: "olleH" },
  { args: ["racecar"], expected: "racecar" },
];

for (const t of tests) {
  const result = reverseString(...t.args);
  console.log(JSON.stringify(result) === JSON.stringify(t.expected) ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import reverse_string

tests = [
  { "args": ("abc",), "expected": "cba" },
  { "args": ("Hello",), "expected": "olleH" },
  { "args": ("racecar",), "expected": "racecar" },
]

for t in tests:
    result = reverse_string(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "count_vowels_001",
  title: "Count Vowels",
  difficulty: "easy",
  problemDescription: `
Given a string s, return the number of vowels (a, e, i, o, u — case insensitive).
  `,
  startingCode: {
    typescript: `
export function countVowels(s: string): number {
  // TODO: count vowels
  return 0;
}
    `,
    python: `
def count_vowels(s):
    # TODO: count vowels
    return 0
    `
  },
  testHarness: {
    typescript: `
import { countVowels } from "./solution";

const tests = [
  { args: ["hello"], expected: 2 },
  { args: ["AEIOU"], expected: 5 },
  { args: ["xyz"], expected: 0 },
];

for (const t of tests) {
  const result = countVowels(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import count_vowels

tests = [
  { "args": ("hello",), "expected": 2 },
  { "args": ("AEIOU",), "expected": 5 },
  { "args": ("xyz",), "expected": 0 },
]

for t in tests:
    result = count_vowels(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},
{
  problemId: "is_palindrome_001",
  title: "Palindrome Check",
  difficulty: "easy",
  problemDescription: `
Return true if string s reads the same forward and backward.
  `,
  startingCode: {
    typescript: `
export function isPalindrome(s: string): boolean {
  // TODO: check if palindrome
  return false;
}
    `,
    python: `
def is_palindrome(s):
    # TODO: check palindrome
    return False
    `
  },
  testHarness: {
    typescript: `
import { isPalindrome } from "./solution";

const tests = [
  { args: ["racecar"], expected: true },
  { args: ["hello"], expected: false },
  { args: ["abba"], expected: true },
];

for (const t of tests) {
  const result = isPalindrome(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import is_palindrome

tests = [
  { "args": ("racecar",), "expected": True },
  { "args": ("hello",), "expected": False },
  { "args": ("abba",), "expected": True },
]

for t in tests:
    result = is_palindrome(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},
{
  problemId: "max_three_numbers_001",
  title: "Maximum of Three Numbers",
  difficulty: "easy",
  problemDescription: `
Return the greatest of three integers a, b, and c.
  `,
  startingCode: {
    typescript: `
export function maxOfThree(a: number, b: number, c: number): number {
  // TODO: return max value
  return 0;
}
    `,
    python: `
def max_of_three(a, b, c):
    # TODO: return max value
    return 0
    `
  },
  testHarness: {
    typescript: `
import { maxOfThree } from "./solution";

const tests = [
  { args: [1, 2, 3], expected: 3 },
  { args: [10, 5, 7], expected: 10 },
  { args: [-1, -5, -3], expected: -1 },
];

for (const t of tests) {
  const result = maxOfThree(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import max_of_three

tests = [
  { "args": (1,2,3), "expected": 3 },
  { "args": (10,5,7), "expected": 10 },
  { "args": (-1,-5,-3), "expected": -1 },
]

for t in tests:
    result = max_of_three(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "fizzbuzz_001",
  title: "FizzBuzz",
  difficulty: "easy",
  problemDescription: `
Return array from 1 to n replacing:
- "Fizz" for multiples of 3
- "Buzz" for multiples of 5
- "FizzBuzz" for both.
  `,
  startingCode: {
    typescript: `
export function fizzBuzz(n: number): (string | number)[] {
  // TODO: implement FizzBuzz
  return [];
}
    `,
    python: `
def fizz_buzz(n):
    # TODO: implement FizzBuzz
    return []
    `
  },
  testHarness: {
    typescript: `
import { fizzBuzz } from "./solution";

const tests = [
  { args: [3], expected: [1,2,"Fizz"] },
  { args: [5], expected: [1,2,"Fizz",4,"Buzz"] },
];

for (const t of tests) {
  const result = fizzBuzz(...t.args);
  console.log(JSON.stringify(result) === JSON.stringify(t.expected) ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import fizz_buzz
import json

tests = [
  { "args": (3,), "expected": [1,2,"Fizz"] },
  { "args": (5,), "expected": [1,2,"Fizz",4,"Buzz"] },
]

for t in tests:
    result = fizz_buzz(*t["args"])
    print("PASS" if json.dumps(result) == json.dumps(t["expected"]) else "FAIL", result)
    `
  }
},
{
  problemId: "factorial_001",
  title: "Factorial",
  difficulty: "easy",
  problemDescription: `
Return n! for a non-negative integer n.
  `,
  startingCode: {
    typescript: `
export function factorial(n: number): number {
  // TODO: compute factorial
  return 0;
}
    `,
    python: `
def factorial(n):
    # TODO compute factorial
    return 0
    `
  },
  testHarness: {
    typescript: `
import { factorial } from "./solution";

const tests = [
  { args: [0], expected: 1 },
  { args: [5], expected: 120 },
  { args: [7], expected: 5040 },
];

for (const t of tests) {
  const result = factorial(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import factorial

tests = [
  { "args": (0,), "expected": 1 },
  { "args": (5,), "expected": 120 },
  { "args": (7,), "expected": 5040 },
]

for t in tests:
    result = factorial(*t["args"])
    print("PASS" if result == t["expected"] else "FAIL", result)
    `
  }
},
{
  problemId: "even_or_odd_001",
  title: "Even or Odd",
  difficulty: "easy",
  problemDescription: `
Return "Even" if n is even, else "Odd".
  `,
  startingCode: {
    typescript: `
export function evenOrOdd(n: number): string {
  // TODO: return Even or Odd
  return "";
}
    `,
    python: `
def even_or_odd(n):
    return ""
    `
  },
  testHarness: {
    typescript: `
import { evenOrOdd } from "./solution";

const tests = [
  { args: [1], expected: "Odd" },
  { args: [2], expected: "Even" },
  { args: [12345], expected: "Odd" },
];

for (const t of tests) {
  const result = evenOrOdd(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import even_or_odd

tests = [
  { "args": (1,), "expected": "Odd" },
  { "args": (2,), "expected": "Even" },
  { "args": (12345,), "expected": "Odd" },
]

for t in tests:
    result = even_or_odd(*t["args"])
    print("PASS" if result==t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "find_min_001",
  title: "Find Minimum",
  difficulty: "easy",
  problemDescription: `
Given an array of integers, return the smallest value.
  `,
  startingCode: {
    typescript: `
export function findMin(nums: number[]): number {
  // TODO: find minimum
  return 0;
}
    `,
    python: `
def find_min(nums):
    # TODO
    return 0
    `
  },
  testHarness: {
    typescript: `
import { findMin } from "./solution";

const tests = [
  { args: [[3,1,2]], expected: 1 },
  { args: [[10,5,7]], expected: 5 },
  { args: [[-1,-5,-3]], expected: -5 },
];

for (const t of tests) {
  const result = findMin(...t.args);
  console.log(result === t.expected ? "PASS" : "FAIL", result);
}
    `,
    python: `
from solution import find_min

tests = [
  { "args": ([3,1,2],), "expected": 1 },
  { "args": ([10,5,7],), "expected": 5 },
  { "args": ([-1,-5,-3],), "expected": -5 },
]

for t in tests:
    result = find_min(*t["args"])
    print("PASS" if result==t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "remove_duplicates_001",
  title: "Remove Duplicates",
  difficulty: "easy",
  problemDescription: `
Given an array, return a new array with all duplicates removed.
  `,
  startingCode: {
    typescript: `
export function removeDuplicates(nums: number[]): number[] {
  // TODO: return unique list
  return [];
}
    `,
    python: `
def remove_duplicates(nums):
    return []
    `
  },
  testHarness: {
    typescript: `
import { removeDuplicates } from "./solution";

const tests = [
  { args: [[1,1,2]], expected: [1,2] },
  { args: [[4,4,4,4]], expected: [4] },
  { args: [[1,2,3]], expected: [1,2,3] },
];

for (const t of tests) {
  const result = removeDuplicates(...t.args).sort((a,b)=>a-b);
  const expected = [...t.expected].sort((a,b)=>a-b);
  console.log(JSON.stringify(result)===JSON.stringify(expected)?"PASS":"FAIL", result);
}
    `,
    python: `
from solution import remove_duplicates
import json

tests = [
  { "args": ([1,1,2],), "expected": [1,2] },
  { "args": ([4,4,4,4],), "expected": [4] },
  { "args": ([1,2,3],), "expected": [1,2,3] },
]

for t in tests:
    result = sorted(remove_duplicates(*t["args"]))
    exp = sorted(t["expected"])
    print("PASS" if json.dumps(result)==json.dumps(exp) else "FAIL", result)
    `
  }
},

{
  problemId: "fibonacci_001",
  title: "Fibonacci Number",
  difficulty: "medium",
  problemDescription: `
Return the nth Fibonacci number (0-indexed).
  `,
  startingCode: {
    typescript: `
export function fibonacci(n: number): number {
  // TODO
  return 0;
}
    `,
    python: `
def fibonacci(n):
    return 0
    `
  },
  testHarness: {
    typescript: `
import { fibonacci } from "./solution";

const tests = [
  { args: [0], expected: 0 },
  { args: [1], expected: 1 },
  { args: [10], expected: 55 },
];

for (const t of tests) {
  console.log(fibonacci(...t.args) === t.expected ? "PASS" : "FAIL");
}
    `,
    python:
    `
from solution import fibonacci

tests = [
  { "args": (0,), "expected": 0 },
  { "args": (1,), "expected": 1 },
  { "args": (10,), "expected": 55 },
]

for t in tests:
    print("PASS" if fibonacci(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "valid_parentheses_001",
  title: "Valid Parentheses",
  difficulty: "medium",
  problemDescription: `
Return true if parentheses/brackets/braces are valid and correctly matched.
  `,
  startingCode: {
    typescript: `
export function isValidParentheses(s: string): boolean {
  // TODO
  return false;
}
    `,
    python: `
def is_valid_parentheses(s):
    return False
    `
  },
  testHarness: {
    typescript: `
import { isValidParentheses } from "./solution";

const tests = [
  { args: ["()"], expected: true },
  { args: ["()[]{}"], expected: true },
  { args: ["(]"], expected: false },
];

for (const t of tests) {
  console.log(isValidParentheses(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import is_valid_parentheses

tests = [
  { "args": ("()",), "expected": True },
  { "args": ("()[]{}",), "expected": True },
  { "args": ("(]",), "expected": False },
]

for t in tests:
    print("PASS" if is_valid_parentheses(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "merge_sorted_arrays_001",
  title: "Merge Sorted Arrays",
  difficulty: "medium",
  problemDescription: `
Given two sorted arrays, return a single sorted merged array.
  `,
  startingCode: {
    typescript: `
export function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
  return [];
}
    `,
    python: `
def merge_sorted_arrays(arr1, arr2):
    return []
    `
  },
  testHarness: {
    typescript: `
import { mergeSortedArrays } from "./solution";

const tests = [
  { args: [[1,3,5],[2,4,6]], expected: [1,2,3,4,5,6] },
  { args: [[],[1,2]], expected: [1,2] },
];

for (const t of tests) {
  const result = mergeSortedArrays(...t.args);
  console.log(JSON.stringify(result)===JSON.stringify(t.expected)?"PASS":"FAIL");
}
    `,
    python: `
from solution import merge_sorted_arrays
import json

tests = [
  { "args": ([1,3,5],[2,4,6]), "expected": [1,2,3,4,5,6] },
  { "args": ([],[1,2]), "expected": [1,2] },
]

for t in tests:
    result = merge_sorted_arrays(*t["args"])
    print("PASS" if json.dumps(result)==json.dumps(t["expected"]) else "FAIL")
    `
  }
},
{
  problemId: "longest_word_001",
  title: "Longest Word in Sentence",
  difficulty: "medium",
  problemDescription: `
Return the longest word in a sentence; if tie, return the first.
  `,
  startingCode: {
    typescript: `
export function longestWord(sentence: string): string {
  return "";
}
    `,
    python: `
def longest_word(sentence):
    return ""
    `
  },
  testHarness: {
    typescript: `
import { longestWord } from "./solution";

const tests = [
  { args: ["I love programming"], expected: "programming" },
  { args: ["Hello world"], expected: "Hello" },
];

for (const t of tests) {
  console.log(longestWord(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import longest_word

tests = [
  { "args": ("I love programming",), "expected": "programming" },
  { "args": ("Hello world",), "expected": "Hello" },
]

for t in tests:
    print("PASS" if longest_word(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "array_intersection_001",
  title: "Array Intersection",
  difficulty: "medium",
  problemDescription: `
Return the unique intersection of two arrays.
  `,
  startingCode: {
    typescript: `
export function arrayIntersection(nums1: number[], nums2: number[]): number[] {
  return [];
}
    `,
    python: `
def array_intersection(nums1, nums2):
    return []
    `
  },
  testHarness: {
    typescript: `
import { arrayIntersection } from "./solution";

const tests = [
  { args: [[1,2,2,1],[2,2]], expected: [2] },
  { args: [[4,5],[5,6]], expected: [5] },
];

for (const t of tests) {
  const result = arrayIntersection(...t.args).sort((a,b)=>a-b);
  const expected = [...t.expected].sort((a,b)=>a-b);
  console.log(JSON.stringify(result)==JSON.stringify(expected)?"PASS":"FAIL");
}
    `,
    python: `
from solution import array_intersection
import json

tests = [
  { "args": ([1,2,2,1],[2,2]), "expected": [2] },
  { "args": ([4,5],[5,6]), "expected": [5] },
]

for t in tests:
    result = sorted(array_intersection(*t["args"]))
    exp = sorted(t["expected"])
    print("PASS" if json.dumps(result)==json.dumps(exp) else "FAIL")
    `
  }
},

{
  problemId: "balanced_string_001",
  title: "Balanced String",
  difficulty: "medium",
  problemDescription: `
Return true if count of 'a' equals count of 'b'.
  `,
  startingCode: {
    typescript: `
export function isBalancedString(s: string): boolean {
  return false;
}
    `,
    python: `
def is_balanced_string(s):
    return False
    `
  },
  testHarness: {
    typescript: `
import { isBalancedString } from "./solution";

const tests = [
  { args: ["aabb"], expected: true },
  { args: ["aaab"], expected: false },
];

for (const t of tests) {
  console.log(isBalancedString(...t.args)==t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import is_balanced_string

tests = [
  { "args": ("aabb",), "expected": True },
  { "args": ("aaab",), "expected": False },
]

for t in tests:
    print("PASS" if is_balanced_string(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "lis_001",
  title: "Longest Increasing Subsequence",
  difficulty: "hard",
  problemDescription: `
Given an array of integers nums, return the length of the longest strictly increasing subsequence.
  `,
  startingCode: {
    typescript: `
export function lengthOfLIS(nums: number[]): number {
  // TODO
  return 0;
}
    `,
    python: `
def length_of_lis(nums):
    return 0
    `
  },
  testHarness: {
    typescript: `
import { lengthOfLIS } from "./solution";

const tests = [
  { args: [[10,9,2,5,3,7,101,18]], expected: 4 },
  { args: [[0,1,0,3,2,3]], expected: 4 },
];

for (const t of tests) {
  console.log(lengthOfLIS(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import length_of_lis

tests = [
  { "args": ([10,9,2,5,3,7,101,18],), "expected": 4 },
  { "args": ([0,1,0,3,2,3],), "expected": 4 },
]

for t in tests:
    print("PASS" if length_of_lis(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "num_islands_001",
  title: "Number of Islands",
  difficulty: "hard",
  problemDescription: `
Given a 2D grid of '1's (land) and '0's (water), count the number of islands.
Islands connect vertically or horizontally.
  `,
  startingCode: {
    typescript: `
export function numIslands(grid: string[][]): number {
  return 0;
}
    `,
    python: `
def num_islands(grid):
    return 0
    `
  },
  testHarness: {
    typescript: `
import { numIslands } from "./solution";

const tests = [
  { 
    args: [[["1","1","0","0"],["1","0","0","1"],["0","0","1","1"]]],
    expected: 3
  }
];

for (const t of tests) {
  console.log(numIslands(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import num_islands

tests = [
  {
    "args": ((["1","1","0","0"],["1","0","0","1"],["0","0","1","1"]),),
    "expected": 3
  }
]

for t in tests:
    print("PASS" if num_islands(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "lru_cache_001",
  title: "LRU Cache",
  difficulty: "hard",
  problemDescription: `
Design an LRU cache with get() and put() functions.
  `,
  startingCode: {
    typescript: `
export class LRUCache {
  constructor(capacity: number) {
    // TODO
  }

  get(key: number): number {
    return -1;
  }

  put(key: number, value: number): void {
    // TODO
  }
}
    `,
    python: `
class LRUCache:
    def __init__(self, capacity):
        pass

    def get(self, key):
        return -1

    def put(self, key, value):
        pass
    `
  },
  testHarness: {
    typescript: `
import { LRUCache } from "./solution";

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // expected 1
cache.put(3, 3);           // evicts key 2
console.log(cache.get(2)); // expected -1

console.log("Hidden backend tests applied.");
    `,
    python: `
from solution import LRUCache

cache = LRUCache(2)
cache.put(1,1)
cache.put(2,2)
print(cache.get(1))
cache.put(3,3)
print(cache.get(2))

print("Hidden backend tests applied.")
    `
  }
},
{
  problemId: "word_ladder_001",
  title: "Word Ladder",
  difficulty: "hard",
  problemDescription: `
Return the length of the shortest transformation sequence from beginWord to endWord.
Only one letter can change at a time and intermediate words must exist in wordList.
  `,
  startingCode: {
    typescript: `
export function wordLadder(beginWord: string, endWord: string, wordList: string[]): number {
  return 0;
}
    `,
    python: `
def word_ladder(beginWord, endWord, wordList):
    return 0
    `
  },
  testHarness: {
    typescript: `
import { wordLadder } from "./solution";

const tests = [
  { args: ["hit","cog",["hot","dot","dog","lot","log","cog"]], expected: 5 },
];

for (const t of tests) {
  console.log(wordLadder(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import word_ladder

tests = [
  { "args": ("hit","cog",["hot","dot","dog","lot","log","cog"]), "expected": 5 }
]

for t in tests:
    print("PASS" if word_ladder(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "robot_path_decoder_001",
  title: "Robot Path Decoder",
  difficulty: "hard",
  problemDescription: `
Decode nested repetition patterns like:
"2[NE]" => "NENE"
"3[N2[E]]" => "NEENEENE"
  `,
  startingCode: {
    typescript: `
export function decodePath(s: string): string {
  return "";
}
    `,
    python: `
def decode_path(s):
    return ""
    `
  },
  testHarness: {
    typescript: `
import { decodePath } from "./solution";

const tests = [
  { args: ["2[NE]"], expected: "NENE" },
  { args: ["3[N2[E]]"], expected: "NEENEENE" },
];

for (const t of tests) {
  console.log(decodePath(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import decode_path

tests = [
  { "args": ("2[NE]",), "expected": "NENE" },
  { "args": ("3[N2[E]]",), "expected": "NEENEENE" },
]

for t in tests:
    print("PASS" if decode_path(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "spiral_sequence_check_001",
  title: "Spiral Sequence Check",
  difficulty: "hard",
  problemDescription: `
Given a matrix, return true if seq[] appears as a continuous subsequence in its spiral order.
  `,
  startingCode: {
    typescript: `
export function spiralContains(matrix: number[][], seq: number[]): boolean {
  return false;
}
    `,
    python: `
def spiral_contains(matrix, seq):
    return False
    `
  },
  testHarness: {
    typescript: `
import { spiralContains } from "./solution";

const tests = [
  {
    args: [[[1,2,3],[4,5,6],[7,8,9]], [6,9,8]],
    expected: true
  },
  {
    args: [[[1,2,3],[4,5,6],[7,8,9]], [2,5]],
    expected: false
  }
];

for (const t of tests) {
  console.log(spiralContains(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import spiral_contains

tests = [
  { "args": ([[1,2,3],[4,5,6],[7,8,9]],[6,9,8]), "expected": True },
  { "args": ([[1,2,3],[4,5,6],[7,8,9]],[2,5]), "expected": False },
]

for t in tests:
    print("PASS" if spiral_contains(*t["args"])==t["expected"] else "FAIL")
    `
  }
},
{
  problemId: "alternating_sum_001",
  title: "Alternating Sum Sequence",
  difficulty: "easy",
  problemDescription: `
Given an array nums, compute the alternating sum:
index 0 adds, index 1 subtracts, index 2 adds, index 3 subtracts, etc.

Example:
[5,3,1] → 5 - 3 + 1 = 3
  `,
  startingCode: {
    typescript: `
export function alternatingSum(nums: number[]): number {
  // TODO
  return 0;
}
    `,
    python: `
def alternating_sum(nums):
    # TODO
    return 0
    `
  },
  testHarness: {
    typescript: `
import { alternatingSum } from "./solution";

const tests = [
  { args: [[5,3,1]], expected: 3 },
  { args: [[10]], expected: 10 },
  { args: [[2,2,2,2]], expected: 0 },
];

for (const t of tests) {
  const result = alternatingSum(...t.args);
  console.log(result===t.expected?"PASS":"FAIL", result);
}
    `,
    python: `
from solution import alternating_sum

tests = [
  { "args": ([5,3,1],), "expected": 3 },
  { "args": ([10],), "expected": 10 },
  { "args": ([2,2,2,2],), "expected": 0 },
]

for t in tests:
    result = alternating_sum(*t["args"])
    print("PASS" if result==t["expected"] else "FAIL", result)
    `
  }
},

{
  problemId: "char_frequency_001",
  title: "Character Frequency Map",
  difficulty: "easy",
  problemDescription: `
Return an object mapping each character in string s to its number of occurrences.

Example:
"abca" → { a:2, b:1, c:1 }
  `,
  startingCode: {
    typescript: `
export function charFrequency(s: string): Record<string, number> {
  return {};
}
    `,
    python: `
def char_frequency(s):
    return {}
    `
  },
  testHarness: {
    typescript: `
import { charFrequency } from "./solution";

const tests = [
  { args: ["abca"], expected: {a:2,b:1,c:1} },
  { args: ["zzz"], expected: {z:3} }
];

for (const t of tests) {
  const result = charFrequency(...t.args);
  console.log(JSON.stringify(result)==JSON.stringify(t.expected)?"PASS":"FAIL", result);
}
    `,
    python: `
from solution import char_frequency
import json

tests = [
  { "args": ("abca",), "expected": {"a":2,"b":1,"c":1} },
  { "args": ("zzz",), "expected": {"z":3} },
]

for t in tests:
    result = char_frequency(*t["args"])
    print("PASS" if json.dumps(result)==json.dumps(t["expected"]) else "FAIL", result)
    `
  }
},
{
  problemId: "char_frequency_001",
  title: "Character Frequency Map",
  difficulty: "easy",
  problemDescription: `
Return an object mapping each character in string s to its number of occurrences.

Example:
"abca" → { a:2, b:1, c:1 }
  `,
  startingCode: {
    typescript: `
export function charFrequency(s: string): Record<string, number> {
  return {};
}
    `,
    python: `
def char_frequency(s):
    return {}
    `
  },
  testHarness: {
    typescript: `
import { charFrequency } from "./solution";

const tests = [
  { args: ["abca"], expected: {a:2,b:1,c:1} },
  { args: ["zzz"], expected: {z:3} }
];

for (const t of tests) {
  const result = charFrequency(...t.args);
  console.log(JSON.stringify(result)==JSON.stringify(t.expected)?"PASS":"FAIL", result);
}
    `,
    python: `
from solution import char_frequency
import json

tests = [
  { "args": ("abca",), "expected": {"a":2,"b":1,"c":1} },
  { "args": ("zzz",), "expected": {"z":3} },
]

for t in tests:
    result = char_frequency(*t["args"])
    print("PASS" if json.dumps(result)==json.dumps(t["expected"]) else "FAIL", result)
    `
  }
},
{
  problemId: "first_unique_char_001",
  title: "First Non-Repeating Character",
  difficulty: "medium",
  problemDescription: `
Return the first character in string s that appears exactly once.
If none exist, return an empty string.

Example:
"swiss" → "w"
  `,
  startingCode: {
    typescript: `
export function firstUniqueChar(s: string): string {
  return "";
}
    `,
    python: `
def first_unique_char(s):
    return ""
    `
  },
  testHarness: {
    typescript: `
import { firstUniqueChar } from "./solution";

const tests = [
  { args: ["swiss"], expected: "w" },
  { args: ["aabbcc"], expected: "" },
];

for (const t of tests) {
  const result = firstUniqueChar(...t.args);
  console.log(result===t.expected?"PASS":"FAIL", result);
}
    `,
    python: `
from solution import first_unique_char

tests = [
  { "args": ("swiss",), "expected": "w" },
  { "args": ("aabbcc",), "expected": "" },
]

for t in tests:
    result = first_unique_char(*t["args"])
    print("PASS" if result==t["expected"] else "FAIL", result)
    `
  }
},
{
  problemId: "gcd_array_001",
  title: "GCD of Array",
  difficulty: "medium",
  problemDescription: `
Compute the greatest common divisor (GCD) of all numbers in an array.

Example:
[8, 12, 16] → 4
  `,
  startingCode: {
    typescript: `
export function gcdOfArray(nums: number[]): number {
  return 0;
}
    `,
    python: `
def gcd_of_array(nums):
    return 0
    `
  },
  testHarness: {
    typescript: `
import { gcdOfArray } from "./solution";

const tests = [
  { args: [[8,12,16]], expected: 4 },
  { args: [[3,9,27]], expected: 3 },
];

for (const t of tests) {
  console.log(gcdOfArray(...t.args)===t.expected?"PASS":"FAIL");
}
    `,
    python: `
from solution import gcd_of_array

tests = [
  { "args": ([8,12,16],), "expected": 4 },
  { "args": ([3,9,27],), "expected": 3 },
]

for t in tests:
    print("PASS" if gcd_of_array(*t["args"])==t["expected"] else "FAIL")
    `
  }
},

  
];

(async () => {
  try {
    await connectDb();

    for (const p of problems) {
      const exists = await Problem.findOne({ problemId: p.problemId });
      if (exists) {
        console.log(`Problem already exists: ${p.problemId} (${p.title})`);
        continue;
      }

      await Problem.create(p);
      console.log(`Added: ${p.problemId} (${p.title})`);
    }
  } catch (err) {
    console.error(err);
  }
})();
