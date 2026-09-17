export const PYTHON_CURRICULUM = [
  {
    id: "py-1",
    title: "Hello, Python!",
    concept: "The print() function",
    narrative: `Welcome to the Dojo! Python is a powerful, yet simple language. To make the computer "talk" to us, we use the \`print()\` function. 

Think of it like a megaphone: whatever you put inside the parentheses (and quotes), Python will shout out to the console.`,
    example: `print("Hello, World!")`,
    goal: "Try printing your own name to the console using the print() function.",
    initialCode: "# Your code goes here\n",
    xp: 50
  },
  {
    id: "py-2",
    title: "Variables: Memory Bins",
    concept: "Storing Data",
    narrative: `In programming, we often need to remember things. We use **Variables** for this. 

Think of a variable as a labeled storage bin. You give it a name, and put a value inside it. In Python, we use the \`=\` sign to "assign" a value to a name.`,
    example: `name = "Sensei"\nprint(name)`,
    goal: "Create a variable called 'hero' and assign it your favorite superhero's name, then print it.",
    initialCode: "# Create your variable here\n\n# Print it here\n",
    xp: 75
  }
];

export const JAVA_CURRICULUM = [
  {
    id: "jv-1",
    title: "The JVM Architecture",
    concept: "Compilation & Bytecode",
    narrative: `Java is unique because of its two-step process: **Compilation** and **Execution**. 

First, your source code is turned into **Bytecode**. Then, the **Java Virtual Machine (JVM)** translates that bytecode into native machine code. This is why Java works on ANY operating system!`,
    example: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Powered by JVM");\n  }\n}`,
    goal: "Run this class to see the JVM in action. Notice the '.java' file becomes '.class' bytecode behind the scenes!",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from the JVM!\");\n  }\n}\n",
    xp: 50
  },
  {
    id: "jv-2",
    title: "Anatomy of a Class",
    concept: "Classes & Methods",
    narrative: `In Java, everything lives in a **Class**. Think of a class as a container. Inside classes, we have **Methods** (actions).

Every program needs a \`main\` method as its entry point. Statements MUST end with a semicolon \`;\`.`,
    example: `public class Main {\n  public static void main(String[] args) {\n    System.out.print("Line 1");\n    System.out.println(" Line 2");\n  }\n}`,
    goal: "Use System.out.println() to print two different messages on two separate lines.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    // Print your first line here\n\n    // Print your second line here\n  }\n}\n",
    xp: 60
  },
  {
    id: "jv-3",
    title: "Variables & Primitives",
    concept: "Data Declaration",
    narrative: `Java is **Statically Typed**, meaning you must declare a variable's type before using it. 

**Primitives** store simple values. Common types: \`int\` (whole numbers), \`double\` (decimals), and \`boolean\` (true/false). Remember: \`float\` needs an 'F' suffix!`,
    example: `int age = 25;\ndouble price = 19.99F; // Wait, floats need F, doubles don't\ndouble tax = 0.15;`,
    goal: "Declare an 'int' named 'score' and a 'double' named 'bonus', then print their sum.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    int score = 100;\n    // Declare your double here\n\n    // Print score + bonus\n  }\n}\n",
    xp: 75
  },
  {
    id: "jv-4",
    title: "Casting & Parsing",
    concept: "Type Conversion",
    narrative: `Sometimes we need to convert types. **Implicit casting** is automatic (small -> large). **Explicit casting** is manual (large -> small) and uses parentheses \`(int)\`.

To turn a String into a number, we use **Wrapper Classes** like \`Integer.parseInt()\`.`,
    example: `double myDouble = 9.78;\nint myInt = (int) myDouble; // myInt is 9\nint converted = Integer.parseInt("123");`,
    goal: "Explicitly cast the double 45.99 into an integer and print the result.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    double price = 45.99;\n    // Cast price to an int and print it\n  }\n}\n",
    xp: 80
  },
  {
    id: "jv-5",
    title: "Strings & Immutability",
    concept: "Reference Types",
    narrative: `Strings are **Reference Types**. They are **Immutable**, meaning they cannot be changed—only replaced. 

Use \`.length()\` to get size, and \`.equals()\` to compare text. Never use \`==\` for comparing Strings!`,
    example: `String name = " Dojo ";\nSystem.out.println(name.trim().toUpperCase());`,
    goal: "Get the length of the string 'CodeDojo Arcade' and print it to the console.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    String title = \"CodeDojo Arcade\";\n    // Print the length of title using .length()\n  }\n}\n",
    xp: 70
  },
  {
    id: "jv-6",
    title: "The Math Class",
    concept: "Static Utilities",
    narrative: `Java's \`Math\` class is a toolbox of static methods. You don't need to create a "new" Math object to use them.

Methods: \`round()\`, \`ceil()\` (up), \`floor()\` (down), \`pow(base, exp)\`, and \`sqrt()\`.`,
    example: `double result = Math.pow(2, 3); // 8.0\nlong rounded = Math.round(5.4); // 5`,
    goal: "Calculate the square root of 64 using Math.sqrt() and print it.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    // Use Math.sqrt(64) and print the result\n  }\n}\n",
    xp: 80
  },
  {
    id: "jv-7",
    title: "Control Flow: Switch Arrow",
    concept: "Enhanced Switches",
    narrative: `Modern Java (14+) uses **Enhanced Switches** with the arrow operator \`->\`.

This eliminates the need for \`break\` statements and makes the code much cleaner and less error-prone.`,
    example: `String day = "Saturday";\nswitch(day) {\n  case "Saturday", "Sunday" -> System.out.println("Weekend!");\n  default -> System.out.println("Weekday.");\n}`,
    goal: "Create a switch statement that prints 'Even' if a variable 'num' is 2, 4, or 6.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    int num = 4;\n    // Use an enhanced switch arrow on 'num'\n  }\n}\n",
    xp: 90
  },
  {
    id: "jv-8",
    title: "Loops: The Engine",
    concept: "Repetition (For/While)",
    narrative: `Loops allow you to execute code multiple times. Use a **for** loop when you know the count, and a **while** loop when you don't.

\`for (int i = 0; i < 5; i++)\` is the heart of most iteration in Java.`,
    example: `for (int i = 0; i < 3; i++) {\n  System.out.println("Iteration " + i);\n}`,
    goal: "Write a for loop that prints the numbers 1 to 5, each on its own line.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    // Write your for loop here\n  }\n}\n",
    xp: 85
  },
  {
    id: "jv-9",
    title: "Arrays vs ArrayLists",
    concept: "Sequential Data",
    narrative: `**Arrays** are fixed in size and store primitives or objects. **ArrayLists** are dynamic collections that can grow or shrink.

Note: ArrayLists require **Wrapper Classes** (like \`Integer\`) because they only store objects, not raw primitives.`,
    example: `ArrayList<String> list = new ArrayList<>();\nlist.add("Java");\nSystem.out.println(list.get(0));`,
    goal: "Create an ArrayList of Strings named 'items', add 'Computer' to it, and print the size of the list.",
    initialCode: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Create the ArrayList named 'items' here\n\n    // Add \"Computer\" to items\n\n    // Print the number of items in the list\n  }\n}\n",
    xp: 95
  },
  {
    id: "jv-10",
    title: "Intro to OOP",
    concept: "Classes & Objects",
    narrative: `Java is **Object-Oriented**. A **Class** is a blueprint (like a 'Car' design), and an **Object** is the physical manifestation (the actual car in your driveway).

Use the \`new\` keyword to instantiate an object!`,
    example: `class Dog {\n  String breed;\n  void bark() { System.out.println("Woof!"); }\n}\n\nDog myDog = new Dog();\nmyDog.bark();`,
    goal: "In the main method, create an instance of the class 'Main' (using new Main()) and print its generic toString() result.",
    initialCode: "public class Main {\n  public static void main(String[] args) {\n    // Create a new instance of Main here\n    \n    // System.out.println(yourInstance);\n  }\n}\n",
    xp: 100
  }
];
