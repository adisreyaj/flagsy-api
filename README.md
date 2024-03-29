# Flagsy API

This repo hosts the code for the Flagsy API. Flagsy is a simple and user-friendly feature flag management application.
UI is build using Angular, more details here: https://github.com/adisreyaj/flagsy

### Stack
- Fastify JS (https://fastify.dev/)
- TypeScript (https://www.typescriptlang.org/)
- Prisma (https://www.prisma.io/)
- MySQL (https://www.mysql.com/)


### Installation
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file and add the following:
```
NODE_ENV=development

PORT=3000

DATABASE_URL=mysql://root:password@localhost:3306/flagsy

JWT_SECRET=secret
COOKIE_SECRET=secret


# For Grafana Loki
LOKI_URL=https://<instance>.grafana.net
LOKI_USERNAME=<username>
LOKI_TOKEN=<token>

```
4. Ready the database
```sh
prisma:migrate:dev
```
5. Start the application
```sh
npm run dev
```

## Features
- Cors support
- Authentication (Cookie based)
- Authorization
- RBAC with roles and permissions
- Zod for schema validation
- Grafana Loki for logging

## Routes
- `/auth` - Authentication routes
- `/users` - User routes
- `/projects` - Project routes
- `/environments` - Environment routes
- `/features` - Feature routes
- `/changelog` - Changelog routes

### Structure
- `/routes` - Contains all the routes
- `/handlers` - Contains the route handlers

## Roadmap

See the [open issues](https://github.com/adisreyaj/flagsy-api/issues) for a list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Show your support

Please ⭐️ this repository if this project helped you!
