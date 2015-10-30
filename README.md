# gulp-angular-data

> Compiles data files into Angular constants.

Compiles JSON, HJSON, and YAML files into `angular.constant()` blocks. Uses [gulp-ng-constant](https://www.npmjs.com/package/gulp-ng-constant) behind the scenes.

```
// test1.json
{
  "firstName": "John",
  "LastName": "Doe"
}

// compiles to:
angular.module("ngConstants", [])
.constant("test1Data", {
  "firstName": "John",
  "LastName": "Doe"
});
```

## Install

```
$ npm install --save-dev gulp-angular-data
```

## Usage

```js
var gulp = require('gulp');
var angularData = require('gulp-angular-data');

gulp.task('default', function() {
  return gulp.src('src/*.json')
    .pipe(angularData('outputFile.js'))
    .pipe(gulp.dest('dist'));
});
```

Source files are parsed based on their file extensions:

* `.json` -- JSON, using [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* `.hjson` -- [HJSON](http://hjson.org/)
* `.yaml` or `.yml` -- [YAML](http://yaml.org/)

## API

### angularData(outputFilename, [options])

#### outputFilename

Type: `string`

The filename to hold the the Javascript output.

#### options

Type: `object`

This plugin passes its options to gulp-ng-constant, so you can also use any of [its options](https://www.npmjs.com/package/gulp-ng-constant#options).

#### options.prefix

Type: `string`
Default: ""

Prepends this string to the constant names.

#### options.suffix

Type: `string`
Default: "Data"

Appends this string to the constant names.

## Contributing

Development tasks are available through [npm scripts](https://docs.npmjs.com/cli/run-script):

```shell
npm test                # run tests
npm run lint --silent   # run linting
```

Please add tests and maintain the existing styling when adding and updating the code.

## License

Copyright 2015 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
