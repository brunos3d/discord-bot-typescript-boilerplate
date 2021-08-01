# discord-bot-typescript-boilerplate

 🤖 NODE.TS - Start your next discord bot project in seconds.

## Installation

#### 1. Clone project

```
$ git clone git@github.com:BrunoS3D/discord-bot-typescript-boilerplate.git your-app-name
$ cd your-app-name
```

#### 2. Install dependencies

```sh
$ yarn install # or just yarn
```


## Run Locally

#### 1. Start in dev mode

```sh
$ yarn dev
```

#### 2. Build and run

```sh
$ yarn deploy
```

or

```sh
$ yarn build && yarn start
```

## Running on Docker

```sh
$ docker build -t discord-bot .
$ docker run -it --rm -e DISCORD_TOKEN="YOUR TOKEN HERE" --name discord-bot discord-bot
```