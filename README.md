# stream-sift

A minimal high-performance specification-backed stateful object matching engine



## Installation

```sh
npm install --save stream-sift
```


## Overview

#### What
stream-sift is a document [1] pattern-matching library. If you have used mongoDB query search syntax, this will feel familiar. Also, because stream-sift works at the document level, it is suitable to build higher-level abstractions that compile down to a stream-sift schema (eg: a RQL-like library). However, direct document pattern-matching can be (or *is* the) correct API sometimes (eg: HTTP payloads, function argument pattern-matching, ...).



[1] "Document" in the NoSQL sense; JavaScript "objects", Ruby "hashes", Elm "records", etc.  


#### How
stream-sift is divided into a "core" and "library". The core is an engine suitable for building arbitrary $functions on top of. Currently this project is "batteries included" meaning that a $function library is included, but is entirely modular and apart from core. In the future the $function library will be made its own project.



## $fn API

#### $eq / $neq
Check for an exact match.

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


#### $gt / $gte / $lt / $lte
Check for numeric conditions.

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

#### $mod
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


#### $cross / $crossOrEqual
#### $c / $ce
Non-directional threshold functions. Check if a number crosses a given level.
```js
{ input: { percent: 10 } },   { input: { percent: 50 } },   { input: { percent: 10 } }
```
```js
{ input: { percent: { $cross: 50 } } } // false, false, false
{ input: { percent: { $cross: 40 } } } // false, true, true
{ input: { percent: { $crossOrEqual: 50 } } } // false, true, true
```


#### $crossGreaterThan / $crossGreaterThanOrEqual / $crossLessThan / $crossLessThanOrEqual
#### $cgt / $cgte / $clt / $clte
Directional threshold functions. Check if numbers rise/fall (respective to the function) past a given level.
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


#### $not
Negate the sub-expression.
```js
{ input: { percent: 100, foo: 'bar' } }, { input: { percent: 100, foo: 'zed' } }, { input: { percent: 50, foo: 'zed' } }
```
```js
{ input: { $not { percent: 100 } } } // false, false, true
```


#### $or / $nor / $xor / $and / $nand
Logical functions.

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
- $in
- $nin
- $regex
