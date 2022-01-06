# Setup VSCode for Dev

Over the course of the project, VSCode has been the IDE of choice of most of the dev team. As such, the team have built up a solid collection of VSCode plugins and have refined a number of workspace settings to ease the dev process.

## Installing VSCode

To install VSCode, visit this [link](https://code.visualstudio.com/).

## Recommended Settings

To open your `User Settings` or `Workspace Settings`, first hold `⌘ [Command] + ⇧ [Shift] + P` to open the command palette and select the settings you would like to edit.

- User Settings - Settings that apply globally to any instance of VS Code you open.
- Workspace Settings - Settings stored inside your workspace and only apply when the workspace is opened.

- Auto Save - Having auto save enabled allows you to edit your files in VSCode without having to worry about losing your work.
- Format On Save - Enabling this setting allows you to press `⌘ [Command] + S` to format your file with the relevant linter.
- Extensions
  \> XML
  \> Validation: Resolve External Entities - Enabling this setting on the XML extension (see below recommended plugins) allows you to interrogate and automatically validate any NeTEx file created by the NeTEx generator. If the NeTEx file fails validation, the extension will output any useful error messages to help with debugging.

## Sample settings file

This is a sample settings file that includes some settings that are required for VSCode to handle our project correctly. To access and edit your setting file, press \`cmd+shift+P\` and search for `Preferences: Open Settings (JSON)`.

```json
{
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.formatOnSave": true,
  "yaml.customTags": [
    "!And",
    "!And sequence",
    "!If",
    "!If sequence",
    "!Not",
    "!Not sequence",
    "!Equals",
    "!Equals sequence",
    "!Or",
    "!Or sequence",
    "!FindInMap",
    "!FindInMap sequence",
    "!Base64",
    "!Join",
    "!Join sequence",
    "!Cidr",
    "!Ref",
    "!Sub",
    "!Sub sequence",
    "!GetAtt",
    "!GetAZs",
    "!ImportValue",
    "!ImportValue sequence",
    "!Select",
    "!Select sequence",
    "!Split",
    "!Split sequence"
  ],
  "yaml.validate": false,
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "xml.validation.resolveExternalEntities": true,
  "workbench.iconTheme": "material-icon-theme",
  "editor.fontSize": 14,
  "eslint.format.enable": true,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "redhat.telemetry.enabled": false,
  "files.insertFinalNewline": true,
  "eslint.workingDirectories": [".", "cypress_tests"],
  "typescript.tsdk": "repos/fdbt-site/node_modules/typescript/lib"
}
```

## Recommended Plugins

- [CloudFormation Linter](https://marketplace.visualstudio.com/items?itemName=kddejong.vscode-cfn-lint) by kddejong
- [Debugger for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug) by Microsoft
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) by Microsoft
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) by Dirk Baeumer
- [GitLens – Git Supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) by Eric Amodio
- [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) by Microsoft
- [Java Test Runner](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-test) by Microsoft
- [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) by Orta
- [Maven for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-maven) by Microsoft
- [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script) by egamma
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) by Christian Kohler
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by Prettier
- [Project Manager for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-dependency) by Microsoft
- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) by Microsoft
- [Reactjs code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets) by charalampos karypidis
- [Serverless Framework](https://marketplace.visualstudio.com/items?itemName=TimVaneker.serverless-snippets) by Tim Vaneker
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) by Matheus Teixeira
- [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode) by Microsoft
- [XML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml) by Red Hat
- [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) by Red Hat

## Other Useful Plugins

- [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2) by CoenraadS
- [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare), [Live Share Audio](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-audio) and [Live Share Extension Pack](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack) by Microsoft
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) by Philipp Kief
- [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) by mechatroner
