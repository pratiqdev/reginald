# Reginald [![shield](https://img.shields.io/badge/v1.0.0-white)](https://npm.js/not-yet-published)

*RegExp based long-form content file testing suite*


[![shield](https://img.shields.io/badge/Tests-Passing-green)](https://github.com/pratiqdev/reginald/tree/main/test)
[![shield](https://img.shields.io/badge/Status-Active_Development-yellow)](https://npm.js/not-yet-published)






<br />

> ## ACTIVE DEVELOPMENT
> This project is frequently getting updated with breaking changes. Only use for testing purposes.  
> Watch the [GitHub Repo](https://github.com/pratiqdev/reginald/issues) for updates and changes, or contribute!





<br />

## Installation

Install the package from npm using your preffered package manager
```
yarn add @pratiq/reginald
```

This package provides reginald as the default export
```js
import reginald from '@pratiq/consys'
```






<br />

## Simple Example

Import reginald and provide information about what paths/files to test and define some tests

```js
let results = await reginald({
    paths: ['../myArticles', '../review'],
    tests: {
        '1 - String Match': {
            regex: 'find me!',
            min:{
                value: 1,
                message: 'At least one match required!!! (min 1)'
            },
        },
    }
})
```