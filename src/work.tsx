import {
  categories,
  projects,
  type CaseModule,
  type Project,
} from "./content.js";
import { Action, Intro } from "./layout.js";

const number = (project: Project) =>
  String(projects.indexOf(project) + 1).padStart(2, "0");
function Cover({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className={`cover cover-${project.slug}`}>
      <span className="cover-form" aria-hidden="true" />
      <span className="cover-name" aria-hidden="true">
        {project.name}
      </span>
      {project.image && (
        <img
          data-project-image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
}

function ProjectTile({
  project,
  heading: Heading = "h3",
}: {
  project: Project;
  heading?: "h2" | "h3";
}) {
  return (
    <li data-categories={project.categories.join("|")}>
      <a
        className="home-project"
        data-project-card
        href={`/work/${project.slug}`}
      >
        <Cover project={project} />
        <div className="home-project-caption">
          <div>
            <Heading className="project-tile-title">{project.name}</Heading>
            <p>
              {project.role ||
                project.draft?.role ||
                project.categories.join(" · ")}
            </p>
          </div>
          <span className="home-project-cta">
            View project <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </li>
  );
}

export function HomeProjects() {
  const selected = [
    "joby",
    "ghostly-studio",
    "ec-data",
    "bilge-insaat",
  ].flatMap((slug) => projects.filter((project) => project.slug === slug));
  return (
    <section
      className="shell home-projects home-directory"
      id="selected"
      data-home-directory
      aria-labelledby="selected-title"
    >
      <div className="directory-stage" data-directory-stage>
        <div className="home-projects-heading">
          <h2 id="selected-title">
            Diretório <sup className="selected-period">2024–26</sup>
          </h2>
          <Action href="/work">See all works</Action>
        </div>
        <ul
          className="directory-track"
          data-directory-track
          tabIndex={0}
          aria-label="Project previews"
        >
          {selected.map((project) => (
            <ProjectTile key={project.slug} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Work() {
  const filters = categories.filter(
    (category) =>
      category === "All Work" ||
      projects.some((project) => project.categories.includes(category)),
  );

  return (
    <section
      className="shell work projects-page"
      aria-labelledby="projects-heading"
      data-work
    >
      <div className="projects-top">
        <div>
          <h1 id="projects-heading" className="sr-only">
            Projects
          </h1>
          <p>
            A selection of digital products, websites and visual identities I’ve
            helped bring to life.
          </p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((category) => (
            <button
              key={category}
              type="button"
              data-filter={category}
              aria-pressed={category === "All Work"}
            >
              {category === "All Work" ? "All" : category}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" data-work-count>
        {projects.length} projects
      </p>
      <ul className="home-project-grid" data-work-panel="gallery">
        {projects.map((project) => (
          <ProjectTile key={project.slug} project={project} heading="h2" />
        ))}
      </ul>
      <div className="project-index" data-work-panel="index" hidden>
        {projects.map((project) => (
          <a
            key={project.slug}
            data-categories={project.categories.join("|")}
            href={`/work/${project.slug}`}
          >
            <span className="meta">{number(project)}</span>
            <strong>{project.name}</strong>
            <span>
              {project.role || project.draft?.role || project.summary}
            </span>
            <span className="meta">
              {project.year ?? project.draft?.year ?? "—"}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <div data-empty hidden className="empty">
        <p>No projects in this category yet.</p>
      </div>
      <div
        className="views projects-views"
        role="group"
        aria-label="Project view"
      >
        <button type="button" data-view="gallery" aria-pressed="true">
          Gallery
        </button>
        <button type="button" data-view="index" aria-pressed="false">
          Index
        </button>
      </div>
    </section>
  );
}

function Module({ module }: { module: CaseModule }) {
  switch (module.kind) {
    case "image":
      return (
        <figure className="case-media">
          <img
            src={module.src}
            alt={module.alt}
            width={module.width}
            height={module.height}
            loading="lazy"
            decoding="async"
          />
          {module.caption && <figcaption>{module.caption}</figcaption>}
        </figure>
      );
    case "text":
      return (
        <section className="case-module">
          <h2>{module.title}</h2>
          <p>{module.body}</p>
        </section>
      );
    case "facts":
      return (
        <section className="case-module">
          <h2>{module.title}</h2>
          <dl>
            {module.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
  }
}

export function Case({ project }: { project: Project }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length]!;
  const role = project.role || project.draft?.role;
  const year = project.year ?? project.draft?.year;
  const details = [
    ["Context & challenge", project.draft?.context],
    ["Technical approach", project.draft?.approach],
    ["Design process", project.draft?.process],
    ["Learnings & outcomes", project.draft?.outcomes],
    ["Technologies", project.draft?.technologies?.join(", ")],
  ];
  return (
    <>
      <Intro label={`Work / ${number(project)}`} description={project.summary}>
        {project.name}
        <em>.</em>
      </Intro>
      <div
        className={`shell case ${project.categories.includes("Product Design") ? "case-product" : project.categories.includes("Branding") ? "case-brand" : "case-digital"}`}
      >
        <div className="case-meta">
          <a href="/work">← All work</a>
          <span className="meta">{project.categories.join(" / ")}</span>
          {year && <span className="meta">{year}</span>}
        </div>
        <Cover project={project} priority />
        {role && (
          <Module
            module={{ kind: "text", title: "My contribution", body: role }}
          />
        )}
        {project.modules.map((module, i) => (
          <Module key={i} module={module} />
        ))}
        {details.map(
          ([title, body]) =>
            title &&
            body && (
              <Module key={title} module={{ kind: "text", title, body }} />
            ),
        )}
        {project.url && (
          <div className="case-live">
            <Action href={project.url}>
              {project.url.startsWith("/")
                ? "Try the experiment"
                : "Visit live project"}
            </Action>
          </div>
        )}
        <a href={`/work/${next.slug}`} className="next-project">
          <span className="meta">Next project / {number(next)}</span>
          <strong>
            {next.name} <span aria-hidden="true">↗</span>
          </strong>
        </a>
      </div>
    </>
  );
}
