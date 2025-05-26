import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of the following is the correct way to declare a variable in C?",
    options: [
      "var x = 5;",
      "int x = 5;",
      "x = 5;",
      "declare x = 5;"
    ],
    correctAnswer: 1,
    explanation: "In C, variables must be declared with their data type. 'int x = 5;' is the correct syntax."
  },
  {
    id: 2,
    question: "What is the correct format specifier for printing an integer in printf()?",
    options: [
      "%s",
      "%f",
      "%d",
      "%c"
    ],
    correctAnswer: 2,
    explanation: "%d is used for printing integers in printf()."
  },
  {
    id: 3,
    question: "Which header file is required for using printf() function?",
    options: [
      "<math.h>",
      "<string.h>",
      "<stdio.h>",
      "<stdlib.h>"
    ],
    correctAnswer: 2,
    explanation: "stdio.h (standard input/output) header file contains printf() declaration."
  },
  {
    id: 4,
    question: "What is the size of an int data type in C?",
    options: [
      "2 bytes",
      "4 bytes",
      "8 bytes",
      "Depends on the compiler and system"
    ],
    correctAnswer: 3,
    explanation: "The size of int depends on the compiler and system architecture. It's typically 4 bytes on 32-bit systems and can be different on other systems."
  },
  {
    id: 5,
    question: "Which operator is used for taking input in C?",
    options: [
      "printf()",
      "scanf()",
      "input()",
      "cin>>"
    ],
    correctAnswer: 1,
    explanation: "scanf() is used to take input from the user in C programming."
  },
  {
    id: 6,
    question: "What is the correct way to write a single-line comment in C?",
    options: [
      "// This is a comment",
      "# This is a comment",
      "/* This is a comment */",
      "-- This is a comment"
    ],
    correctAnswer: 0,
    explanation: "// is used for single-line comments in C, while /* */ is used for multi-line comments."
  },
  {
    id: 7,
    question: "Which of the following is not a valid variable name in C?",
    options: [
      "my_variable",
      "_variable",
      "2variable",
      "myVariable"
    ],
    correctAnswer: 2,
    explanation: "Variable names cannot start with a number in C. They must start with a letter or underscore."
  },
  {
    id: 8,
    question: "What is the result of 5 + 3 * 2 in C?",
    options: [
      "16",
      "11",
      "13",
      "8"
    ],
    correctAnswer: 1,
    explanation: "C follows operator precedence. Multiplication (*) has higher precedence than addition (+), so 3 * 2 = 6 is done first, then 5 + 6 = 11."
  },
  {
    id: 9,
    question: "Which of the following is the correct way to define a constant in C?",
    options: [
      "const int MAX = 100;",
      "#define MAX 100",
      "Both A and B",
      "Neither A nor B"
    ],
    correctAnswer: 2,
    explanation: "In C, constants can be defined using either const keyword or #define preprocessor directive."
  },
  {
    id: 10,
    question: "What is the purpose of break statement in C?",
    options: [
      "To exit from a program",
      "To exit from a loop or switch",
      "To skip the current iteration",
      "To continue with the next iteration"
    ],
    correctAnswer: 1,
    explanation: "The break statement is used to exit from a loop or switch statement immediately."
  },
  {
    id: 11,
    question: "What is the correct way to include a user-defined header file in C?",
    options: [
      '#include "myheader.h"',
      '#include <myheader.h>',
      'import "myheader.h"',
      'require "myheader.h"'
    ],
    correctAnswer: 0,
    explanation: 'User-defined header files are included using double quotes (""), while system header files use angle brackets (<>).'
  },
  {
    id: 12,
    question: "Which of the following is true about arrays in C?",
    options: [
      "Arrays can change size dynamically",
      "Array index starts from 1",
      "Array elements are stored in contiguous memory locations",
      "Arrays can store different types of data"
    ],
    correctAnswer: 2,
    explanation: "In C, array elements are stored in contiguous memory locations, making access efficient."
  },
  {
    id: 13,
    question: "What is the purpose of sizeof operator in C?",
    options: [
      "To find the length of a string",
      "To find the size of a variable or data type in bytes",
      "To find the size of an array",
      "To allocate memory"
    ],
    correctAnswer: 1,
    explanation: "sizeof operator returns the size in bytes of a variable or data type."
  },
  {
    id: 14,
    question: "Which operator is used for pointer declaration in C?",
    options: [
      "@",
      "#",
      "&",
      "*"
    ],
    correctAnswer: 3,
    explanation: "The asterisk (*) operator is used to declare a pointer variable in C."
  },
  {
    id: 15,
    question: "What is the correct way to read a character in C?",
    options: [
      "getc()",
      "scanf()",
      "getchar()",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Characters can be read using any of these functions in C: getc(), scanf(), or getchar()."
  },
  {
    id: 16,
    question: "Which of the following is not a valid data type in C?",
    options: [
      "int",
      "float",
      "string",
      "char"
    ],
    correctAnswer: 2,
    explanation: "C doesn't have a built-in string data type. Strings are represented as arrays of characters."
  },
  {
    id: 17,
    question: "What is the purpose of continue statement in C?",
    options: [
      "To exit the program",
      "To skip the rest of the loop's body and continue with next iteration",
      "To break the loop",
      "To pause the program"
    ],
    correctAnswer: 1,
    explanation: "continue statement skips the remaining code inside a loop for the current iteration."
  },
  {
    id: 18,
    question: "Which operator is used to find the address of a variable in C?",
    options: [
      "*",
      "&",
      "#",
      "@"
    ],
    correctAnswer: 1,
    explanation: "The ampersand (&) operator is used to find the memory address of a variable."
  },
  {
    id: 19,
    question: "What is the correct way to declare a function in C?",
    options: [
      "function add(int a, int b)",
      "void function add(int a, int b)",
      "int add(int a, int b)",
      "def add(int a, int b)"
    ],
    correctAnswer: 2,
    explanation: "In C, functions are declared with return type followed by function name and parameters."
  },
  {
    id: 20,
    question: "Which of the following is true about main() function in C?",
    options: [
      "It can return void",
      "It can have any name instead of main",
      "It must return int",
      "It can't have parameters"
    ],
    correctAnswer: 2,
    explanation: "In standard C, main() function must return int. void main() is not standard compliant."
  }
];