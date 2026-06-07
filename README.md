This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Architecture

User Input
    ↓
Foundry IQ Layer
    ↓
Knowledge Retrieval
    ↓
Prompt Enrichment
    ↓
Gemini
    ↓
Game Design Document

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Assisted Development

GitHub Copilot was used as an AI-assisted development partner during this project to help generate code snippets, suggest refactors, and support TypeScript fixes and UI improvements. The developer retained full control over architecture, feature selection, testing, and final integration.

- Copilot helped generate React and Next.js code for UI components, API routes, and helper utilities.
- It assisted with refactoring by suggesting clearer component structure, reusable hooks, and better state handling.
- Copilot contributed TypeScript guidance for request validation, AI response parsing, and typed component props.
- It helped implement PDF export support and refine the `Generate Cover Art` flow with loading and error states.
- Copilot provided debugging and cleanup suggestions while the developer verified the final behavior.

> All architectural decisions, feature selection, testing, and final integration were performed by the developer.
