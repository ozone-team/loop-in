
![Logo](https://cdn.ozoneteam.net/loop-in-logo.svg)




# Loop In

![Docker Pulls](https://img.shields.io/docker/pulls/ozoneteam/loop-in)

An easy to use system to centralise product feedback and update stakeholders on project progress.

## Docs

Official documentation coming soon :)

## Features

- Light and dark mode
- Anonymous feedback
- Use authentication with email magic links (SMTP required)
- Cross-platform
- Customisable boards, statuses and tags
- Announcement system
- Email notifications

## Tech Stack

**Client:**
- [NextJS](https://nextjs.org) - Core Framework
- [TailwindCSS](https://tailwindcss.com) - Styling
- [NextUI](https://nextui.org) - UI Components
- [Tabler Icons](https://tablericons.com) - Icon Library
- [Tanstack Query](https://tanstack.com/query) - Client request management

**Server:**
- [Postgres](https://www.postgresql.org/) - Database
- [NextAuth](https://next-auth.js.org/) - Authentication
- [Prisma ORM](https://prisma.io) - Database ORM Client



## Deployment


### Docker (Official)

1. Make sure you have [Docker](https://docker.com) installed
2. To easily deploy using Docker Compose, copy the docker-compose.yml file is found in the 'deployment' folder.

```yml
# docker-compose.yml

services:
  database:
    container_name: feedback-portal-db
    image: postgres:latest
    environment:
      POSTGRES_DB: feedback-portal
      POSTGRES_USER: postgres_user
      POSTGRES_PASSWORD: mysupersecretpassword
    healthcheck:
      test: [ "CMD-SHELL", "sh -c", "pg_isready -d ${POSTGRES_DB} -U ${POSTGRES_USER}" ]
      interval: 5s
      timeout: 60s
      retries: 5
      start_period: 80s
    volumes:
      - data:/var/lib/postgresql/data

  app:
    container_name: feedback-portal-app
    image: ozoneteam/feedback-portal:latest
    ports:
      - "3000:3000"
    volumes:
      - public:/app/public
    depends_on:
      - database
    environment:
        # Database Connection
        DATABASE_URL: postgres://postgres_user:mysupersecretpassword@database:5432/feedback-portal
        # General Configuration for the App
        APP_URL: http://localhost:3000
        # Email Server connection for Authentication and Notifications
        # REQUIRED for login & email notifications
        EMAIL_SERVER_USER: username
        EMAIL_SERVER_PASSWORD: password
        EMAIL_SERVER_HOST: smtp.server.com
        EMAIL_SERVER_PORT: 587
        EMAIL_SERVER_SECURE: false
        EMAIL_FROM: "My Website <noreply@email.com>"
        # Authentication - Change for Production
        AUTH_SECRET: 66625cd0c24563168e3aa543296ff8bb50db60ebdf6d996278cf2d29d2253211
        # This needs to be the same as APP_URL
        NEXTAUTH_URL: http://localhost:3000
        # Seed data
        ADMIN_EMAIL: 'joe.blogs@mycompany.com'

volumes:
  data:
  public:

```
3. Start the containers using docker compose
```sh
docker compose up -d
```
This will seed the database and start the application. The `ADMIN_EMAIL` environment variable dictates the default admin user that is created on seeding.

4. Access the application at `https://localhost:3000`

## Run Locally

### Requirements

- [NodeJS](https://nodejs.org)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Docker](https://docker.com) - Optional if database is hosted differently


Clone the project

```bash
  git clone https://github.com/ozone-team/loop-in.git
```

Go to the project directory

```bash
  cd loop-in
```

Install dependencies

```bash
  yarn install
```

Copy the example environment file (adjsut the values as needed)
```bash
  cp .env.example .env
```

Start the database (if not running already, adjust the environment variables to correlate to the .env file as needed)
```
  docker compose up -d database
```

Start the server

```bash
  yarn dev
```


## Authors

- [@harrycarp](https://www.github.com/harrycarp)

## 🚧  Roadmap

- Better mobile UI support

- Slack and Discord integration to notify team members

- SSO for team members

