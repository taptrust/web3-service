# web3-service

A Node JS microservice primarily used for relaying Ethereum transactions.

## Getting Started

Refer to Google Cloud documentation:

- [gcloud CLI tool](https://cloud.google.com/sdk/gcloud/)
- [Node JS GAE Microservices](https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart)

## Local Development

Run `npm start` or `nodemon app.js` and the server should be available at `localhost:8080`.

## Deploying

Run `cloud app deploy node/node-app.yaml`. Make sure you have run `gcloud auth login` and logged into an account that has permissions on Google Cloud to deploy the service.
