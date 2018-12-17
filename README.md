# web3-service

A Node JS microservice primarily used for relaying Ethereum transactions.

## Getting Started

Refer to Google Cloud documentation:

- [gcloud CLI tool](https://cloud.google.com/sdk/gcloud/)
- [Node JS GAE Microservices](https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart)

## Local Development

Run `yarn install` to install dependencies, and `npm run dev` to start the development server. The server should be available at `localhost:8080`.

Because Babel is used, source code is edited in the `src` folder and compiled to code in the `dist` folder.

## Deploying

Run `gcloud app deploy node/node-app.yaml`. Make sure you have run `gcloud auth login` and logged into an account that has permissions on Google Cloud to deploy the service.

To see logs as request are sent, you can tail the logs with gcloud: `gcloud app logs tail -s web3`
