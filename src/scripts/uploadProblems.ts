import dotenv from 'dotenv';
import { connectDb } from '../lib/db_connect';
import { Problem } from '../model/Problem';

dotenv.config();

const problems = [
  {
    problemId: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    problemDescription:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    startingCode: {
      typescript:
        'function twoSum(nums: number[], target: number): number[] {\n  const lookup: Record<number, number> = {};\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (lookup[diff] !== undefined) {\n      return [lookup[diff], i];\n    }\n    lookup[nums[i]] = i;\n  }\n  return [];\n}\n',
      python:
        'def two_sum(nums, target):\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup:\n            return [lookup[target - n], i]\n        lookup[n] = i\n    return []\n',
      java: 'import java.util.*;\n\nclass Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> lookup = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int diff = target - nums[i];\n      if (lookup.containsKey(diff)) {\n        return new int[] { lookup.get(diff), i };\n      }\n      lookup.put(nums[i], i);\n    }\n    return new int[] {};\n  }\n}\n',
    },
    testHarness: {
      typescript:
        'function runTests() {\n  const testCases: { args: [number[], number]; expected: number[] }[] = [\n    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },\n    { args: [[3, 2, 4], 6], expected: [1, 2] },\n    { args: [[3, 3], 6], expected: [0, 1] },\n    { args: [[1, 2, 3], 7], expected: [] },\n  ];\n\n  testCases.forEach((tc, i) => {\n    const result = twoSum(...tc.args);\n    console.log(\n      "Case " + (i + 1) + ": " +\n      (JSON.stringify(result) === JSON.stringify(tc.expected) ? "PASS" : "FAIL") +\n      " | Got " + JSON.stringify(result) +\n      ", Expected " + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n',
      python:
        "def run_tests():\n    test_cases = [\n        (([2,7,11,15], 9), [0,1]),\n        (([3,2,4], 6), [1,2]),\n        (([3,3], 6), [0,1]),\n        (([1,2,3], 7), []),\n    ]\n    for i, (args, expected) in enumerate(test_cases, 1):\n        result = two_sum(*args)\n        print(f\"Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        'int[][] numsCases = new int[][] { {2,7,11,15}, {3,2,4}, {3,3}, {1,2,3} };\n' +
        'int[] targets = new int[] { 9, 6, 6, 7 };\n' +
        'int[][] expected = new int[][] { {0,1}, {1,2}, {0,1}, {} };\n' +
        '\n' +
        'for (int i = 0; i < numsCases.length; i++) {\n' +
        '  int[] result = sol.twoSum(numsCases[i], targets[i]);\n' +
        '  boolean pass = Arrays.equals(result, expected[i]);\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + Arrays.toString(result) + ", Expected " + Arrays.toString(expected[i])\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    problemDescription:
      'Given the head of a singly linked list, reverse the list and return the new head.',
    startingCode: {
      typescript:
        'type ListNode = { val: number; next: ListNode | null };\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  let curr: ListNode | null = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}\n',
      python:
        "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head: 'ListNode | None') -> 'ListNode | None':\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n",
java:
  'import java.util.*;\n' +
  '\n' +
  'class ListNode {\n' +
  '  int val;\n' +
  '  ListNode next;\n' +
  '  ListNode(int v) { val = v; }\n' +
  '  ListNode(int v, ListNode n) { val = v; next = n; }\n' +
  '}\n' +
  '\n' +
  'class LL {\n' +
  '  static ListNode fromArray(int[] arr) {\n' +
  '    ListNode dummy = new ListNode(0);\n' +
  '    ListNode tail = dummy;\n' +
  '    for (int v : arr) { tail.next = new ListNode(v); tail = tail.next; }\n' +
  '    return dummy.next;\n' +
  '  }\n' +
  '\n' +
  '  static int[] toArray(ListNode head) {\n' +
  '    int n = 0;\n' +
  '    for (ListNode c = head; c != null; c = c.next) n++;\n' +
  '    int[] out = new int[n];\n' +
  '    int i = 0;\n' +
  '    for (ListNode c = head; c != null; c = c.next) out[i++] = c.val;\n' +
  '    return out;\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  'class Solution {\n' +
  '  public ListNode reverseList(ListNode head) {\n' +
  '    // TODO: Implement\n' +
  '    return null;\n' +
  '  }\n' +
  '}\n'

    },
    testHarness: {
      typescript:
        "function fromArray(arr: number[]): any {\n  let dummy: any = { val: 0, next: null };\n  let tail = dummy;\n  for (const v of arr) {\n    tail.next = { val: v, next: null };\n    tail = tail.next;\n  }\n  return dummy.next;\n}\n\nfunction toArray(head: any): number[] {\n  const out: number[] = [];\n  let curr = head;\n  while (curr) {\n    out.push(curr.val);\n    curr = curr.next;\n  }\n  return out;\n}\n\nfunction runTests() {\n  const testCases = [\n    { input: [], expected: [] },\n    { input: [1], expected: [1] },\n    { input: [1,2,3,4,5], expected: [5,4,3,2,1] },\n    { input: [2,2,2], expected: [2,2,2] }\n  ];\n\n  testCases.forEach((tc, i) => {\n    const head = fromArray(tc.input);\n    const out = reverseList(head);\n    const arr = toArray(out);\n    const pass = JSON.stringify(arr) === JSON.stringify(tc.expected);\n    console.log(\n      'Case ' + (i + 1) + ': ' + (pass ? 'PASS' : 'FAIL') +\n      ' | Got ' + JSON.stringify(arr) + ', Expected ' + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n",
      python:
        "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef from_array(arr):\n    dummy = ListNode(0)\n    tail = dummy\n    for v in arr:\n        tail.next = ListNode(v)\n        tail = tail.next\n    return dummy.next\n\ndef to_array(head):\n    out = []\n    curr = head\n    while curr:\n        out.append(curr.val)\n        curr = curr.next\n    return out\n\n# reverse_list is implemented in startingCode\n\ndef run_tests():\n    tests = [\n        ([], []),\n        ([1], [1]),\n        ([1,2,3,4,5], [5,4,3,2,1]),\n        ([2,2,2], [2,2,2])\n    ]\n    for i, (inp, expected) in enumerate(tests, 1):\n        head = from_array(inp)\n        out = reverse_list(head)\n        arr = to_array(out)\n        print(f\"Case {i}: {'PASS' if arr == expected else 'FAIL'} | Got {arr}, Expected {expected}\")\n\nrun_tests()\n",
java:
  'Solution sol = new Solution();\n' +
  '\n' +
  'int[][] inputs = new int[][] { {}, {1}, {1,2,3,4,5}, {2,2,2} };\n' +
  'int[][] expected = new int[][] { {}, {1}, {5,4,3,2,1}, {2,2,2} };\n' +
  '\n' +
  'for (int i = 0; i < inputs.length; i++) {\n' +
  '  ListNode head = LL.fromArray(inputs[i]);\n' +
  '  ListNode outHead = sol.reverseList(head);\n' +
  '  int[] result = LL.toArray(outHead);\n' +
  '  boolean pass = Arrays.equals(result, expected[i]);\n' +
  '  System.out.println(\n' +
  '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
  '    " | Got " + Arrays.toString(result) + ", Expected " + Arrays.toString(expected[i])\n' +
  '  );\n' +
  '}\n'


    },
  },
  {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    problemDescription:
      'Given a string s containing just the characters ()[]{} determine if the input string is valid.',
    startingCode: {
      typescript:
        'function isValid(s: string): boolean {\n' +
        '  const stack: string[] = [];\n' +
        '  const match: any = { ")": "(", "]": "[", "}": "{" };\n' +
        '  for (let i = 0; i < s.length; i++) {\n' +
        '    const c = s.charAt(i);\n' +
        '    if (c === "(" || c === "[" || c === "{") {\n' +
        '      stack.push(c);\n' +
        '    } else {\n' +
        '      if (stack.length === 0) return false;\n' +
        '      const top = stack.pop();\n' +
        '      if (top !== match[c]) return false;\n' +
        '    }\n' +
        '  }\n' +
        '  return stack.length === 0;\n' +
        '}\n',
      python:
        'def is_valid(s: str) -> bool:\n' +
        '    stack = []\n' +
        "    match = {')': '(', ']': '[', '}': '{'}\n" +
        '    for ch in s:\n' +
        "        if ch in '([{':\n" +
        '            stack.append(ch)\n' +
        '        else:\n' +
        '            if not stack:\n' +
        '                return False\n' +
        '            top = stack.pop()\n' +
        '            if top != match.get(ch):\n' +
        '                return False\n' +
        '    return len(stack) == 0\n',
      java:
        'import java.util.*;\n\n' +
        'class Solution {\n' +
        '  public boolean isValid(String s) {\n' +
        '    Deque<Character> stack = new ArrayDeque<>();\n' +
        '    for (int i = 0; i < s.length(); i++) {\n' +
        '      char c = s.charAt(i);\n' +
        "      if (c == '(' || c == '[' || c == '{') {\n" +
        '        stack.push(c);\n' +
        '      } else {\n' +
        '        if (stack.isEmpty()) return false;\n' +
        '        char top = stack.pop();\n' +
        "        if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{')) {\n" +
        '          return false;\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    return stack.isEmpty();\n' +
        '  }\n' +
        '}\n',
    },

    testHarness: {
      typescript:
        'function runTests() {\n  const testCases: { s: string; expected: boolean }[] = [\n    { s: "", expected: true },\n    { s: "()", expected: true },\n    { s: "()[]{}", expected: true },\n    { s: "(]", expected: false },\n    { s: "([)]", expected: false },\n    { s: "{[]}", expected: true },\n  ];\n\n  testCases.forEach((tc, i) => {\n    const result = isValid(tc.s);\n    console.log(\n      "Case " + (i + 1) + ": " +\n      (result === tc.expected ? "PASS" : "FAIL") +\n      " | Got " + JSON.stringify(result) +\n      ", Expected " + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n',
      python:
        'def run_tests():\n    test_cases = [\n        ("", True),\n        ("()", True),\n        ("()[]{}", True),\n        ("(]", False),\n        ("([)]", False),\n        ("{[]}", True),\n    ]\n    for i, (s, expected) in enumerate(test_cases, 1):\n        result = is_valid(s)\n        print(f"Case {i}: {\'PASS\' if result == expected else \'FAIL\'} | Got {result}, Expected {expected}")\n\nrun_tests()\n',
      java:
        'Solution sol = new Solution();\n' +
        'String[] tests = new String[] { "", "()", "()[]{}", "(]", "([)]", "{[]}" };\n' +
        'boolean[] expected = new boolean[] { true, true, true, false, false, true };\n' +
        '\n' +
        'for (int i = 0; i < tests.length; i++) {\n' +
        '  boolean result = sol.isValid(tests[i]);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'palindrome-linked-list',
    title: 'Palindrome Linked List',
    difficulty: 'medium',
    problemDescription:
      'Given the head of a singly linked list, return true if it is a palindrome or false otherwise.',
    startingCode: {
      typescript:
        'type ListNode = { val: number; next: ListNode | null };\n\n' +
        'function isPalindrome(head: ListNode | null): boolean {\n' +
        '  if (!head || !head.next) return true;\n' +
        '\n' +
        '  let slow: ListNode | null = head;\n' +
        '  let fast: ListNode | null = head;\n' +
        '\n' +
        '  while (fast && fast.next) {\n' +
        '    slow = slow!.next;\n' +
        '    fast = fast.next.next;\n' +
        '  }\n' +
        '\n' +
        '  let prev: ListNode | null = null;\n' +
        '  let curr: ListNode | null = slow;\n' +
        '  while (curr) {\n' +
        '    const next = curr.next;\n' +
        '    curr.next = prev;\n' +
        '    prev = curr;\n' +
        '    curr = next;\n' +
        '  }\n' +
        '\n' +
        '  let left: ListNode | null = head;\n' +
        '  let right: ListNode | null = prev;\n' +
        '  while (right) {\n' +
        '    if (left!.val !== right.val) return false;\n' +
        '    left = left!.next;\n' +
        '    right = right.next;\n' +
        '  }\n' +
        '\n' +
        '  return true;\n' +
        '}\n',
      python:
        'class ListNode:\n' +
        '    def __init__(self, val=0, next=None):\n' +
        '        self.val = val\n' +
        '        self.next = next\n\n' +
        "def is_palindrome(head: 'ListNode | None') -> bool:\n" +
        '    if not head or not head.next:\n' +
        '        return True\n\n' +
        '    slow = head\n' +
        '    fast = head\n' +
        '    while fast and fast.next:\n' +
        '        slow = slow.next\n' +
        '        fast = fast.next.next\n\n' +
        '    prev = None\n' +
        '    curr = slow\n' +
        '    while curr:\n' +
        '        nxt = curr.next\n' +
        '        curr.next = prev\n' +
        '        prev = curr\n' +
        '        curr = nxt\n\n' +
        '    left = head\n' +
        '    right = prev\n' +
        '    while right:\n' +
        '        if left.val != right.val:\n' +
        '            return False\n' +
        '        left = left.next\n' +
        '        right = right.next\n\n' +
        '    return True\n',
      java:
        'class ListNode {\n' +
        '  int val;\n' +
        '  ListNode next;\n' +
        '  ListNode(int val) { this.val = val; }\n' +
        '  ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n' +
        '}\n\n' +
        'class Solution {\n' +
        '  public boolean isPalindrome(ListNode head) {\n' +
        '    if (head == null || head.next == null) return true;\n' +
        '\n' +
        '    ListNode slow = head, fast = head;\n' +
        '    while (fast != null && fast.next != null) {\n' +
        '      slow = slow.next;\n' +
        '      fast = fast.next.next;\n' +
        '    }\n' +
        '\n' +
        '    ListNode prev = null, curr = slow;\n' +
        '    while (curr != null) {\n' +
        '      ListNode next = curr.next;\n' +
        '      curr.next = prev;\n' +
        '      prev = curr;\n' +
        '      curr = next;\n' +
        '    }\n' +
        '\n' +
        '    ListNode left = head;\n' +
        '    ListNode right = prev;\n' +
        '    while (right != null) {\n' +
        '      if (left.val != right.val) return false;\n' +
        '      left = left.next;\n' +
        '      right = right.next;\n' +
        '    }\n' +
        '    return true;\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function fromArray(arr: number[]): any {\n  let dummy: any = { val: 0, next: null };\n  let tail = dummy;\n  for (const v of arr) {\n    tail.next = { val: v, next: null };\n    tail = tail.next;\n  }\n  return dummy.next;\n}\n\nfunction runTests() {\n  const testCases = [\n    { input: [], expected: true },\n    { input: [1], expected: true },\n    { input: [1,2,2,1], expected: true },\n    { input: [1,2,3], expected: false },\n  ];\n\n  testCases.forEach((tc, i) => {\n    const head = fromArray(tc.input);\n    const result = isPalindrome(head);\n    const pass = result === tc.expected;\n    console.log(\n      "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n      " | Got " + JSON.stringify(result) + ", Expected " + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n',
      python:
        "def from_array(arr):\n    dummy = ListNode(0)\n    tail = dummy\n    for v in arr:\n        tail.next = ListNode(v)\n        tail = tail.next\n    return dummy.next\n\n\ndef run_tests():\n    tests = [\n        ([], True),\n        ([1], True),\n        ([1,2,2,1], True),\n        ([1,2,3], False),\n    ]\n    for i, (inp, expected) in enumerate(tests, 1):\n        head = from_array(inp)\n        result = is_palindrome(head)\n        print(f\"Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        '\n' +
        'java.util.function.Function<int[], ListNode> fromArray = (arr) -> {\n' +
        '  ListNode dummy = new ListNode(0);\n' +
        '  ListNode tail = dummy;\n' +
        '  for (int v : arr) { tail.next = new ListNode(v); tail = tail.next; }\n' +
        '  return dummy.next;\n' +
        '};\n' +
        '\n' +
        'int[][] inputs = new int[][] { {}, {1}, {1,2,2,1}, {1,2,3} };\n' +
        'boolean[] expected = new boolean[] { true, true, true, false };\n' +
        '\n' +
        'for (int i = 0; i < inputs.length; i++) {\n' +
        '  ListNode head = fromArray.apply(inputs[i]);\n' +
        '  boolean result = sol.isPalindrome(head);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    problemDescription:
      'Given a string s, return the length of the longest substring without repeating characters.',
    startingCode: {
      typescript:
        'function lengthOfLongestSubstring(s: string): number {\n' +
        '  const lastSeen: any = {};\n' +
        '  let left = 0;\n' +
        '  let maxLen = 0;\n' +
        '\n' +
        '  for (let right = 0; right < s.length; right++) {\n' +
        '    const ch = s.charAt(right);\n' +
        '    if (lastSeen[ch] !== undefined && lastSeen[ch] >= left) {\n' +
        '      left = lastSeen[ch] + 1;\n' +
        '    }\n' +
        '    lastSeen[ch] = right;\n' +
        '    const len = right - left + 1;\n' +
        '    if (len > maxLen) maxLen = len;\n' +
        '  }\n' +
        '\n' +
        '  return maxLen;\n' +
        '}\n',
      python:
        'def length_of_longest_substring(s: str) -> int:\n' +
        '    seen = set()\n' +
        '    left = 0\n' +
        '    max_len = 0\n' +
        '\n' +
        '    for right in range(len(s)):\n' +
        '        while s[right] in seen:\n' +
        '            seen.remove(s[left])\n' +
        '            left += 1\n' +
        '        seen.add(s[right])\n' +
        '        max_len = max(max_len, right - left + 1)\n' +
        '\n' +
        '    return max_len\n',
      java:
        'import java.util.*;\n\n' +
        'class Solution {\n' +
        '  public int lengthOfLongestSubstring(String s) {\n' +
        '    Map<Character, Integer> last = new HashMap<>();\n' +
        '    int left = 0;\n' +
        '    int best = 0;\n' +
        '    for (int right = 0; right < s.length(); right++) {\n' +
        '      char c = s.charAt(right);\n' +
        '      if (last.containsKey(c) && last.get(c) >= left) {\n' +
        '        left = last.get(c) + 1;\n' +
        '      }\n' +
        '      last.put(c, right);\n' +
        '      int len = right - left + 1;\n' +
        '      if (len > best) best = len;\n' +
        '    }\n' +
        '    return best;\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function runTests() {\n  const testCases: { s: string; expected: number }[] = [\n    { s: "", expected: 0 },\n    { s: "a", expected: 1 },\n    { s: "abcabcbb", expected: 3 },\n    { s: "bbbbb", expected: 1 },\n    { s: "pwwkew", expected: 3 },\n  ];\n\n  testCases.forEach((tc, i) => {\n    const result = lengthOfLongestSubstring(tc.s);\n    console.log(\n      "Case " + (i + 1) + ": " +\n      (result === tc.expected ? "PASS" : "FAIL") +\n      " | Got " + JSON.stringify(result) +\n      ", Expected " + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n',
      python:
        'def run_tests():\n    test_cases = [\n        ("", 0),\n        ("a", 1),\n        ("abcabcbb", 3),\n        ("bbbbb", 1),\n        ("pwwkew", 3),\n    ]\n    for i, (s, expected) in enumerate(test_cases, 1):\n        result = length_of_longest_substring(s)\n        print(f"Case {i}: {\'PASS\' if result == expected else \'FAIL\'} | Got {result}, Expected {expected}")\n\nrun_tests()\n',
      java:
        'Solution sol = new Solution();\n' +
        'String[] tests = new String[] { "", "a", "abcabcbb", "bbbbb", "pwwkew" };\n' +
        'int[] expected = new int[] { 0, 1, 3, 1, 3 };\n' +
        '\n' +
        'for (int i = 0; i < tests.length; i++) {\n' +
        '  int result = sol.lengthOfLongestSubstring(tests[i]);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    problemDescription:
      'Given an integer array coins representing coin denominations and an integer amount, return the fewest number of coins needed to make up that amount, or -1 if it is not possible.',
    startingCode: {
      typescript:
        'function coinChange(coins: number[], amount: number): number {\n' +
        '  const dp: number[] = [];\n' +
        '  for (let i = 0; i <= amount; i++) dp.push(Infinity);\n' +
        '  dp[0] = 0;\n' +
        '\n' +
        '  for (let i = 1; i <= amount; i++) {\n' +
        '    for (let c = 0; c < coins.length; c++) {\n' +
        '      const coin = coins[c];\n' +
        '      if (i - coin >= 0 && dp[i - coin] !== Infinity) {\n' +
        '        const cand = dp[i - coin] + 1;\n' +
        '        if (cand < dp[i]) dp[i] = cand;\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '\n' +
        '  return dp[amount] === Infinity ? -1 : dp[amount];\n' +
        '}\n',
      python:
        'def coin_change(coins, amount):\n' +
        '    dp = [float("inf")] * (amount + 1)\n' +
        '    dp[0] = 0\n' +
        '\n' +
        '    for i in range(1, amount + 1):\n' +
        '        for coin in coins:\n' +
        '            if i - coin >= 0:\n' +
        '                dp[i] = min(dp[i], dp[i - coin] + 1)\n' +
        '\n' +
        '    return -1 if dp[amount] == float("inf") else dp[amount]\n',
      java:
        'import java.util.*;\n\n' +
        'class Solution {\n' +
        '  public int coinChange(int[] coins, int amount) {\n' +
        '    int[] dp = new int[amount + 1];\n' +
        '    Arrays.fill(dp, amount + 1);\n' +
        '    dp[0] = 0;\n' +
        '    for (int i = 1; i <= amount; i++) {\n' +
        '      for (int c : coins) {\n' +
        '        if (i - c >= 0) {\n' +
        '          dp[i] = Math.min(dp[i], dp[i - c] + 1);\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    return dp[amount] > amount ? -1 : dp[amount];\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function runTests() {\n  const testCases: { coins: number[]; amount: number; expected: number }[] = [\n    { coins: [1,2,5], amount: 11, expected: 3 },\n    { coins: [2], amount: 3, expected: -1 },\n    { coins: [1], amount: 0, expected: 0 },\n    { coins: [1], amount: 2, expected: 2 },\n  ];\n\n  testCases.forEach((tc, i) => {\n    const result = coinChange(tc.coins, tc.amount);\n    console.log(\n      "Case " + (i + 1) + ": " +\n      (result === tc.expected ? "PASS" : "FAIL") +\n      " | Got " + JSON.stringify(result) +\n      ", Expected " + JSON.stringify(tc.expected)\n    );\n  });\n}\n\nrunTests();\n',
      python:
        "def run_tests():\n    test_cases = [\n        (([1,2,5], 11), 3),\n        (([2], 3), -1),\n        (([1], 0), 0),\n        (([1], 2), 2),\n    ]\n    for i, (args, expected) in enumerate(test_cases, 1):\n        result = coin_change(*args)\n        print(f\"Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        'int[][] coinsCases = new int[][] { {1,2,5}, {2}, {1}, {1} };\n' +
        'int[] amounts = new int[] { 11, 3, 0, 2 };\n' +
        'int[] expected = new int[] { 3, -1, 0, 2 };\n' +
        '\n' +
        'for (int i = 0; i < coinsCases.length; i++) {\n' +
        '  int result = sol.coinChange(coinsCases[i], amounts[i]);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'hard',
    problemDescription:
      'Given an array of bar heights, return the area of the largest rectangle in the histogram.',
    startingCode: {
      typescript:
        'function largestRectangleArea(heights: number[]): number {\n' +
        '  const stack: number[] = [];\n' +
        '  let maxArea = 0;\n' +
        '  const h = [...heights, 0];\n' +
        '\n' +
        '  for (let i = 0; i < h.length; i++) {\n' +
        '    while (stack.length && h[stack[stack.length - 1]] > h[i]) {\n' +
        '      const top = stack.pop()!;\n' +
        '      const height = h[top];\n' +
        '      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n' +
        '      maxArea = Math.max(maxArea, height * width);\n' +
        '    }\n' +
        '    stack.push(i);\n' +
        '  }\n' +
        '\n' +
        '  return maxArea;\n' +
        '}\n',
      python:
        'def largest_rectangle_area(heights):\n' +
        '    stack = []\n' +
        '    max_area = 0\n' +
        '    h = heights + [0]\n' +
        '\n' +
        '    for i in range(len(h)):\n' +
        '        while stack and h[stack[-1]] > h[i]:\n' +
        '            top = stack.pop()\n' +
        '            height = h[top]\n' +
        '            width = i - stack[-1] - 1 if stack else i\n' +
        '            max_area = max(max_area, height * width)\n' +
        '        stack.append(i)\n' +
        '\n' +
        '    return max_area\n',
      java:
        'import java.util.*;\n\n' +
        'class Solution {\n' +
        '  public int largestRectangleArea(int[] heights) {\n' +
        '    Deque<Integer> stack = new ArrayDeque<>();\n' +
        '    int maxArea = 0;\n' +
        '    int n = heights.length;\n' +
        '    for (int i = 0; i <= n; i++) {\n' +
        '      int cur = (i == n) ? 0 : heights[i];\n' +
        '      while (!stack.isEmpty() && heights[stack.peek()] > cur) {\n' +
        '        int h = heights[stack.pop()];\n' +
        '        int left = stack.isEmpty() ? -1 : stack.peek();\n' +
        '        int width = i - left - 1;\n' +
        '        maxArea = Math.max(maxArea, h * width);\n' +
        '      }\n' +
        '      stack.push(i);\n' +
        '    }\n' +
        '    return maxArea;\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function runTests(){\n  const tests=[\n    {h:[2,1,5,6,2,3], e:10},\n    {h:[2,4], e:4},\n  ];\n  tests.forEach((tc,i)=>{\n    const r=largestRectangleArea(tc.h);\n    console.log(`Case ${i+1}: ${r===tc.e?\"PASS\":\"FAIL\"} | Got ${r}, Expected ${tc.e}`);\n  })\n}\nrunTests();\n',
      python:
        "def run_tests():\n    tests=[\n        ([2,1,5,6,2,3],10),\n        ([2,4],4),\n    ]\n    for i,(h,e) in enumerate(tests,1):\n        r=largest_rectangle_area(h)\n        print(f\"Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        'int[][] tests = new int[][] { {2,1,5,6,2,3}, {2,4} };\n' +
        'int[] expected = new int[] { 10, 4 };\n' +
        '\n' +
        'for (int i = 0; i < tests.length; i++) {\n' +
        '  int result = sol.largestRectangleArea(tests[i]);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'min-path-sum',
    title: 'Minimum Path Sum',
    difficulty: 'medium',
    problemDescription:
      'Given a grid of non-negative numbers, find the minimum path sum from top-left to bottom-right moving only right or down.',
    startingCode: {
      typescript:
        'function minPathSum(grid: number[][]): number {\n' +
        '  if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) return 0;\n' +
        '  const m = grid.length;\n' +
        '  const n = grid[0].length;\n' +
        '\n' +
        '  const dp: number[][] = [];\n' +
        '  for (let i = 0; i < m; i++) {\n' +
        '    const row: number[] = [];\n' +
        '    for (let j = 0; j < n; j++) row.push(0);\n' +
        '    dp.push(row);\n' +
        '  }\n' +
        '\n' +
        '  dp[0][0] = grid[0][0];\n' +
        '  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n' +
        '  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n' +
        '\n' +
        '  for (let i = 1; i < m; i++) {\n' +
        '    for (let j = 1; j < n; j++) {\n' +
        '      const best = dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];\n' +
        '      dp[i][j] = best + grid[i][j];\n' +
        '    }\n' +
        '  }\n' +
        '\n' +
        '  return dp[m - 1][n - 1];\n' +
        '}\n',
      python:
        'def min_path_sum(grid):\n' +
        '    if not grid or not grid[0]:\n' +
        '        return 0\n' +
        '    m, n = len(grid), len(grid[0])\n' +
        '    dp = [[0] * n for _ in range(m)]\n' +
        '\n' +
        '    dp[0][0] = grid[0][0]\n' +
        '    for i in range(1, m):\n' +
        '        dp[i][0] = dp[i - 1][0] + grid[i][0]\n' +
        '    for j in range(1, n):\n' +
        '        dp[0][j] = dp[0][j - 1] + grid[0][j]\n' +
        '\n' +
        '    for i in range(1, m):\n' +
        '        for j in range(1, n):\n' +
        '            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]\n' +
        '\n' +
        '    return dp[m - 1][n - 1]\n',
      java:
        'class Solution {\n' +
        '  public int minPathSum(int[][] grid) {\n' +
        '    if (grid == null || grid.length == 0 || grid[0].length == 0) return 0;\n' +
        '    int m = grid.length;\n' +
        '    int n = grid[0].length;\n' +
        '    int[][] dp = new int[m][n];\n' +
        '    dp[0][0] = grid[0][0];\n' +
        '\n' +
        '    for (int i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n' +
        '    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n' +
        '\n' +
        '    for (int i = 1; i < m; i++) {\n' +
        '      for (int j = 1; j < n; j++) {\n' +
        '        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];\n' +
        '      }\n' +
        '    }\n' +
        '    return dp[m - 1][n - 1];\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function runTests(){\n  const tests=[\n    {g:[[1,3,1],[1,5,1],[4,2,1]], e:7},\n  ];\n  tests.forEach((tc,i)=>{\n    const r=minPathSum(tc.g);\n    console.log(`Case ${i+1}: ${r===tc.e?\"PASS\":\"FAIL\"} | Got ${r}, Expected ${tc.e}`);\n  })\n}\nrunTests();\n',
      python:
        "def run_tests():\n    tests=[\n        ([[1,3,1],[1,5,1],[4,2,1]],7),\n    ]\n    for i,(g,e) in enumerate(tests,1):\n        r=min_path_sum(g)\n        print(f\"Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        'int[][][] tests = new int[][][] { { {1,3,1}, {1,5,1}, {4,2,1} } };\n' +
        'int[] expected = new int[] { 7 };\n' +
        '\n' +
        'for (int i = 0; i < tests.length; i++) {\n' +
        '  int result = sol.minPathSum(tests[i]);\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
  {
    problemId: 'word-break',
    title: 'Word Break',
    difficulty: 'medium',
    problemDescription:
      'Given a string s and a dictionary wordDict, determine if s can be segmented into one or more words found in the dictionary.',
    startingCode: {
      typescript:
        'function wordBreak(s: string, wordDict: string[]): boolean {\n' +
        '  const dict: any = {};\n' +
        '  for (let i = 0; i < wordDict.length; i++) dict[wordDict[i]] = true;\n' +
        '\n' +
        '  const dp: boolean[] = [];\n' +
        '  for (let i = 0; i <= s.length; i++) dp.push(false);\n' +
        '  dp[0] = true;\n' +
        '\n' +
        '  for (let i = 1; i <= s.length; i++) {\n' +
        '    for (let j = 0; j < i; j++) {\n' +
        '      if (dp[j] && dict[s.slice(j, i)]) {\n' +
        '        dp[i] = true;\n' +
        '        break;\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '\n' +
        '  return dp[s.length];\n' +
        '}\n',
      python:
        'def word_break(s, word_dict):\n' +
        '    word_set = set(word_dict)\n' +
        '    dp = [False] * (len(s) + 1)\n' +
        '    dp[0] = True\n' +
        '\n' +
        '    for i in range(1, len(s) + 1):\n' +
        '        for j in range(i):\n' +
        '            if dp[j] and s[j:i] in word_set:\n' +
        '                dp[i] = True\n' +
        '                break\n' +
        '\n' +
        '    return dp[len(s)]\n',
      java:
        'import java.util.*;\n\n' +
        'class Solution {\n' +
        '  public boolean wordBreak(String s, List<String> wordDict) {\n' +
        '    Set<String> set = new HashSet<>(wordDict);\n' +
        '    boolean[] dp = new boolean[s.length() + 1];\n' +
        '    dp[0] = true;\n' +
        '    for (int i = 1; i <= s.length(); i++) {\n' +
        '      for (int j = 0; j < i; j++) {\n' +
        '        if (dp[j] && set.contains(s.substring(j, i))) {\n' +
        '          dp[i] = true;\n' +
        '          break;\n' +
        '        }\n' +
        '      }\n' +
        '    }\n' +
        '    return dp[s.length()];\n' +
        '  }\n' +
        '}\n',
    },
    testHarness: {
      typescript:
        'function runTests(){\n  const tests=[\n    {s:"leetcode",dict:["leet","code"],e:true},\n    {s:"applepenapple",dict:["apple","pen"],e:true},\n    {s:"catsandog",dict:["cats","dog","sand","and","cat"],e:false},\n  ];\n  tests.forEach((tc,i)=>{\n    const r=wordBreak(tc.s,tc.dict);\n    console.log(`Case ${i+1}: ${r===tc.e?\"PASS\":\"FAIL\"} | Got ${r}, Expected ${tc.e}`);\n  })\n}\nrunTests();\n',
      python:
        "def run_tests():\n    tests=[\n        (('leetcode',['leet','code']),True),\n        (('applepenapple',['apple','pen']),True),\n        (('catsandog',['cats','dog','sand','and','cat']),False),\n    ]\n    for i,(args,e) in enumerate(tests,1):\n        r=word_break(*args)\n        print(f\"Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}\")\n\nrun_tests()\n",
      java:
        'Solution sol = new Solution();\n' +
        'String[] sCases = new String[] { "leetcode", "applepenapple", "catsandog" };\n' +
        'String[][] dictCases = new String[][] {\n' +
        '  { "leet", "code" },\n' +
        '  { "apple", "pen" },\n' +
        '  { "cats", "dog", "sand", "and", "cat" }\n' +
        '};\n' +
        'boolean[] expected = new boolean[] { true, true, false };\n' +
        '\n' +
        'for (int i = 0; i < sCases.length; i++) {\n' +
        '  boolean result = sol.wordBreak(sCases[i], Arrays.asList(dictCases[i]));\n' +
        '  boolean pass = result == expected[i];\n' +
        '  System.out.println(\n' +
        '    "Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +\n' +
        '    " | Got " + result + ", Expected " + expected[i]\n' +
        '  );\n' +
        '}\n',
    },
  },
];

const TYPESCRIPT_LANG_ID = 74;

async function checkTypeScriptCompiles() {
  for (/*const p of problems*/ let i = 0; i < problems.length; i++) {
    let p = problems[i];
    const fullSource = p.startingCode.typescript + '\n\n' + p.testHarness.typescript;

    const fullSourceB64 = Buffer.from(fullSource).toString('base64');
    const stdinB64 = Buffer.from('').toString('base64');

    try {
      const apiRes = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
          body: JSON.stringify({
            language_id: TYPESCRIPT_LANG_ID,
            source_code: fullSourceB64,
            stdin: stdinB64,
          }),
        },
      );

      const data: any = await apiRes.json();

      const status = data?.status?.description ?? 'UNKNOWN';

      let compileOutput = '';
      if (data?.compile_output) {
        compileOutput = Buffer.from(data.compile_output, 'base64').toString('utf8');
      }

      console.log(
        `TS compile for ${p.problemId}: ${status}${
          compileOutput ? ` | compile_output: ${compileOutput}` : ''
        }`,
      );
    } catch (e) {
      console.error(`Error compiling ${p.problemId}:`, e);
    }
  }
}

const JAVA_LANG_ID = 62; // Judge0: Java (OpenJDK)

function wrapJava(userSrc: string, harness: string) {
  return (
    'import java.util.*;\n' +
    '\n' +
    userSrc.trim() +
    '\n\n' +
    'public class Main {\n' +
    '  public static void main(String[] args) {\n' +
    harness.trim() +
    '\n' +
    '  }\n' +
    '}\n'
  );
}

async function checkJavaCompiles() {
  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];

    if (!p?.startingCode?.java || !p?.testHarness?.java) {
      console.log(`JAVA compile for ${p.problemId}: SKIP (missing java code/harness)`);
      continue;
    }

    const fullSource = wrapJava(p.startingCode.java, p.testHarness.java);

    const fullSourceB64 = Buffer.from(fullSource, "utf8").toString("base64");
    const stdinB64 = Buffer.from("", "utf8").toString("base64");

    try {
      const apiRes = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: JAVA_LANG_ID,
            source_code: fullSourceB64,
            stdin: stdinB64,
          }),
        },
      );

      const data: any = await apiRes.json();
      const status = data?.status?.description ?? "UNKNOWN";

      const compileOutput = data?.compile_output
        ? Buffer.from(data.compile_output, "base64").toString("utf8")
        : "";

      const stderr = data?.stderr ? Buffer.from(data.stderr, "base64").toString("utf8") : "";
      const stdout = data?.stdout ? Buffer.from(data.stdout, "base64").toString("utf8") : "";

      console.log(
        `JAVA compile for ${p.problemId}: ${status}` +
          (compileOutput ? ` | compile_output: ${compileOutput}` : "") +
          (stderr ? ` | stderr: ${stderr}` : "") +
          (stdout ? ` | stdout: ${stdout}` : ""),
      );
    } catch (e) {
      console.error(`Error compiling JAVA ${p.problemId}:`, e);
    }
  }
}

function logProblemCode(): void {
  for (let i = 0; i < problems.length; i++) {
    let p = problems[i];
    console.log(`\n=== ${p.title} (${p.problemId}) ===`);

    console.log('\n--- TypeScript ---');
    // console.log('Starting Code:\n' + p.startingCode.typescript);
    console.log('Test Harness:\n' + p.testHarness.typescript);

    console.log('\n--- Python ---');
    // console.log('Starting Code:\n' + p.startingCode.python);
    console.log('Test Harness:\n' + p.testHarness.python);
  }
  // console.log(problems.length);
}

(async () => {
  try {
    await connectDb();

    // await Problem.deleteMany({});

    for (const p of problems) {
      const exists = await Problem.findOne({ problemId: p.problemId });
      if (exists) {
        console.log(`Problem already exists: ${p.problemId} (${p.title})`);
        continue;
      }

      await Problem.create(p);
      console.log(`Added: ${p.problemId} (${p.title})`);
    }

    logProblemCode();
    // await checkTypeScriptCompiles();
    // await checkJavaCompiles();
    // await logProblemCode();
  } catch (err) {
    console.error(err);
  }
})();
