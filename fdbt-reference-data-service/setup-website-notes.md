

## Install Typescript
npm install -g typescript

# config tsconfig.json
tsc --init

# Update the tsconfig.ts to look like the following
```
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "lib": [ "es6", "dom" ],
    "moduleResolution": "node",
    "rootDir": "./",
    "sourceMap": true,
    "allowJs": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "preserveConstEnums": true,
    "suppressImplicitAnyIndexErrors": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": [ "node_modules", "build", "webpack" ],
  "types": [ "typePatches" ]
}
```