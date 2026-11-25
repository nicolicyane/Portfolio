export const profile = {
  name: "Nicole Licyane",
  role: "Designer & Creative Developer",
  location: "Brazil",
  timeZone: "America/Sao_Paulo",
  handle: "@nicostack_",
  email: process.env.PUBLIC_CONTACT_EMAIL || "nicolelicyanne0@gmail.com",
  linkedIn:
    process.env.PUBLIC_LINKEDIN_URL ||
    "https://www.linkedin.com/in/nicole-licyane-633471221/",
  instagram: process.env.PUBLIC_INSTAGRAM_URL || "",
  github: process.env.PUBLIC_GITHUB_URL || "",
  resume: process.env.PUBLIC_RESUME_URL || "",
  portrait: process.env.PUBLIC_PORTRAIT_URL || "",
  origin:
    process.env.SITE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`,
};

export const categories = [
  "All Work",
  "Product Design",
  "Web Design",
  "Development",
  "Branding",
  "Experiments",
] as const;
type Category = Exclude<(typeof categories)[number], "All Work">;
export type CaseModule =
  | { kind: "text"; title: string; body: string }
  | {
      kind: "image";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
    }
  | { kind: "facts"; title: string; items: { label: string; value: string }[] };

export type Project = {
  slug: string;
  name: string;
  categories: Category[];
  role?: string;
  summary: string;
  year?: number;
  url?: string;
  image?: { src: string; alt: string; width: number; height: number };
  modules: CaseModule[];
  draft?: {
    year?: number;
    context?: string;
    role?: string;
    approach?: string;
    process?: string;
    outcomes?: string;
    technologies?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "joby",
    name: "Joby",
    categories: ["Development"],
    role: "Web Development",
    summary:
      "Web development for the Tinywins × Joby Aviation digital case study.",
    url: "https://joby.tinywins.com/",
    image: {
      src: "/projects/joby.webp",
      alt: "The Tinywins × Joby case study homepage over a frame from its hero reel",
      width: 1100,
      height: 690,
    },
    modules: [
      {
        kind: "text",
        title: "Project context",
        body: "Tinywins’ published case study brings together the Joby Aviation brand system, photography, illustration, 3D and website.",
      },
    ],
    draft: {},
  },
  {
    slug: "ghostly-studio",
    name: "Ghostly Studio",
    categories: ["Web Design", "Development"],
    role: "Web Design & Development",
    summary: "A Framer site for an independent content and advertising studio.",
    url: "https://ghostlystudio.framer.website/",
    image: {
      src: "/projects/ghostly-studio.webp",
      alt: "Ghostly’s homepage with white type and a blue call to action",
      width: 1100,
      height: 690,
    },
    modules: [
      {
        kind: "facts",
        title: "Tools",
        items: [
          { label: "Design", value: "Figma" },
          { label: "Build", value: "Framer" },
          { label: "Motion", value: "Lottie" },
        ],
      },
    ],
    draft: {},
  },
  {
    slug: "orchid-beauty",
    name: "Orchid Beauty",
    categories: ["Web Design", "Development"],
    role: "Web Design & Development",
    summary: "A Framer website template for an aesthetics practice.",
    url: "https://orchidbeauty.framer.website/",
    image: {
      src: "/projects/orchid-beauty.webp",
      alt: "Orchid’s blush-colored homepage with large serif type",
      width: 1100,
      height: 690,
    },
    modules: [
      {
        kind: "text",
        title: "The website",
        body: "The live template presents treatments, common questions and editorial content for an aesthetics practice.",
      },
    ],
    draft: {},
  },
  {
    slug: "bilge-insaat",
    name: "Bilge İnşaat",
    categories: ["Branding", "Web Design", "Development"],
    role: "Visual Identity, Web Design & Development",
    summary:
      "A visual identity and website for a Turkish architecture and construction company.",
    url: "https://www.bilgeinsaat.com/",
    image: {
      src: "/projects/bilge-insaat.webp",
      alt: "Bilge İnşaat’s homepage featuring one of its residential developments",
      width: 1100,
      height: 690,
    },
    modules: [
      {
        kind: "text",
        title: "Digital experience",
        body: "The live site presents Bilge İnşaat’s residential, education and commercial developments in İstanbul and Kocaeli.",
      },
    ],
    draft: {},
  },
  {
    slug: "inscend-ai",
    name: "Inscend AI",
    categories: ["Development"],
    role: "Framer Development, Website Rebuild & Implementation",
    summary: "Website rebuild and implementation in Framer.",
    modules: [
      {
        kind: "facts",
        title: "Implementation",
        items: [{ label: "Platform", value: "Framer" }],
      },
    ],
    draft: {},
  },
  {
    slug: "veloz",
    name: "Veloz",
    categories: ["Product Design"],
    summary: "Product design project.",
    modules: [],
    draft: {},
  },
  {
    slug: "mygoo",
    name: "MyGoo",
    categories: ["Product Design"],
    summary: "Product design for an MVP.",
    modules: [],
    draft: {},
  },
  {
    slug: "ec-data",
    name: "EC Data",
    categories: ["Product Design"],
    summary: "Product design project.",
    url: "https://www.ecdata.com.br/",
    image: {
      src: "/projects/ec-data.webp",
      alt: "Still from the EC Data project preview in Nicole’s original portfolio",
      width: 1100,
      height: 678,
    },
    modules: [],
    draft: {},
  },
];

export const tools = [
  "Figma",
  "Framer",
  "React",
  "Next.js",
  "TypeScript",
  "AI-assisted development",
  "Prototyping",
  "Design Systems",
  "Responsive Design",
];
