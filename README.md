# whizart-bot

## Installation

```bash
git clone git@github.com:BrunoS3D/whizart-bot
cd whizart-bot
```

Create environment variable files `.env` and `.env.dev` based on [.env.example](./.env.example) on project root folder

## Running on production environment

### With Docker

```bash
docker compose up -d
```

Or to stop running containers and rebuild cached images

```bash
docker compose up --build -d
```

To see output logs use (<kbd>Ctrl</kbd> + <kbd>C</kbd> to stop watching logs)

```bash
docker compose logs -f
```

### Without Docker

#### Automated

Start database container with docker

```bash
yarn docker:db
```

Build and start bot client

```bash
yarn deploy
```

#### Manual

Install dependencies

```bash
yarn install # or just yarn
```

Build output

```bash
yarn build
```

Running app

```bash
yarn start
```

## Running on development environment

Install dependencies

```bash
yarn install # or just yarn
```

Then run mongodb

```bash
yarn docker:dev:db
```

After doing this run project with following command

```bash
yarn dev
```
