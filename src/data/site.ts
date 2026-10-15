// Edit this file to change the site's content.
export const site = {
  name: "Tomas Jimenez",
  logo: "Tomas Jimenez",
  jobTitle: "Principal Software Engineer",
  description:
    "Tomas Jimenez, Principal Software Engineer: C++, low latency systems, IBM mainframe, compilers and GPU computing.",
  // One-sentence summary shown in the hero.
  summary: "I build C++ low latency systems, IBM mainframe software, compilers and GPU/ML tooling.",
  intro:
    "Principal Software Engineer working on C++ low latency systems, IBM mainframe software, compilers, CUDA and ML. Writing and research on systems, performance and code generation.",
  // Three focus keywords, used on the link preview image.
  focus: ["C++", "Low latency", "Mainframe"],
  social: {
    linkedin: "https://www.linkedin.com/in/tomjnet/",
    github: "https://github.com/tomjnet",
    youtube: "https://www.youtube.com/@tomjnet",
    // Only listed in the JSON-LD profile links, not shown on the page.
    x: "https://x.com/tomjnet",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts/" },
    { label: "Research", href: "/research/" },
    { label: "Hobbies", href: "/hobbies/" },
  ],
  // Big statement band on the home page, linking to one post in the posts repo.
  featured: {
    quote: "Latency doesn't care about your productivity argument.",
    title: "C++ is not dying in quant finance. It's getting more critical.",
    slug: "2026-09-29-cpp-is-not-dying-in-quant-finance",
  },
  // Public GitHub repo that holds posts and research (see website-info/README.md).
  contentRepo: { owner: "tomjnet", repo: "website-info", branch: "main" },
};

/** Prefix an internal path with the configured base (needed on GitHub Pages project sites). */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Link for opening a content repo file (e.g. a research PDF) in the browser. */
export function contentViewUrl(path: string): string {
  if (/^https?:/i.test(path)) return path;
  const { owner, repo, branch } = site.contentRepo;
  return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
}

/** Raw URL of a content repo file, for images referenced by posts. */
export function contentRawUrl(path: string): string {
  const { owner, repo, branch } = site.contentRepo;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
