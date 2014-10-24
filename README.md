# little-matcher

A minimal high-performance specification-backed stateful object matching engine



## Installation

Until this project is published do this:

    npm install --save littlebits/little-matcher



## Overview

#### What
little-matcher is a document [1] pattern-matching library. If you have used mongoDB query search syntax, this will feel familiar. Also, because little-matcher works at the document level, it is suitable to build higher-level abstractions that compile down to a little-matcher schema (eg: a RQL-like library). However, direct document pattern-matching can be (or *is* the) correct API sometimes (eg: HTTP payloads, function argument pattern-matching, ...).



[1] "Document" in the NoSQL sense; JavaScript "objects", Ruby "hashes", Elm "records", etc.  


#### How
little-matcher is divided into a "core" and "library". The core is an engine suitable for building arbitrary $functions on top of. Currently this project is "batteries included" meaning that a $function library is included, but is entirely modular and apart from core. In the future the $function library will be made its own project.



## $fn API

TODO
