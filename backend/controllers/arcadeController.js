import { MistralAI } from "@langchain/mistralai";
import User from '../models/User.js';

const JAVA_CURRICULUM = `
## Java Curriculum Reference (use this to teach concepts in proper order and depth)

### 1. Introduction and Setup
Java requires a JDK (compiler + runtime) and an IDE. Programs undergo compilation (source code → bytecode) then execution (JVM translates bytecode → native machine code). This makes Java platform-independent.

### 2. Anatomy of a Java Program
The smallest blocks are functions (called methods when in a class). Classes contain methods, packages contain classes. Every program needs a class with a main method: public static void main(String[] args). Statements go inside {} and end with ;. Output uses System.out.println().

### 3. Variables and Data Types
Variables are temporary memory locations. Java uses PascalCase for classes, camelCase for variables/methods.
- Primitive Types (stored on stack): byte(1B), short(2B), int(4B), long(8B, suffix L), float(4B, suffix F), double(8B), char(2B, single quotes), boolean
- Reference Types (stored on heap): String, Date, etc. Use 'new' keyword. Comparing with == checks address, not value.
- Scope: local (within method/block) vs class-level. Use 'final' for constants (ALL_CAPS naming).

### 4. Casting, Parsing, and Wrapper Classes
- Implicit casting: smaller → larger type automatically (short → int → double)
- Explicit casting: (int)doubleVar — may lose precision
- Wrapper classes: Integer, Double, Character, Boolean. Autoboxing/unboxing. Integer.parseInt() for string→number.

### 5. Math Operations and Random
Operators: +, -, *, /, % (modulus for even/odd), ++, --, +=, -=. Order: PEMDAS.
Math class: Math.round(), Math.ceil(), Math.floor(), Math.max(), Math.min(), Math.sqrt(), Math.pow().
Random class: new Random(), nextInt(bound), nextDouble().

### 6. User Input and Formatting
Scanner: new Scanner(System.in). Methods: nextLine(), nextInt(), nextDouble(). Caution: clear buffer with empty nextLine() after nextInt/nextDouble. Close with scanner.close().
NumberFormat: getCurrencyInstance(), getPercentInstance().
printf: %s string, %c char, %d int, %f double, %b boolean, %.2f for 2 decimals.

### 7. Strings
Immutable. Methods: length(), charAt(), indexOf(), toUpperCase(), trim(), replace(), isEmpty(), substring(start, end).
Compare with .equals() or .equalsIgnoreCase(), NOT ==.
Escape sequences: \\", \\n, \\t.

### 8. Control Flow
Comparison: ==, !=, <, >, <=, >=. Logical: && (AND), || (OR), ! (NOT).
- If/Else: top-to-bottom condition checking
- Ternary: condition ? trueValue : falseValue
- Switch: for single variable vs many cases. Enhanced switch (Java 14+): case "X" -> with comma-separated cases.

### 9. Loops
- while: unknown iterations, condition checked first
- do-while: runs at least once, condition at end
- for: known iterations: for(int i = 0; i < n; i++)
- Nested loops: outer=rows, inner=columns
- break (exit loop), continue (skip to next iteration)

### 10. Arrays and ArrayLists
- Arrays: fixed size, same type, index from 0. 2D arrays: int[][]. Arrays.sort(), Arrays.fill().
- ArrayList: dynamic, objects only (use wrappers). .add(), .remove(), .set(), .get(), .size().
- For-each: for(Type var : array)

### 11. Methods
Access modifier + return type + name + parameters. void = no return. Arguments are actual values passed.
- Overloading: same name, different parameter lists
- Varargs: Type... paramName — accepts any number of args, packed into array

### 12. OOP Principles
Objects have attributes (state) and methods (behavior). Classes are blueprints.
- Constructors: same name as class, called with 'new', use 'this' keyword. Can be overloaded.
- static: belongs to class, not instance. Shared across objects.
- Inheritance: extends keyword. super() calls parent constructor.
- Method Overriding: @Override annotation. Subclass redefines parent method.
- toString(): override to return meaningful object description.
- Abstraction: abstract class (can't instantiate directly), abstract methods (children must implement).
- Interfaces: implements keyword, multiple interfaces allowed. Methods are abstract contracts.
- Polymorphism: object identifies as multiple types. Runtime polymorphism = method chosen during execution.
- Encapsulation: private attributes, public getters/setters.
- Aggregation (has-a, independent) vs Composition (part-of, dependent).

### 13. Exceptions and Error Handling
try/catch/finally. Try-with-Resources: try(Scanner sc = new Scanner(System.in)). Common: InputMismatchException, IOException.

### 14. File I/O
FileWriter for writing. FileReader + BufferedReader for reading line-by-line with readLine() until null.

### 15. Advanced Topics
- Dates: LocalDate, LocalTime, LocalDateTime, Instant. DateTimeFormatter.
- Anonymous Classes: inline override for one-off instances.
- Timers: Timer + TimerTask with run() method, scheduled by delay in ms.
- Multithreading: Runnable interface, Thread class, .start(), .join(), Daemon threads.
- Enums: named constants with fixed properties. Great with switch.
- Generics: <T> type parameters. Type safety without code duplication.
- HashMaps: key-value pairs via Generics. No duplicate keys. put(), remove(), get(), containsKey().
`;

const PYTHON_CURRICULUM = `
## Python Curriculum Reference (use this to teach concepts in proper order and depth)

### 1. Hello World & Print
print() function. Strings in single or double quotes. Multi-line strings with triple quotes.

### 2. Variables & Data Types
No type declaration needed. Types: int, float, str, bool. type() to check. Dynamic typing.
Naming: snake_case. Constants in ALL_CAPS by convention.

### 3. Operators
Arithmetic: +, -, *, /, // (floor division), % (modulus), ** (power).
Comparison: ==, !=, <, >, <=, >=.
Assignment: +=, -=, *=, /=.

### 4. Strings
Immutable sequences. Concatenation with +. f-strings: f"Hello {name}".
Methods: .upper(), .lower(), .strip(), .replace(), .split(), .join(), .find(), .count().
Slicing: string[start:end:step]. len() for length.

### 5. User Input
input() returns string. int(input()) or float(input()) for numbers.

### 6. Conditionals
if/elif/else with colons and indentation. Logical: and, or, not.
Ternary: value_if_true if condition else value_if_false.

### 7. Loops
- while: while condition:
- for: for item in iterable: / for i in range(start, stop, step):
- break, continue, else clause on loops
- List comprehensions: [expr for item in iterable if condition]

### 8. Functions
def function_name(params): with return. Default parameters. *args and **kwargs.
Lambda: lambda x: x * 2. Scope: local vs global.

### 9. Data Structures
- Lists: ordered, mutable. [], .append(), .insert(), .remove(), .pop(), .sort(), .reverse().
- Tuples: ordered, immutable. ().
- Sets: unordered, unique. {}, .add(), .remove(), .union(), .intersection().
- Dictionaries: key-value. {}, .keys(), .values(), .items(), .get(), .update().

### 10. OOP
class ClassName: with __init__(self). self keyword. Attributes and methods.
Inheritance: class Child(Parent). super().__init__().
Encapsulation: _protected, __private. @property decorator.
Polymorphism: method overriding. isinstance().
Abstraction: from abc import ABC, abstractmethod.

### 11. Exception Handling
try/except/else/finally. raise Exception(). Custom exceptions.

### 12. File I/O
open(file, mode). with open() as f: for auto-close. .read(), .readline(), .readlines(), .write().
Modes: 'r', 'w', 'a', 'r+'.
`;

const SYSTEM_PROMPT = `You are **Sensei**, a passionate technical mentor inside CodeDojo Arcade.

## Your Role
You are now assisting a student working through a **Structured Learning Path**. Your goal is to be their "Help Specialist."

{CURRICULUM}

## Teaching Rules
1. **Contextual Help:** When a student asks for help, analyze their current code, the lesson goal, and the output. Explain the logic of their mistake without giving the full answer immediately.
2. **Encouraging Mentor Persona:** Be warm, professional, and knowledgeable. Treat them as a university student. Avoid all "magic" or "childish" metaphors.
3. **Guidance first:** Use logical analogies and technical "whys" to build their confidence.
4. **Java Precision:** In Java, remind them that everything must be inside a class and main method.
5. **Tone:** You are the wise mentor who sparks their hunger for learning. Be impactful but simple.`;

const TIMEOUT_MS = 30000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error(label + " timed out after " + (ms / 1000) + "s"));
      }, ms);
    })
  ]);
}

export const getProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('arcadeProgress');
    res.status(200).json({
      success: true,
      data: user.arcadeProgress
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user._id);
    
    if (progress > user.arcadeProgress) {
      user.arcadeProgress = progress;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      data: user.arcadeProgress
    });
  } catch (error) {
    next(error);
  }
};

export const arcadeChat = async (req, res, next) => {
  try {
    const { language, question, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Please provide a question' });
    }

    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({ success: false, error: 'AI service is not configured.' });
    }

    const lang = language || 'python';
    const langDisplay = lang.charAt(0).toUpperCase() + lang.slice(1);
    const curriculum = lang === 'java' ? JAVA_CURRICULUM : PYTHON_CURRICULUM;
    const systemPrompt = SYSTEM_PROMPT
      .replace('{LANGUAGE}', langDisplay)
      .replace('{CURRICULUM}', curriculum);

    // Build message array from history
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (last 30 messages to keep context manageable)
    const recentHistory = history.slice(-30);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add the current question
    messages.push({ role: "user", content: question });

    const chat = new MistralAI({
      model: "codestral-latest",
      temperature: 0.7,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const response = await withTimeout(
      chat.invoke(messages),
      TIMEOUT_MS,
      'Arcade AI response'
    );

    res.status(200).json({
      success: true,
      data: {
        answer: response.content || response || "Hmm, I couldn't generate a response. Try again!",
      },
    });

  } catch (error) {
    console.error("[Arcade] Error:", error.message);
    
    if (error.message.includes('timed out')) {
      return res.status(200).json({
        success: true,
        data: { answer: "Sensei is thinking too hard! Please try asking again." },
      });
    }

    next(error);
  }
};
