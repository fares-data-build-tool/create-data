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
`export SLS_DEBUG='*' && serverless deploy --aws-profile tfn-test -v --stage test`

`export SLS_DEBUG='*' && serverless remove --aws-profile tfn-test -v --stage test`