# My Personal Website

_If you are viewing this on GitHub, please note that this is a copy of what I have locally on Gitea. The reaosn being it is deployed locally on my own infrastructure, hence it's eaiser for me to manage my workflow if I use a local git provider._

---

This is my personal website, built with [Next.js](https://nextjs.org/) and [Payload CMS](https://payloadcms.com/), animated with [Motion](https://motion.dev/) (formerly Framer Motion).

This site is where I share the projects I’ve built and document my journey and experiences through blogs.

## Tech Stack

- **Frontend**: [Next.js (App Router)](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **CMS**: [Payload CMS](https://payloadcms.com/) (w/ built-in [Lexical Editor](https://lexical.dev/))
- **Database**: SQLite3 — chosen for simplicity ([video](https://www.youtube.com/watch?v=ZP7ef4eVnac))
- **Deployment**: Self-hosted with Docker and custom CI/CD runners in my own infrastructure (with [Gitea](https://about.gitea.com/))

## Roadmap

In no particular order:

- [x] Automated deployment with CI/CD
- [ ] Set up proper caching
- [ ] Dark mode
- [ ] Blog/project filters
- [ ] Blog series (useful for keeping track of technical writeups of different topics of the same project)
- [ ] SEO optimization
- [ ] Site search
- [ ] Privacy-friendly analytics ([Umami](https://umami.is/))
- [ ] i18n

### No Longer Planned

- ~~Comments (removed from roadmap due to moderation and maintenance concerns)~~

## Contributing & Attribution

This project is primarily for personal use and is developed in a homelab environment. The copy you see on GitHub mirrors what I have locally.

You’re welcome to fork or deploy it for your own use — I just ask that you include attribution (for example, in the source code and a visible spot on your site such as the footer or About page).

Pull requests and suggestions are welcome! For major changes, open an issue first to discuss your proposal. If you encounter problems (e.g., an issue disappearing), feel free to [email me](mailto:t.guan@alumni.utoronto.ca?subject=Question%20about%20your%20website).

---

_This site originally ran on a custom Flask CMS with JWT authentication. While it was a great learning experience, maintaining a fully custom backend became too heavy. Migrating to Payload CMS has allowed me to focus more on content and new features._
