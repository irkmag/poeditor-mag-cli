# poeditor-mag-cli
Command line tool for auto managing translations.

Usage.

At project root should be defined configuration file for example with name `.translations-config`
Inside this file need to set parameters:

```
  ...
  "poeditor":{
    "apiToken": "YOUR_POEDITOR_API_TOKEN",
    "projectId": "YOUR_POEDITOR_PROJECT_ID",
    "exportPath": "./src/locales/" // should be writable path for put translated json files
  },
  "output": "./src/locales/template.pot", // path for pot file with strings for import into poeditor, see gettext-extract for details
  ...
```

Related project is `gettext-extract` - https://www.npmjs.com/package/gettext-extract this can be used for collect strings into `pot`-file.

### Command line examples:

```
node index.js upload -c ./.translations-config.json
node index.js download -c ./.translations-config.json
```