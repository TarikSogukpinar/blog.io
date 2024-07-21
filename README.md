
![Logo](https://i.ibb.co/cwrJ1Xw/spen-1.png)

    
# Blog.io Open Source Medium Alternative


**Client:** Next.js, Tailwind CSS

**Server:** Nest.js, TypeScript

  
# Demo

https://blog.tariksogukpinar.dev

  
# Installation

Clone Project

```bash
git clone https://github.com/TarikSogukpinar/blog.io
```

go project folder /api & or /web

```bash
  cd api & web
```

generate prisma schema

```bash
  npx prisma migrate:dev
```


install packages using pnpm 

```bash
  pnpm install
```

run development or production

```bash
  pnpm run dev & pnpm run start:prod & pnpm run staging
```

  

  
# Enviroment variables

- NODE_ENV=development or production or staging
- DATABASE_URL= your_database_url
- API_PORT = 5000
- JWT_SECRET = secret
- JWT_EXPIRES_IN = 1d
- JWT_REFRESH_SECRET = secret
- JWT_REFRESH_EXPIRES_IN = 7d
- GOOGLE_CLIENT_ID= your_google_client_id
- GOOGLE_CLIENT_SECRET= your_google_secret_client_id
- GITHUB_CLIENT_ID= your_github_client_id
- GITHUB_CLIENT_SECRET= your_github_client_secret
- API_GLOBAL_PREFIX = /api

  
