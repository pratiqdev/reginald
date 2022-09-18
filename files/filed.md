    Learn
    Documentation
    Download
    Community

    search

GitHub

    offline_bolt
    Quick Start
    Introduction to Node.js
    A brief history of Node.js
    How to install Node.js
    How much JavaScript do you need to know to use Node.js?
    Differences between Node.js and the Browser

    offline_bolt
    Getting Started
    The V8 JavaScript Engine
    Run Node.js scripts from the command line
    How to exit from a Node.js program
    How to read environment variables from Node.js
    How to use the Node.js REPL
    Node.js, accept arguments from the command line
    Output to the command line using Node.js
    Accept input from the command line in Node.js
    Expose functionality from a Node.js file using exports
    An introduction to the npm package manager
    Where does npm install the packages?
    How to use or execute a package installed using npm
    The package.json guide
    The package-lock.json file
    Find the installed version of an npm package
    Install an older version of an npm package
    Update all the Node.js dependencies to their latest version
    Semantic Versioning using npm
    Uninstalling npm packages
    npm global or local packages
    npm dependencies and devDependencies
    The npx Node.js Package Runner
    The Node.js Event Loop
    Understanding process.nextTick()
    Understanding setImmediate()
    Discover JavaScript Timers
    JavaScript Asynchronous Programming and Callbacks
    Understanding JavaScript Promises
    Modern Asynchronous JavaScript with Async and Await
    The Node.js Event emitter
    Build an HTTP Server
    Making HTTP requests with Node.js
    Get HTTP request body data using Node.js
    Working with file descriptors in Node.js
    Node.js file stats
    Node.js File Paths
    Reading files with Node.js
    Writing files with Node.js
    Working with folders in Node.js
    The Node.js fs module
    The Node.js path module
    The Node.js os module
    The Node.js events module
    The Node.js http module
    Node.js Buffers
    Node.js Streams
    Node.js, the difference between development and production
    Error handling in Node.js
    How to log an object in Node.js
    Node.js with TypeScript
    Node.js with WebAssembly

Output to the command line using Node.js
TABLE OF CONTENTS
Basic output using the console module

Node.js provides a console module which provides tons of very useful ways to interact with the command line.

It is basically the same as the console object you find in the browser.

The most basic and most used method is console.log(), which prints the string you pass to it to the console.

If you pass an object, it will render it as a string.

You can pass multiple variables to console.log, for example:

JS

const x = 'x';
const y = 'y';
console.log(x, y);

and Node.js will print both.

We can also format pretty phrases by passing variables and a format specifier.

For example:

JS

console.log('My %s has %d ears', 'cat', 2);

    %s format a variable as a string
    %d format a variable as a number
    %i format a variable as its integer part only
    %o format a variable as an object

Example:

JS

console.log('%o', Number);

Clear the console

console.clear() clears the console (the behavior might depend on the console used)
Counting elements

console.count() is a handy method.

Take this code:

What happens is that console.count() will count the number of times a string is printed, and print the count next to it:

You can just count apples and oranges:

JS

const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => {
  console.count(fruit);
});
apples.forEach(fruit => {
  console.count(fruit);
});

Reset counting

The console.countReset() method resets counter used with console.count().

We will use the apples and orange example to demonstrate this.

JS

const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => {
  console.count(fruit);
});
apples.forEach(fruit => {
  console.count(fruit);
});

console.countReset('orange');

oranges.forEach(fruit => {
  console.count(fruit);
});

Notice how the call to console.countReset('orange') resets the value counter to zero.
Print the stack trace

There might be cases where it's useful to print the call stack trace of a function, maybe to answer the question how did you reach that part of the code?

You can do so using console.trace():

JS

const function2 = () => console.trace();
const function1 = () => function2();
function1();

This will print the stack trace. This is what's printed if we try this in the Node.js REPL:

BASH

Trace
    at function2 (repl:1:33)
    at function1 (repl:1:25)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:44:33)
    at REPLServer.defaultEval (repl.js:239:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:440:10)
    at emitOne (events.js:120:20)
    at REPLServer.emit (events.js:210:7)

Calculate the time spent

You can easily calculate how much time a function takes to run, using time() and timeEnd()

JS

const doSomething = () => console.log('test');
const measureDoingSomething = () => {
  console.time('doSomething()');
  // do something, and measure the time it takes
  doSomething();
  console.timeEnd('doSomething()');
};
measureDoingSomething();

stdout and stderr

As we saw console.log is great for printing messages in the Console. This is what's called the standard output, or stdout.

console.error prints to the stderr stream.

It will not appear in the console, but it will appear in the error log.
Color the output

You can color the output of your text in the console by using escape sequences. An escape sequence is a set of characters that identifies a color.

Example:

JS

console.log('\x1b[33m%s\x1b[0m', 'hi!');

You can try that in the Node.js REPL, and it will print hi! in yellow.

However, this is the low-level way to do this. The simplest way to go about coloring the console output is by using a library. Chalk is such a library, and in addition to coloring it also helps with other styling facilities, like making text bold, italic or underlined.

You install it with npm install chalk@4, then you can use it:

JS

const chalk = require('chalk');

console.log(chalk.yellow('hi!'));

Using chalk.yellow is much more convenient than trying to remember the escape codes, and the code is much more readable.

Check the project link posted above for more usage examples.
Create a progress bar

Progress is an awesome package to create a progress bar in the console. Install it using npm install progress

This snippet creates a 10-step progress bar, and every 100ms one step is completed. When the bar completes we clear the interval:

JS

const ProgressBar = require('progress');

const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    clearInterval(timer);
  }
}, 100);

    Contributors
    flaviocopes
    potch
    MylesBorins
    fhemberger
    LaRuaNa
    amiller-gh
    ahmadawais

Edit this page on GitHub

    ←   Prev
    Next   →

    Trademark Policy
    Privacy Policy
    Code of Conduct
    Security Reporting
    About
    Blog

    © OpenJS Foundation
    GitHub
