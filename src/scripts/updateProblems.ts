import { connectDb } from "../lib/db_connect";
import { Problem } from "../model/Problem";

type Lang = "typescript" | "python" | "java";

function append(original: string, extra: string) {
  if (original.includes("HIDDEN Case")) return original;
  return original.trimEnd() + "\n\n" + extra.trim() + "\n";
}

const hiddenByProblem: Record<
  string,
  Partial<Record<Lang, string>>
> = {
  "two-sum": {
    typescript: `
function runHiddenTests() {
  const hidden: { args: [number[], number]; expected: number[] }[] = [
    { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
  ];

  hidden.forEach((tc, i) => {
    const result = twoSum(...tc.args);
    console.log(
      "HIDDEN Case " + (i + 1) + ": " +
      (JSON.stringify(result) === JSON.stringify(tc.expected) ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(result) +
      ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        (([-3, 4, 3, 90], 0), [0, 2]),
        (([0, 4, 3, 0], 0), [0, 3]),
    ]
    for i, (args, expected) in enumerate(hidden, 1):
        result = two_sum(*args)
        print(f"HIDDEN Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}")

run_hidden_tests()
`,
    java: `
int[][] hiddenNumsCases = new int[][] { {-3,4,3,90}, {0,4,3,0} };
int[] hiddenTargets = new int[] { 0, 0 };
int[][] hiddenExpected = new int[][] { {0,2}, {0,3} };

for (int i = 0; i < hiddenNumsCases.length; i++) {
  int[] result = sol.twoSum(hiddenNumsCases[i], hiddenTargets[i]);
  boolean pass = Arrays.equals(result, hiddenExpected[i]);
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + Arrays.toString(result) + ", Expected " + Arrays.toString(hiddenExpected[i])
  );
}
`,
  },

  "reverse-linked-list": {
    typescript: `
function runHiddenTests() {
  const hidden = [
    { input: [1,2], expected: [2,1] },
    { input: [1,2,3], expected: [3,2,1] },
  ];

  hidden.forEach((tc, i) => {
    const head = fromArray(tc.input);
    const out = reverseList(head);
    const arr = toArray(out);
    const pass = JSON.stringify(arr) === JSON.stringify(tc.expected);
    console.log(
      "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(arr) + ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ([1,2], [2,1]),
        ([1,2,3], [3,2,1]),
    ]
    for i, (inp, expected) in enumerate(hidden, 1):
        head = from_array(inp)
        out = reverse_list(head)
        arr = to_array(out)
        print(f"HIDDEN Case {i}: {'PASS' if arr == expected else 'FAIL'} | Got {arr}, Expected {expected}")

run_hidden_tests()
`,
    java: `
int[][] hiddenInputs = new int[][] { {1,2}, {1,2,3} };
int[][] hiddenExpected = new int[][] { {2,1}, {3,2,1} };

for (int i = 0; i < hiddenInputs.length; i++) {
  ListNode head = LL.fromArray(hiddenInputs[i]);
  ListNode outHead = sol.reverseList(head);
  int[] result = LL.toArray(outHead);
  boolean pass = Arrays.equals(result, hiddenExpected[i]);
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + Arrays.toString(result) + ", Expected " + Arrays.toString(hiddenExpected[i])
  );
}
`,
  },

  "valid-parentheses": {
    typescript: `
function runHiddenTests() {
  const hidden: { s: string; expected: boolean }[] = [
    { s: "((()))", expected: true },
    { s: "({[}])", expected: false },
    { s: "(", expected: false },
  ];

  hidden.forEach((tc, i) => {
    const result = isValid(tc.s);
    console.log(
      "HIDDEN Case " + (i + 1) + ": " +
      (result === tc.expected ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(result) +
      ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ("((()))", True),
        ("({[}])", False),
        ("(", False),
    ]
    for i, (s, expected) in enumerate(hidden, 1):
        result = is_valid(s)
        print(f"HIDDEN Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}")

run_hidden_tests()
`,
    java: `
String[] hiddenTests = new String[] { "((()))", "({[}])", "(" };
boolean[] hiddenExpected = new boolean[] { true, false, false };

for (int i = 0; i < hiddenTests.length; i++) {
  boolean result = sol.isValid(hiddenTests[i]);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "palindrome-linked-list": {
    typescript: `
function runHiddenTests() {
  const hidden = [
    { input: [1,2,3,2,1], expected: true },
    { input: [1,2], expected: false },
  ];

  hidden.forEach((tc, i) => {
    const head = fromArray(tc.input);
    const result = isPalindrome(head);
    const pass = result === tc.expected;
    console.log(
      "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(result) + ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ([1,2,3,2,1], True),
        ([1,2], False),
    ]
    for i, (inp, expected) in enumerate(hidden, 1):
        head = from_array(inp)
        result = is_palindrome(head)
        print(f"HIDDEN Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}")

run_hidden_tests()
`,
    java: `
int[][] hiddenInputs = new int[][] { {1,2,3,2,1}, {1,2} };
boolean[] hiddenExpected = new boolean[] { true, false };

for (int i = 0; i < hiddenInputs.length; i++) {
  ListNode head = fromArray.apply(hiddenInputs[i]);
  boolean result = sol.isPalindrome(head);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "longest-substring-without-repeating": {
    typescript: `
function runHiddenTests() {
  const hidden: { s: string; expected: number }[] = [
    { s: "dvdf", expected: 3 },
    { s: "abba", expected: 2 },
  ];

  hidden.forEach((tc, i) => {
    const result = lengthOfLongestSubstring(tc.s);
    console.log(
      "HIDDEN Case " + (i + 1) + ": " +
      (result === tc.expected ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(result) +
      ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ("dvdf", 3),
        ("abba", 2),
    ]
    for i, (s, expected) in enumerate(hidden, 1):
        result = length_of_longest_substring(s)
        print(f"HIDDEN Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}")

run_hidden_tests()
`,
    java: `
String[] hiddenTests = new String[] { "dvdf", "abba" };
int[] hiddenExpected = new int[] { 3, 2 };

for (int i = 0; i < hiddenTests.length; i++) {
  int result = sol.lengthOfLongestSubstring(hiddenTests[i]);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "coin-change": {
    typescript: `
function runHiddenTests() {
  const hidden: { coins: number[]; amount: number; expected: number }[] = [
    { coins: [2,5,10,1], amount: 27, expected: 4 }, // 10+10+5+2
    { coins: [2,4], amount: 7, expected: -1 },
  ];

  hidden.forEach((tc, i) => {
    const result = coinChange(tc.coins, tc.amount);
    console.log(
      "HIDDEN Case " + (i + 1) + ": " +
      (result === tc.expected ? "PASS" : "FAIL") +
      " | Got " + JSON.stringify(result) +
      ", Expected " + JSON.stringify(tc.expected)
    );
  });
}

runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        (([2,5,10,1], 27), 4),
        (([2,4], 7), -1),
    ]
    for i, (args, expected) in enumerate(hidden, 1):
        result = coin_change(*args)
        print(f"HIDDEN Case {i}: {'PASS' if result == expected else 'FAIL'} | Got {result}, Expected {expected}")

run_hidden_tests()
`,
    java: `
int[][] hiddenCoinsCases = new int[][] { {2,5,10,1}, {2,4} };
int[] hiddenAmounts = new int[] { 27, 7 };
int[] hiddenExpected = new int[] { 4, -1 };

for (int i = 0; i < hiddenCoinsCases.length; i++) {
  int result = sol.coinChange(hiddenCoinsCases[i], hiddenAmounts[i]);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "largest-rectangle-histogram": {
    typescript: `
function runHiddenTests(){
  const hidden=[
    {h:[6,2,5,4,5,1,6], e:12},
    {h:[1,1,1,1], e:4},
  ];
  hidden.forEach((tc,i)=>{
    const r=largestRectangleArea(tc.h);
    console.log(
      "HIDDEN Case " + (i+1) + ": " + (r===tc.e?"PASS":"FAIL") +
      " | Got " + r + ", Expected " + tc.e
    );
  })
}
runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ([6,2,5,4,5,1,6], 12),
        ([1,1,1,1], 4),
    ]
    for i,(h,e) in enumerate(hidden,1):
        r = largest_rectangle_area(h)
        print(f"HIDDEN Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}")

run_hidden_tests()
`,
    java: `
int[][] hiddenTests = new int[][] { {6,2,5,4,5,1,6}, {1,1,1,1} };
int[] hiddenExpected = new int[] { 12, 4 };

for (int i = 0; i < hiddenTests.length; i++) {
  int result = sol.largestRectangleArea(hiddenTests[i]);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "min-path-sum": {
    typescript: `
function runHiddenTests(){
  const hidden=[
    {g:[[1,2,3],[4,5,6]], e:12},
    {g:[[5]], e:5},
  ];
  hidden.forEach((tc,i)=>{
    const r=minPathSum(tc.g as any);
    console.log(
      "HIDDEN Case " + (i+1) + ": " + (r===tc.e?"PASS":"FAIL") +
      " | Got " + r + ", Expected " + tc.e
    );
  })
}
runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        ([[1,2,3],[4,5,6]], 12),
        ([[5]], 5),
    ]
    for i,(g,e) in enumerate(hidden,1):
        r = min_path_sum(g)
        print(f"HIDDEN Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}")

run_hidden_tests()
`,
    java: `
int[][][] hiddenTests = new int[][][] {
  { {1,2,3}, {4,5,6} },
  { {5} }
};
int[] hiddenExpected = new int[] { 12, 5 };

for (int i = 0; i < hiddenTests.length; i++) {
  int result = sol.minPathSum(hiddenTests[i]);
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },

  "word-break": {
    typescript: `
function runHiddenTests(){
  const hidden=[
    {s:"cars", dict:["car","ca","rs"], e:true},
    {s:"aaaaab", dict:["a","aa","aaa","aaaa"], e:false},
  ];
  hidden.forEach((tc,i)=>{
    const r=wordBreak(tc.s, tc.dict);
    console.log(
      "HIDDEN Case " + (i+1) + ": " + (r===tc.e?"PASS":"FAIL") +
      " | Got " + r + ", Expected " + tc.e
    );
  })
}
runHiddenTests();
`,
    python: `
def run_hidden_tests():
    hidden = [
        (("cars", ["car","ca","rs"]), True),
        (("aaaaab", ["a","aa","aaa","aaaa"]), False),
    ]
    for i,(args,e) in enumerate(hidden,1):
        r = word_break(*args)
        print(f"HIDDEN Case {i}: {'PASS' if r==e else 'FAIL'} | Got {r}, Expected {e}")

run_hidden_tests()
`,
    java: `
String[] hiddenSCases = new String[] { "cars", "aaaaab" };
String[][] hiddenDictCases = new String[][] {
  { "car", "ca", "rs" },
  { "a", "aa", "aaa", "aaaa" }
};
boolean[] hiddenExpected = new boolean[] { true, false };

for (int i = 0; i < hiddenSCases.length; i++) {
  boolean result = sol.wordBreak(hiddenSCases[i], Arrays.asList(hiddenDictCases[i]));
  boolean pass = result == hiddenExpected[i];
  System.out.println(
    "HIDDEN Case " + (i + 1) + ": " + (pass ? "PASS" : "FAIL") +
    " | Got " + result + ", Expected " + hiddenExpected[i]
  );
}
`,
  },
};

async function main() {
  await connectDb();
  await Problem.init();

  const ids = Object.keys(hiddenByProblem);

  for (const problemId of ids) {
    const p = await Problem.findOne({ problemId }, { _id: 0, testHarness: 1 }).lean();
    if (!p?.testHarness) {
      console.log(`Skip (not found): ${problemId}`);
      continue;
    }

    const update: any = {};
    const hidden = hiddenByProblem[problemId];

    for (const lang of ["typescript", "python", "java"] as Lang[]) {
      const orig = (p as any).testHarness?.[lang];
      const extra = hidden?.[lang];
      if (typeof orig === "string" && typeof extra === "string") {
        update[`testHarness.${lang}`] = append(orig, extra);
      }
    }

    if (Object.keys(update).length === 0) {
      console.log(`No changes: ${problemId}`);
      continue;
    }

    await Problem.updateOne({ problemId }, { $set: update });
    console.log(`Updated hidden harness: ${problemId}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
