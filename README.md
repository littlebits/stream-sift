# stream-sift [![Circle CI](https://circleci.com/gh/littlebits/stream-sift.svg?style=svg)](https://circleci.com/gh/littlebits/stream-sift)

Pattern matching for singleton or streaming documents [1].



## Installation

```
npm install --save stream-sift
```


## Overview

#### What
`stream-sift` is a document [1] pattern-matching library superficially similar to e.g. mongoDB query search syntax. It is suitable to use directly or build higher-level abstractions that compile down to it (eg: a RQL-like library).

[1] "Document" in the NoSQL sense; JavaScript "objects", Ruby "hashes", Elm "records", etc.  


#### How
`stream-sift` is divided into a "core" and "library". The core is an engine suitable for building arbitrary $functions on top of. Currently this project is "batteries included" meaning that a $function library is included, but is entirely modular and apart from core. In the future the $function library will be made its own project.



## Standard Library

#### Equivalence Functions

Longhand | Shorthand
-|-
N/A | `$eq`
N/A | `$neq`

```js
{ input: { percent: 10 } }
```
```js
{ input: { percent: { $eq: 10 } } } // true
{ input: { percent: { $eq: 20 } } } // false
```

You should not have to use `$eq` directly because literal values provide the same function:
```js
{ input: { percent: 10 } // true
{ input: { percent: 20 } } // false
```


#### Conditional Numeric Functions

Longhand | Shorthand
-|-
N/A | `$gt`
N/A | `$gte`
N/A | `$lt`
N/A | `$lte`

```js
{ input: { percent: 10 } }
```
```js
{ input: { percent: { $gt: 9 } } } // true
{ input: { percent: { $gt: 10 } } } // false
{ input: { percent: { $gte: 9 } } } // true
{ input: { percent: { $gte: 10 } } } // true
{ input: { percent: { $lt: 9 } } } // false
{ input: { percent: { $lt: 10 } } } // false
{ input: { percent: { $lte: 9 } } } // false
{ input: { percent: { $lte: 10 } } } // true
```

Longhand | Shorthand
-|-
N/A | $mod

Divide by value and check if remainder equals another value. The default remainder-check is against `0` and thus can be phrased as "does this static value evenly fit into the incoming value".

```js
{ input: { percent: 80 } }
```
```
{ input: { percent: { $mod: 10 } } } // true
{ input: { percent: { $mod: 39 } } } // false
{ input: { percent: { $mod: { value: 10, remainder: 2 } } } // false
{ input: { percent: { $mod: { value: 39, remainder: 2 } } } // true
```


#### Threshold Functions
###### Check if a number crosses a specified value.

Longhand | Shorthand
-|-
`$cross` | `$c`
`$crossOrEqual` | `$ce`

```js
{ input: { percent: 10 } },   { input: { percent: 50 } },   { input: { percent: 10 } }
```
```js
{ input: { percent: { $cross: 50 } } } // false, false, false
{ input: { percent: { $cross: 40 } } } // false, true, true
{ input: { percent: { $crossOrEqual: 50 } } } // false, true, true
```


#### Direction-bias Threshold Functions
###### Track when a number rises (using `crossGreaterThan*`) or falls (using `crossLessThan*`) beyond a specified value.

Longhand | Shorthand
-|-
`$crossGreaterThan` | `$cgt`
`$crossGreaterThanOrEqual` | `$cgte`
`$crossLessThan` | `$clt`
`$crossLessThanOrEqual` | `$clte`

```js
{ input: { percent: 10 } },   { input: { percent: 70 } },   { input: { percent: 30 } }
```
```js
{ input: { percent: { $crossGreaterThan: 69 } } } // false, true, false
{ input: { percent: { $crossGreaterThan: 70 } } } // false, false, false
{ input: { percent: { $crossGreaterThanOrEqual: 69 } } }  // false, true, false
{ input: { percent: { $crossGreaterThanOrEqual: 70 } } }  // false, true, false
{ input: { percent: { $crossLessThan: 30 } } } // false, false, false
{ input: { percent: { $crossLessThan: 31 } } } // false, false, true
{ input: { percent: { $crossLessThanOrEqual: 30 } } }  // false, false, true
{ input: { percent: { $crossLessThanOrEqual: 31 } } }  // false, false, true
```


#### Sub-Expression Negation

Longhand | Shorthand
-|-
`$not` | N/A

```js
{ input: { percent: 100, foo: 'bar' } }, { input: { percent: 100, foo: 'zed' } }, { input: { percent: 50, foo: 'zed' } }
```
```js
{ input: { $not { percent: 100 } } } // false, false, true
```


#### Logical Functions

Longhand | Shorthand
-|-
`$or` | N/A
`$nor` | N/A
`$xor` | N/A
`$and` | N/A
`$nand` | N/A
```

```js
{ input: { percent: 100, foo: 'bar' } }, { input: { percent: 100, foo: 'zed' } }, { input: { percent: 50, foo: 'zed' } }
```
```js
{ input: { $or [ { percent: 100 }, { foo: 'bar' } ] } } // true, true, false
{ input: { $nor [ { percent: 100 }, { foo: 'bar' } ] } } // false, false, true
{ input: { $xor [ { percent: 100 }, { foo: 'bar' } ] } } // false, true, false
{ input: { $and [ { percent: 100 }, { foo: 'bar' } ] } } // true, false, false
// $and is the default semantic; thus usually does not need to be used directly:
{ input: { percent: 100, foo: 'bar' } } // true, false, false
{ input: { $nand [ { percent: 100 }, { foo: 'bar' } ] } } // false, true, true
```



## Roadmap

#### New $fns

LongHand | Shorthand
-|-
`$in` | N/A
`$notIn` | `$nin`
`$regex` | `$re`
`$equal` | N/A (already done)
`$notAnd` | N/A (already done)
`$notOr` | N/A (already done)
`$notEqual` | N/A (already done)
`$greaterThan` | N/A (already done)
`$greaterThanOrEqual` | N/A (already done)
`$lessThan` | N/A (already done)
`$lessThanOrEqual` | N/A (already done)
N/A (already done) | `$n`
