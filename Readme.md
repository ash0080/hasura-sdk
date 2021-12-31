# @ash0080/hasura-sdk
Hasura Healthz/Schema/Metadata/PGdump API SDK. Written in TypeScript,
Carefully tested and well orgnized.

## Movtive
Hasura does not provide a full official API SDK so far, in some projects that aim to extend hasura, we often see developers injecting SQL directly into postgres and modifying metadata by migration, which may make the initialization of the project less reliable.
Since hasura provided a REST API, why don't we use it?

## Installation

```yarn add @ash0080/hasura-sdk```

```npm install @ash0080/hasura-sdk```

```cp .env.example to /path to your project/.env```

## Usage
```
import {metadata as m, schema as s} from '@ash/hasura-sdk'
const runASQL = s.sql({sql: `SELECT version()`})
const sqlResp = await runASQL.run()

// Or you can use it in a bulk
const bulkResp = await s.bulk([
  runASQL.json()
  //...other sql operations
])

// Call a metadata API
const trackATable = m.table.track({table: {schema: 'public', name: 'user'}})
// or short for default schema {table: 'user'}

const metaResp = await trackATable.run()

// or bulk
const bulkResp = await m.bulk([
  trackTable.toJson()
  //...other metadata operations
])
```
For details, you can check index.ts under each corresponding folders
Or, check test files for all examples !

## Coverage
```text
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |    95.1 |    67.64 |   96.38 |   95.03 |
 src          |     100 |       90 |     100 |     100 |
  queries.ts  |     100 |       90 |     100 |     100 | 93,103
 src/healthz  |    90.9 |    66.66 |     100 |   88.88 |
  index.ts    |    90.9 |    66.66 |     100 |   88.88 | 12
 src/helper   |   70.58 |     12.5 |   33.33 |   70.58 |
  client.ts   |     100 |      100 |     100 |     100 |
  error.ts    |   54.54 |     12.5 |   33.33 |   54.54 | 5-7,24-25
  headers.ts  |     100 |      100 |     100 |     100 |
 src/metadata |   98.57 |      100 |   98.52 |   98.57 |
  index.ts    |   98.57 |      100 |   98.52 |   98.57 | 208
 src/schema   |     100 |      100 |     100 |     100 |
  index.ts    |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
```


The main type definition in this project comes directly from the official hasura/graphql-engine/console, in order to keep the future
iterations, I did not modify this file directly, but added a patch file to extend and modify it (yes, there are some bugs in the official
 file), anyway, so I can not achieve 100% coverage, in addition, there is an api in the metadata API that is only available in the
 cloud/enterprise version, I can not test it well.(line 208)

## API

Based on the official sdk grouping, I grouped all the APIs according to their functionality to make the syntax more comfortable to use:

* add - refers to you can add multiple
* create - refers to there is only one

Officially there is no distinction between SQL functions, and there are actually two kinds of functions,
so you will see the subclass "schemaFunction"

```
Schema:/
├── bulk
└── sql

Metadata:/
├── bulk
├── source/
│   ├── add
│   └── drop
├── schemaFunction/
│   ├── track
│   ├── untrack
│   ├── customize
│   └── permission/
│       ├── add
│       └── drop
├── table/
│   ├── track
│   ├── untrack
│   ├── customize
│   ├── setAsEnum
│   ├── permission/
│   │   ├── insert/
│   │   │   ├── add
│   │   │   └── drop
│   │   ├── select/
│   │   │   ├── add
│   │   │   └── drop
│   │   ├── update/
│   │   │   ├── add
│   │   │   └── drop
│   │   ├── delete/
│   │   │   ├── add
│   │   │   └── drop
│   │   └── comment
│   ├── relationship/
│   │   ├── addObjectRL
│   │   ├── addArrayRL
│   │   ├── drop
│   │   ├── rename
│   │   └── comment
│   └── computedField/
│       ├── add
│       └── drop
├── action/
│   ├── setCustomTypes
│   ├── add
│   ├── drop
│   ├── update
│   └── permission/
│       ├── add
│       └── drop
├── remoteSchema/
│   ├── add
│   ├── update
│   ├── drop
│   ├── reload
│   ├── introspect
│   └── permission/
│       ├── add
│       └── drop
├── trigger/
│   ├── event/
│   │   ├── add
│   │   ├── redeliver
│   │   ├── invoke
│   │   └── drop
│   ├── cron/
│   │   ├── add
│   │   └── drop
│   └── schedule/
│       ├── add
│       └── drop
├── metadata/
│   ├── export
│   ├── replace
│   ├── reload
│   ├── clear
│   └── inconsistent/
│       ├── get
│       └── drop
├── rest/
│   ├── createCollection
│   ├── dropCollection
│   ├── addQueryToCollection
│   ├── dropQueryFromCollection
│   ├── addCollectionToAllowlist
│   ├── dropCollectionFromAllowlist
│   ├── createRestEndpoint
│   └── dropRestEndpoint
└── setting/
    ├── GraphQL/
    │   └── setIntrospection
    ├── TLSallowList/
    │   ├── addHost
    │   └── dropHost
    └── InheritedRole/
        ├── add
        └── drop
```

## Changelog

1.0.0 - Cover the full features of the Healthz/Schema/Metadata/PGdump API


## Todo
1. I have not tested other databases besides postgres, so if anyone is using these databases, I hope they can test them or even submit a
pull request. The project currently supports all database prefixes, but it seems that some databases do not have the same request data
fields and may need to be modified;
2. Add some get operations (SQL template) to get some current configuration data, This makes it easy to verify existing configurations
when we write extension projects, whether a table already exists, whether a relationship already exists, etc;
3. Add some helper functions to make things simple, For example, to add a computed field, it's a sequence of operations,

*Regarding the third point, I have not yet decided whether to write in this project, or most likely will open a new project


## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[ash0080](Eldarion) and [contributors](/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
