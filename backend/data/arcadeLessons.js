// Server-side source of truth for Arcade mission grading.
// Ids and order must stay in sync with frontend/src/data/curriculum.js —
// the client only supplies narrative content; xp and checks are never trusted from the client.
//
// Each lesson also has a `practice` array of REQUIRED practice problems. They
// use the exact same `checks` schema and the same missionChecker grading engine
// as the mission itself. They are deliberately easier than the mission and only
// use concepts already taught, because students are blocked on them: a lesson
// only counts as complete (and unlocks the next one) once its mission AND all
// of its practice problems are passed.
//
// Comments in starter code must never contain a code_contains check value —
// checks look at the whole source, comments included.

import { PRACTICE_XP } from '../utils/xpUtils.js';

const javaMain = (body) =>
  `public class Main {\n  public static void main(String[] args) {\n${body}  }\n}\n`;

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
    practice: [
      {
        id: "py-1-p1",
        title: "Say hi to Sensei",
        prompt: "Print exactly this text: Hello, Sensei!",
        starterCode: "# Write your print statement below\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Hello, Sensei!",
            hint: "Your program should print exactly: Hello, Sensei!",
          },
          {
            type: "code_contains",
            value: "print(",
            hint: "Use the print() function to show the text.",
          },
        ],
      },
      {
        id: "py-1-p2",
        title: "Two lines",
        prompt: 'Use print() twice: show "Python is fun" on the first line and "Keep going" on the second line.',
        starterCode: "# Print the first line\n\n# Print the second line\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Python is fun\nKeep going",
            hint: "Each print() starts a new line. Print Python is fun first, then Keep going.",
          },
        ],
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
    practice: [
      {
        id: "py-2-p1",
        title: "Store a number",
        prompt: "Create a variable called age and set it to 25, then print it.",
        starterCode: "# Create your variable below\n\n# Print it below\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "25",
            hint: "The program should print exactly 25.",
          },
          {
            type: "code_contains",
            value: "age=25",
            hint: "Create the variable with age = 25.",
          },
          {
            type: "code_contains",
            value: "print(age)",
            hint: "Print the variable with print(age).",
          },
        ],
      },
      {
        id: "py-2-p2",
        title: "Store a greeting",
        prompt: "Create a variable called greeting that holds the text Hello, then print it.",
        starterCode: "# Create your variable below\n\n# Print it below\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Hello",
            hint: "The program should print exactly Hello.",
          },
          {
            type: "code_contains",
            value: "greeting=",
            hint: "Create a variable named greeting, e.g. greeting = \"Hello\".",
          },
          {
            type: "code_contains",
            value: "print(greeting)",
            hint: "Print the variable with print(greeting).",
          },
        ],
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
    practice: [
      {
        id: "jv-1-p1",
        title: "Print a message",
        prompt: "Inside main, use System.out.println() to print exactly: Java is running",
        starterCode: javaMain("    // Print your message here\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Java is running",
            hint: "Your program should print exactly: Java is running",
          },
          {
            type: "code_contains",
            value: "System.out.println(",
            hint: "Use System.out.println() to print the message.",
          },
        ],
      },
      {
        id: "jv-1-p2",
        title: "Bytecode message",
        prompt: "Inside main, use System.out.println() to print exactly: Compiled to bytecode!",
        starterCode: javaMain("    // Print your message here\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Compiled to bytecode!",
            hint: "Your program should print exactly: Compiled to bytecode!",
          },
          {
            type: "code_contains",
            value: "System.out.println(",
            hint: "Use System.out.println() to print the message.",
          },
        ],
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
    practice: [
      {
        id: "jv-2-p1",
        title: "Three lines",
        prompt: "Print One, Two and Three, each on its own line.",
        starterCode: javaMain("    // Print One\n\n    // Print Two\n\n    // Print Three\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "One\nTwo\nThree",
            hint: "println() ends the line, so use it three times: One, Two, Three.",
          },
          {
            type: "code_contains",
            value: "System.out.println(",
            hint: "Use System.out.println() for each line.",
          },
        ],
      },
      {
        id: "jv-2-p2",
        title: "Print then println",
        prompt: 'Use System.out.print() to print "Hello " (with a space at the end), then System.out.println() to print "Dojo". The output should be: Hello Dojo',
        starterCode: javaMain("    // Use print for the first word, then println for the second\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Hello Dojo",
            hint: "The output should be exactly: Hello Dojo (both words on one line).",
          },
          {
            type: "code_contains",
            value: "System.out.print(",
            hint: "Use System.out.print() (no ln) so the next text stays on the same line.",
          },
        ],
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
    practice: [
      {
        id: "jv-3-p1",
        title: "Declare an int",
        prompt: "Declare an int called lives with the value 3, then print it.",
        starterCode: javaMain("    // Declare your int here\n\n    // Print it here\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "3",
            hint: "The program should print exactly 3.",
          },
          {
            type: "code_contains",
            value: "int lives = 3",
            hint: "Declare it with int lives = 3;",
          },
          {
            type: "code_contains",
            value: "println(lives)",
            hint: "Print the variable with System.out.println(lives).",
          },
        ],
      },
      {
        id: "jv-3-p2",
        title: "Declare a double",
        prompt: "Declare a double called price with the value 9.5, then print it.",
        starterCode: javaMain("    // Declare your double here\n\n    // Print it here\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "9.5",
            hint: "The program should print exactly 9.5.",
          },
          {
            type: "code_contains",
            value: "double price = 9.5",
            hint: "Declare it with double price = 9.5;",
          },
          {
            type: "code_contains",
            value: "println(price)",
            hint: "Print the variable with System.out.println(price).",
          },
        ],
      },
      {
        id: "jv-3-p3",
        title: "Declare a boolean",
        prompt: "Declare a boolean called isReady with the value true, then print it.",
        starterCode: javaMain("    // Declare your boolean here\n\n    // Print it here\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "true",
            hint: "The program should print exactly true.",
          },
          {
            type: "code_contains",
            value: "boolean isReady = true",
            hint: "Declare it with boolean isReady = true;",
          },
          {
            type: "code_contains",
            value: "println(isReady)",
            hint: "Print the variable with System.out.println(isReady).",
          },
        ],
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
    practice: [
      {
        id: "jv-4-p1",
        title: "Cast to int",
        prompt: "temp holds 36.6. Cast it to an int and print the result.",
        starterCode: javaMain("    double temp = 36.6;\n    // Cast temp to an int and print it\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "36",
            hint: "Casting drops the decimals, so it should print exactly 36.",
          },
          {
            type: "code_contains",
            value: "(int)",
            hint: "Put (int) in front of the variable to cast it.",
          },
        ],
      },
      {
        id: "jv-4-p2",
        title: "Parse then add",
        prompt: 'text holds the String "123". Turn it into an int, add 1 to it, and print the result.',
        starterCode: javaMain('    String text = "123";\n    // Convert text to an int, add 1, then print the result\n'),
        difficulty: "medium",
        xp: PRACTICE_XP.medium,
        checks: [
          {
            type: "output_equals",
            value: "124",
            hint: "123 + 1 should print exactly 124.",
          },
          {
            type: "code_contains",
            value: "Integer.parseInt(",
            hint: "Use Integer.parseInt(text) to turn the String into an int.",
          },
        ],
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
    practice: [
      {
        id: "jv-5-p1",
        title: "Count the letters",
        prompt: 'word holds the String "Dojo". Print how many characters it has.',
        starterCode: javaMain('    String word = "Dojo";\n    // Print how many characters word has\n'),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "4",
            hint: "Dojo has 4 characters — the program should print exactly 4.",
          },
          {
            type: "code_contains",
            value: ".length()",
            hint: "Use word.length() to get the number of characters.",
          },
        ],
      },
      {
        id: "jv-5-p2",
        title: "Shout it",
        prompt: 'word holds the String "sensei". Print it in capital letters.',
        starterCode: javaMain('    String word = "sensei";\n    // Print word in capital letters\n'),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "SENSEI",
            hint: "The program should print exactly SENSEI.",
          },
          {
            type: "code_contains",
            value: ".toUpperCase()",
            hint: "Use word.toUpperCase() to change the letters to capitals.",
          },
        ],
      },
      {
        id: "jv-5-p3",
        title: "Tidy up spaces",
        prompt: 'messy holds the String "  Dojo  " (with extra spaces). Remove the extra spaces and print it.',
        starterCode: javaMain('    String messy = "  Dojo  ";\n    // Remove the extra spaces from messy and print it\n'),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Dojo",
            hint: "The program should print exactly Dojo.",
          },
          {
            type: "code_contains",
            value: ".trim()",
            hint: "Use messy.trim() to remove the spaces around the text.",
          },
        ],
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
    practice: [
      {
        id: "jv-6-p1",
        title: "Power up",
        prompt: "Use the Math class to work out 2 to the power of 3 and print the result.",
        starterCode: javaMain("    // Print 2 raised to the power of 3\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "8.0",
            hint: "2 to the power of 3 is 8, printed as exactly 8.0.",
          },
          {
            type: "code_contains",
            value: "Math.pow(",
            hint: "Use Math.pow(base, exponent).",
          },
        ],
      },
      {
        id: "jv-6-p2",
        title: "Round it",
        prompt: "Use the Math class to round 5.6 to the nearest whole number and print it.",
        starterCode: javaMain("    // Round 5.6 and print the result\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "6",
            hint: "5.6 rounds to 6 — the program should print exactly 6.",
          },
          {
            type: "code_contains",
            value: "Math.round(",
            hint: "Use Math.round() to round to the nearest whole number.",
          },
        ],
      },
      {
        id: "jv-6-p3",
        title: "Round down",
        prompt: "Use the Math class to round 7.9 DOWN and print the result.",
        starterCode: javaMain("    // Round 7.9 down and print the result\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "7.0",
            hint: "Rounding 7.9 down gives 7, printed as exactly 7.0.",
          },
          {
            type: "code_contains",
            value: "Math.floor(",
            hint: "Use Math.floor() to always round down.",
          },
        ],
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
    practice: [
      {
        id: "jv-7-p1",
        title: "Weekend check",
        prompt: 'day holds "Sunday". Use an enhanced switch on day: "Saturday" or "Sunday" prints Weekend!, anything else prints Weekday.',
        starterCode: javaMain('    String day = "Sunday";\n    // Use a switch on day and print the result\n'),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Weekend!",
            hint: "Sunday is a weekend day, so print exactly Weekend!",
          },
          {
            type: "code_contains",
            value: "switch(day)",
            hint: "Start with switch (day) { ... }",
          },
          {
            type: "code_contains",
            value: "->",
            hint: "Use the enhanced switch arrow, e.g. case \"Saturday\", \"Sunday\" -> ...",
          },
        ],
      },
      {
        id: "jv-7-p2",
        title: "Number names",
        prompt: "n holds 2. Use an enhanced switch on n: 1 prints One, 2 prints Two, anything else prints Other.",
        starterCode: javaMain("    int n = 2;\n    // Use a switch on n and print the result\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Two",
            hint: "n is 2, so print exactly Two.",
          },
          {
            type: "code_contains",
            value: "switch(n)",
            hint: "Start with switch (n) { ... }",
          },
          {
            type: "code_contains",
            value: "->",
            hint: "Use the enhanced switch arrow, e.g. case 1 -> ...",
          },
        ],
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
    practice: [
      {
        id: "jv-8-p1",
        title: "Count to 3",
        prompt: "Use a for loop to print 1, 2 and 3, each on its own line.",
        starterCode: javaMain("    // Write a for loop that prints 1, 2, 3\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "1\n2\n3",
            hint: "Print 1, 2, 3 — each number on its own line.",
          },
          {
            type: "code_contains",
            value: "for(",
            hint: "Use a for loop: for (int i = 1; i <= 3; i++)",
          },
        ],
      },
      {
        id: "jv-8-p2",
        title: "Say hi three times",
        prompt: "Use a for loop to print Hi three times, each on its own line.",
        starterCode: javaMain("    // Write a for loop that prints Hi three times\n"),
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "output_equals",
            value: "Hi\nHi\nHi",
            hint: "Print Hi three times, each on its own line.",
          },
          {
            type: "code_contains",
            value: "for(",
            hint: "Use a for loop: for (int i = 0; i < 3; i++)",
          },
        ],
      },
      {
        id: "jv-8-p3",
        title: "Countdown",
        prompt: "n holds 3. Use a while loop to print 3, 2 and 1, each on its own line (subtract 1 from n each time).",
        starterCode: javaMain("    int n = 3;\n    // Use a while loop to count down\n"),
        difficulty: "medium",
        xp: PRACTICE_XP.medium,
        checks: [
          {
            type: "output_equals",
            value: "3\n2\n1",
            hint: "Print 3, 2, 1 — each number on its own line.",
          },
          {
            type: "code_contains",
            value: "while(",
            hint: "Use a while loop: while (n > 0) { ... }",
          },
        ],
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
    practice: [
      {
        id: "jv-9-p1",
        title: "Add and get",
        prompt: 'Create an ArrayList of Strings called list, add the text "Java" to it, then print the first item.',
        starterCode:
          "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Create the list\n\n    // Put Java in it\n\n    // Print the first item\n  }\n}\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "code_contains",
            value: "new ArrayList<",
            hint: "Create the list with new ArrayList<String>().",
          },
          {
            type: "code_contains",
            value: ".get(0)",
            hint: "Read the first item with list.get(0).",
          },
          {
            type: "output_equals",
            value: "Java",
            hint: "The program should print exactly Java.",
          },
        ],
      },
      {
        id: "jv-9-p2",
        title: "Count two items",
        prompt: 'Create an ArrayList of Strings called list, add "A" and "B" to it, then print how many items it holds.',
        starterCode:
          "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Create the list\n\n    // Put two texts in it\n\n    // Print the number of items\n  }\n}\n",
        difficulty: "medium",
        xp: PRACTICE_XP.medium,
        checks: [
          {
            type: "code_contains",
            value: "new ArrayList<",
            hint: "Create the list with new ArrayList<String>().",
          },
          {
            type: "code_contains",
            value: ".add(",
            hint: "Add each item with list.add(...).",
          },
          {
            type: "code_contains",
            value: ".size()",
            hint: "Count the items with list.size().",
          },
          {
            type: "output_equals",
            value: "2",
            hint: "Two items were added — the program should print exactly 2.",
          },
        ],
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
    practice: [
      {
        id: "jv-10-p1",
        title: "Make the dog bark",
        prompt: "The Dog blueprint below already has a bark() method. In main, create a Dog object with new Dog() and call bark() on it.",
        starterCode:
          "public class Main {\n  public static void main(String[] args) {\n    // Create a Dog object and make it bark\n  }\n}\n\nclass Dog {\n  void bark() {\n    System.out.println(\"Woof!\");\n  }\n}\n",
        difficulty: "easy",
        xp: PRACTICE_XP.easy,
        checks: [
          {
            type: "code_contains",
            value: "new Dog(",
            hint: "Create the object with new Dog().",
          },
          {
            type: "output_equals",
            value: "Woof!",
            hint: "Call bark() on your Dog object — it prints Woof!",
          },
        ],
      },
      {
        id: "jv-10-p2",
        title: "Give the dog a breed",
        prompt: 'The Dog blueprint below has a breed attribute. In main, create a Dog object, set its breed to "Husky", then print the breed.',
        starterCode:
          "public class Main {\n  public static void main(String[] args) {\n    // Create a Dog, set its breed, then print the breed\n  }\n}\n\nclass Dog {\n  String breed;\n}\n",
        difficulty: "medium",
        xp: PRACTICE_XP.medium,
        checks: [
          {
            type: "code_contains",
            value: "new Dog(",
            hint: "Create the object with new Dog().",
          },
          {
            type: "code_contains",
            value: ".breed=",
            hint: "Set the attribute with yourDog.breed = \"Husky\";",
          },
          {
            type: "output_equals",
            value: "Husky",
            hint: "Print the breed — the program should print exactly Husky.",
          },
        ],
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

export function findPractice(lesson, practiceId) {
  return (lesson.practice || []).find((p) => p.id === practiceId) || null;
}
