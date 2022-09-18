# File TWOOOOO
 
    Skip to main content
    Skip to search
    Skip to select language

MDN Plus now available in your country! Support MDN and make it your own. Learn more ✨

    References
    Guides
    MDN Plus

Search MDN

    Already a subscriber?
    Get MDN Plus

    References
    JavaScript
    JavaScript
    Standard built-in objects
    Promise
    Promise.all()

Related Topics

    Standard built-in objects
    Promise
    Methods
        get Promise[@@species]
        Promise.all()
        Promise.allSettled()
        Promise.any()
        Promise.prototype.catch()
        Promise.prototype.finally()
        Promise.race()
        Promise.reject()
        Promise.resolve()
        Promise.prototype.then()
    Inheritance:
    Function
    Properties
    Methods
    Object
    Properties
    Methods

In this article

    Try it
    Syntax
    Description
    Examples
    Specifications
    Browser compatibility
    See also

Promise.all()

The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises. This returned promise will fulfill when all of the input's promises have fulfilled, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, and will reject with this first rejection message / error.
Try it
Syntax

Promise.all(iterable);

Parameters

iterable

    An iterable object such as an Array.

Return value

    An already fulfilled Promise if the iterable passed is empty.
    An asynchronously fulfilled Promise if the iterable passed contains no promises. Note, Google Chrome 58 returns an already fulfilled promise in this case.
    A pending Promise in all other cases. This returned promise is then fulfilled/rejected asynchronously (as soon as the stack is empty) when all the promises in the given iterable have fulfilled, or if any of the promises reject. See the example about "Asynchronicity or synchronicity of Promise.all" below. Returned values will be in order of the Promises passed, regardless of completion order.

Description

This method can be useful for aggregating the results of multiple promises. It is typically used when there are multiple related asynchronous tasks that the overall code relies on to work successfully — all of whom we want to fulfill before the code execution continues.

Promise.all() will reject immediately upon any of the input promises rejecting. In comparison, the promise returned by Promise.allSettled() will wait for all input promises to complete, regardless of whether or not one rejects. Consequently, it will always return the final result of every promise and function from the input iterable.

Note: The order of the promise array is preserved upon completion of this method.
Fulfillment

The returned promise is fulfilled with an array containing all the fulfilled values (including non-promise values) in the iterable passed as the argument.

    If an empty iterable is passed, then the promise returned by this method is fulfilled synchronously. The fulfilled value is an empty array.
    If a nonempty iterable is passed, and all of the promises fulfill, or are not promises, then the promise returned by this method is fulfilled asynchronously.

Rejection

If any of the passed-in promises reject, Promise.all asynchronously rejects with the value of the promise that rejected, whether or not the other promises have settled.
Examples
Using Promise.all

Promise.all waits for all fulfillments (or the first rejection).

const p1 = Promise.resolve(3);
const p2 = 1337;
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 100);
});

Promise.all([p1, p2, p3]).then(values => {
  console.log(values); // [3, 1337, "foo"]
});

If the iterable contains non-promise values, they will be ignored, but still counted in the returned promise array value (if the promise is fulfilled):

// this will be counted as if the iterable passed is empty, so it gets fulfilled
const p = Promise.all([1,2,3]);
// this will be counted as if the iterable passed contains only the resolved promise with value "444", so it gets fulfilled
const p2 = Promise.all([1,2,3, Promise.resolve(444)]);
// this will be counted as if the iterable passed contains only the rejected promise with value "555", so it gets rejected
const p3 = Promise.all([1,2,3, Promise.reject(555)]);

// using setTimeout we can execute code after the stack is empty
setTimeout(function() {
    console.log(p);
    console.log(p2);
    console.log(p3);
});

// logs
// Promise { <state>: "fulfilled", <value>: Array[3] }
// Promise { <state>: "fulfilled", <value>: Array[4] }
// Promise { <state>: "rejected", <reason>: 555 }

Asynchronicity or synchronicity of Promise.all

This following example demonstrates the asynchronicity (or synchronicity, if the iterable passed is empty) of Promise.all:

// we are passing as argument an array of promises that are already resolved,
// to trigger Promise.all as soon as possible
const resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

const p = Promise.all(resolvedPromisesArray);
// immediately logging the value of p
console.log(p);

// using setTimeout we can execute code after the stack is empty
setTimeout(function() {
    console.log('the stack is now empty');
    console.log(p);
});

// logs, in order:
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }

The same thing happens if Promise.all rejects:

const mixedPromisesArray = [Promise.resolve(33), Promise.reject(44)];
const p = Promise.all(mixedPromisesArray);
console.log(p);
setTimeout(function() {
    console.log('the stack is now empty');
    console.log(p);
});

// logs
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "rejected", <reason>: 44 }

But, Promise.all resolves synchronously if and only if the iterable passed is empty:

const p = Promise.all([]); // will be immediately resolved
const p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log(p);
console.log(p2)
setTimeout(function() {
    console.log('the stack is now empty');
    console.log(p2);
});

// logs
// Promise { <state>: "fulfilled", <value>: Array[0] }
// Promise { <state>: "pending" }
// the stack is now empty
// Promise { <state>: "fulfilled", <value>: Array[2] }

Promise.all fail-fast behavior

Promise.all is rejected if any of the elements are rejected. For example, if you pass in four promises that resolve after a timeout and one promise that rejects immediately, then Promise.all will reject immediately.

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('one'), 1000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('two'), 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('three'), 3000);
});
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('four'), 4000);
});
const p5 = new Promise((resolve, reject) => {
  reject(new Error('reject'));
});

// Using .catch:
Promise.all([p1, p2, p3, p4, p5])
.then(values => {
  console.log(values);
})
.catch(error => {
  console.error(error.message)
});

//From console:
//"reject"

It is possible to change this behavior by handling possible rejections:

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('p1_delayed_resolution'), 1000);
});

const p2 = new Promise((resolve, reject) => {
  reject(new Error('p2_immediate_rejection'));
});

Promise.all([
  p1.catch(error => { return error }),
  p2.catch(error => { return error }),
]).then(values => {
  console.log(values[0]) // "p1_delayed_resolution"
  console.error(values[1]) // "Error: p2_immediate_rejection"
})

Specifications
Specification
ECMAScript Language Specification
# sec-promise.all
Browser compatibility
Report problems with this compatibility data on GitHub
	desktop	mobile	server
	
Chrome
	
Edge
	
Firefox
	
Internet Explorer
	
Opera
	
Safari
	
Chrome Android
	
Firefox for Android
	
Opera Android
	
Safari on iOS
	
Samsung Internet
	
WebView Android
	
Deno
	
Node.js
all()
	
Legend

Full support
    Full support
No support
    No support

See also

    Promise
    Promise.race()

Found a problem with this page?

    Edit on GitHub
    Source on GitHub
    Report a problem with this content on GitHub
    Want to fix the problem yourself? See our Contribution guide.

Last modified: Jul 10, 2022, by MDN contributors

Your blueprint for a better internet.

    MDN on Twitter
    MDN on GitHub

MDN

    About
    Hacks Blog
    Careers

Support

    Product help
    Report a page issue
    Report a site issue

Our communities

    MDN Community
    MDN Forum
    MDN Chat

Developers

    Web Technologies
    Learn Web Development
    MDN Plus

    Website Privacy Notice
    Cookies
    Legal
    Community Participation Guidelines

Visit Mozilla Corporation’s not-for-profit parent, the Mozilla Foundation.
Portions of this content are ©1998–2022 by individual mozilla.org contributors. Content available under a Creative Commons license.
