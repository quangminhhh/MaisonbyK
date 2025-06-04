This project uses [Next.js](https://nextjs.org) with TypeScript and TailwindCSS.

## Getting Started

Copy `.env.example` to `.env` and update the values for your environment. Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying files in `src/app`.

## Project Structure

```
prisma/             # Prisma schema and migrations
public/             # Static assets
src/
  app/              # Next.js routes and API endpoints
  components/       # Shared React components
  contexts/         # React context providers
  hooks/            # Custom hooks
  lib/              # Shared libraries (e.g. Prisma client)
  services/         # Business logic
  store/            # Zustand store setup
  styles/           # Global styles
  types/            # TypeScript types
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load the Geist typeface.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
