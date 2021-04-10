<h1 align="center">Welcome to Migration Buddy 👋</h1>
<p>
  <img alt="Version" src="https://badge.fury.io/js/migrationbuddy.svg" />
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
```json
{
  "endpoints": {
    "/todos/{id}": {
      "substitutions": {
        "id": "john.doe"
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
  "/todos/{id}": {
    "statusMatch": true,
    "status": "200 -> 200",
    "responseTime": "161ms -> 151ms (7% faster)"
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

Copyright © 2021 [James McNee](https://github.com/JamesMcNee).<br />
This project is [Unlicence](https://github.com/JamesMcNee/MigrationBuddy/blob/master/LICENSE.md) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_