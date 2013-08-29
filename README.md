
Embed HTML assets (js/css) in the document

## Getting Started
Install the module with: `npm install node-assets-embed`

```javascript
var embed = require('node-assets-embed');
embed.embedFile('path/to/file.html', function (err, html) {});
```

Also exist in sync:

```javascript
var embed = require('node-assets-embed');
embed.embedFileSync('path/to/file.html');
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2013 Loïc Mahieu. Licensed under the MIT license.
