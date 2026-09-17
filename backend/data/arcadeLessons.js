// Server-side source of truth for Arcade mission grading.
// Ids and order must stay in sync with frontend/src/data/curriculum.js —
// the client only supplies narrative content; xp and checks are never trusted from the client.

export const PYTHON_LESSONS = [
  {
    id: "py-1",
    title: "Hello, Python!",
    xp: 50,
    checks: [
      {
        type: "code_contains",
        value: "print(",
        hint: "Use the print() function to output something to the console.",
      },
    ],
  },
  {
    id: "py-2",
    title: "Variables: Memory Bins",
    xp: 75,
    checks: [
      {
        type: "code_contains",
        value: "hero",
        hint: "Create a variable named 'hero'.",
      },
      {
        type: "code_contains",
        value: "print(hero)",
        hint: "Print the hero variable, e.g. print(hero).",
      },
    ],
  },
];

export const JAVA_LESSONS = [
  {
    id: "jv-1",
    title: "The JVM Architecture",
    xp: 50,
    checks: [
      {
        type: "output_equals",
        value: "Hello from the JVM!",
        hint: "Your program should print exactly: Hello from the JVM!",
      },
    ],
  },
  {
    id: "jv-2",
    title: "Anatomy of a Class",
    xp: 60,
    checks: [
      {
        type: "output_contains",
        value: "Line 1",
        hint: "Print 'Line 1' using System.out.println() or System.out.print().",
      },
      {
        type: "output_contains",
        value: "Line 2",
        hint: "Print 'Line 2' on a separate line.",
      },
    ],
  },
  {
    id: "jv-3",
    title: "Variables & Primitives",
    xp: 75,
    checks: [
      {
        type: "code_contains",
        value: "double bonus",
        hint: "Declare a double named 'bonus'.",
      },
      {
        type: "code_contains",
        value: "println(score + bonus)",
        hint: "Print the sum using System.out.println(score + bonus).",
      },
    ],
  },
  {
    id: "jv-4",
    title: "Casting & Parsing",
    xp: 80,
    checks: [
      {
        type: "output_equals",
        value: "45",
        hint: "Cast price to an int using (int) price and print the result — it should print exactly 45.",
      },
    ],
  },
  {
    id: "jv-5",
    title: "Strings & Immutability",
    xp: 70,
    checks: [
      {
        type: "output_equals",
        value: "15",
        hint: "Print title.length() — 'CodeDojo Arcade' has 15 characters.",
      },
    ],
  },
  {
    id: "jv-6",
    title: "The Math Class",
    xp: 80,
    checks: [
      {
        type: "output_equals",
        value: "8.0",
        hint: "Use Math.sqrt(64) and print the result — it should print exactly 8.0.",
      },
    ],
  },
  {
    id: "jv-7",
    title: "Control Flow: Switch Arrow",
    xp: 90,
    checks: [
      {
        type: "output_contains",
        value: "Even",
        ignoreCase: true,
        hint: "Print 'Even' when num is 2, 4, or 6 using an enhanced switch.",
      },
    ],
  },
  {
    id: "jv-8",
    title: "Loops: The Engine",
    xp: 85,
    checks: [
      {
        type: "code_contains",
        value: "for(",
        hint: "Use a for loop to iterate.",
      },
      {
        type: "output_equals",
        value: "1\n2\n3\n4\n5",
        hint: "Print the numbers 1 to 5, each on its own line (e.g. System.out.println(i)).",
      },
    ],
  },
  {
    id: "jv-9",
    title: "Arrays vs ArrayLists",
    xp: 95,
    checks: [
      {
        type: "code_contains",
        value: "new ArrayList<",
        hint: "Instantiate the list, e.g. new ArrayList<String>().",
      },
      {
        type: "code_contains",
        value: ".add(",
        hint: 'Add "Computer" using items.add("Computer").',
      },
      {
        type: "code_contains",
        value: ".size()",
        hint: "Print the list size using items.size().",
      },
      {
        type: "output_equals",
        value: "1",
        hint: "After adding one item, items.size() should print exactly 1.",
      },
    ],
  },
  {
    id: "jv-10",
    title: "Intro to OOP",
    xp: 100,
    checks: [
      {
        type: "code_contains",
        value: "new Main(",
        hint: "Create an instance with new Main().",
      },
      {
        type: "output_contains",
        value: "Main@",
        hint: "Print the object using System.out.println(yourInstance) — default toString() looks like Main@<hash>.",
      },
    ],
  },
];

export const TRACKS = {
  python: PYTHON_LESSONS,
  java: JAVA_LESSONS,
};

export function findLessonById(lessonId) {
  for (const [language, lessons] of Object.entries(TRACKS)) {
    const index = lessons.findIndex((l) => l.id === lessonId);
    if (index !== -1) {
      return { language, lessons, index, lesson: lessons[index] };
    }
  }
  return null;
}
