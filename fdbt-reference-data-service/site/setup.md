# site

## install nvm
touch ~/.bash_profile
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

## install node v13
`nvm install v13.3.0`

## install some dependancies
`npm install next react react-dom @types/node`

## Add to package json
```
  "scripts": {
    "dev": "next -p 5555",
    "build": "next build",
    "start": "NODE_ENV=production next start",
    "deploy": "STAGE=dev sls deploy"
  },
```
## install some dependancies

`npm install @types/next`
`npm install --save-dev @types/node @types/react typescript`


## update ./tsconfig.json
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "exclude": [
    "node_modules"
  ],
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ]
}
```


## install serverless-nextjs-plugin
`npm install serverless-nextjs-plugin`

delete handler.ts

delete data.csv

npm install uuid @types/uuid axios @types/axios
next-compose-plugins @zeit/next-sass @zeit/next-css next-images


  # How to deploy to REAL AWS
`export NODE_ENV='test' && export SLS_DEBUG='*' && serverless deploy --aws-profile tfn-test -v --stage test`

`export NODE_ENV='test' && export SLS_DEBUG='*' && serverless remove --aws-profile tfn-test -v --stage test`


# How to update the snapshot test
To update the snapshot please run the following
`npm test -- -u`


# Common issues

## npm run dev or npm run delpoy does not work.
If it fails with this message
```Failed to compile.

./design/Pages.scss
Error: Missing binding /Users/adeolu/git/fares-data-build-tool/site/node_modules/node-sass/vendor/darwin-x64-79/binding.node
Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 13.x

Found bindings for the following environments:
  - OS X 64-bit with Node.js 8.x

This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass` to download the binding for your current environment.
```
Run `npm rebuild node-sass`

## if a serverless deploy keeps failing
If it fails with this
```
    ServerlessError: Stack 'fdbt-test' does not exist
      at /Users/adeolu/.nvm/versions/node/v13.3.0/lib/node_modules/serverless/lib/plugins/aws/provider/awsProvider.js:326:27
      at processTicksAndRejections (internal/process/task_queues.js:97:5)
```

Go into AWS S3 and delete:
-  the cloudformation stack in eu-west-1/London
-  the API gateway stack in eu-west-1/London
-  the s3 buckets espically rhe statiuc asset bucket in eu-west-1/London