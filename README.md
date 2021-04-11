<h1 align="center">Welcome to Migration Buddy 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/migrationbuddy" target="_blank">
    <img alt="Version" src="https://badge.fury.io/js/migrationbuddy.svg" />
  </a>
  <a href="https://github.com/JamesMcNee/MigrationBuddy#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/JamesMcNee/MigrationBuddy/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/JamesMcNee/MigrationBuddy/blob/master/LICENSE.md" target="_blank">
    <img alt="License: Unlicence" src="https://img.shields.io/github/license/JamesMcNee/MigrationBuddy" />
  </a>
</p>

## Description + Example
TL;DR: Utility to aid in the migration of endpoints (especially useful for cloud migrations) by hitting both the old and new service and comparing various properties.

This utility is aimed at ensuring parity between two `GET` endpoints (and sets of endpoints). For each provided endpoint a request will be made of each of the defined services and properties about the request recorded such as:

- Status code
- Response time
- Response body

Using the above a 'report' is generated with the comparison results including a diff of the response bodies.

### Example config:

Each endpoint can optionally have the following properties:
- `candidatePath`: An alternate path to use for the candidate service. This is useful if the endpoint has changed slightly between services i.e. `/api/v1/todos/{id}` -> `/api/v2/todos/{id}`.
- `substitutions`: A JSON key value structure allowing for URL templating. Any matching instances of a variable in the path e.g. `{key}` will be replaced by a corresponding substitution value from the map.
- `options`: 
  - `diff`: 
    - `sortArrays`: Boolean value indicating if arrays should be sorted (recursively) when performing the diff.
    - `ignoreKeys`: String array of keys to be ignored when performing the diff.

```json
{
  "endpoints": {
    "/v1/todos/{id}": {
      "candidatePath": "/v2/todos/{id}",
      "substitutions": {
        "id": "john.doe"
      },
      "options": {
        "diff": {
          "sortArrays": true,
          "ignoreKeys": ["_title"]
        }
      }
    }
  },
  "configuration": {
    "control": {
      "url": "https://my-old-api.tld/api",
      "headers": {
        "Authorization": "old-auth"
      }
    },
    "candidate": {
      "url": "https://my-new-api.tld/api",
      "headers": {
        "Authorization": "new-auth"
      }
    }
  }
}
```

### Example report/output
```json
{
  "/v1/todos/{id}": {
    "statusMatch": true,
    "status": "200 -> 200",
    "responseTime": "295ms -> 120ms (146% faster)",
    "diff": {
      "title": {
        "__old": "Buy Milk",
        "__new": "Buy Eggs"
      }
    }
  }
}
```

## 🛠 Installation
This utility is available on NPM! Simply run the following to get started:

`npm install -g migrationbuddy`

## 🚀 Usage

 - Generate a configuration file template/example
   
    `migbuddy generate <path/to/write/file.json>`
- Execute endpoint comparison

    `migbuddy <path/to/config/file.json>`
    
    Flags:
    - `of, --output-file <path>` [Optional] - File to output results JSON to.
    - `-oc, --output-to-clipboard` [Optional, default false] - Copy the result JSON structure to the clipboard.
    - `-v, --verbose` [Optional, default false] - Enable verbose logging -- may help to identify errors.
    - For most up-to-date flags run `migbuddy --help`.


## Author

👤 **James McNee**

* Website: https://www.jamesmcnee.com
* Github: [@JamesMcNee](https://github.com/JamesMcNee)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [James McNee](https://github.com/JamesMcNee). <br />
This project is [Unlicence](https://github.com/JamesMcNee/MigrationBuddy/blob/master/LICENSE.md) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_