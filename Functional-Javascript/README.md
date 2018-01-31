# Functional Javascript Notes

## Chapter 1

### Functional vs OO

Object oriented programming tends to break problems down into nouns or objects
where the functional approach tends to break down the problem into verbs or
behaviors.

A functional system strives to minimize observable state modification. This is 
advantageous because adding functionality requires only the understanding of the
localize data tranformations. The functional approach tries to minimize
side-effects which are the source of confusion in OO approaches.

**Practical Functional Programming** is the art of minimizing state change to the
smallest area possible for the system.


**Higher order function** is a function that takes in a function an returns
another function.

## Chapter 2 First Class Functions and Applicative Programming

**First-Class Function** means that a function can go anywhere that a value can go

JavaScript facilites the following paradigms:

* Imperative
* Prototypical
* Metaprogramming

**Imperative** programming is often the practice of high attention to detail of
algorithm execution and often directly inspecting state.

**Functional** pulling apart and reassembling a program from the same part.
Functions are the boundaries of the program. We can separate out domain logic from
generic functionality.

**Prototype-based** JavaScript is similar to Java or C# in that its constructor functions
are classes, but the method of use is at a lower level. The difference, however, is that 
JavaScript instances use existing objects as prototypes for the specialized objects. I
has a special protype-chain and dispatch.

**Metaprogramming** Related to prototype-based. Programming occurs when you write code to do
somethhing and metaprogramming occurs when you write code that changes the way something
is interpreted.

**Applicative Programming** Defined by the calling by function B of a function A, supplied
as an argument to function B. Examples are map, filter, reduce.

"It is better to have 100 functions operate on one data structure than 10 functions on 10
data structures"

- Alan Perlis

The key to functional programming is the gradual definition and use of discrete functionality
built from lower-level functions

## Chapter 3. Variable Scope and Closures

**Binding** refers to the act of assigning a value to a name via var, function args, this
passing, and property assignment.

**scope**

* The value of the this binding
* The execution context defined by the value of the this binding
* The lifetime of a variable
* The variable value resolution scheme, or the lexical binding

### Dynamic Scope

Under appreciate and over-abused concepts. It is built on the idea of global table of named
values.

Dynamic binding of the 'this' var can be useful when trying to bind actions to button 
clicks and lock in the references.

### Closures

A way to pass adhoc state via first-class functions. A closure is a function that "captures"
values near where it was born. A closure is a function that captures external bindings that
is not its own.

## Chapter 4. Higher-Order Functions

**Higher-Order Function**

* First-class
* Takes a function as an argument
* Returns a function as a result

