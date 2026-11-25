import { profile, tools } from "./content.js";
import { Action } from "./layout.js";
import { HomeProjects } from "./work.js";

export function Home() {
  return (
    <>
      <section
        className="portfolio-hero shell"
        aria-labelledby="portfolio-title"
      >
        <h1 className="sr-only" id="portfolio-title">
          {profile.name} — {profile.role}
        </h1>
        <div
          className="name-stage"
          tabIndex={0}
          aria-label="Name animation. Focus here to pause."
        >
          <div className="name-marquee" aria-hidden="true">
            <span>Nicole Licyane — Nicole Licyane —&nbsp;</span>
            <span>Nicole Licyane — Nicole Licyane —&nbsp;</span>
          </div>
          <img
            className={`name-portrait${profile.portrait ? "" : " name-illustration"}`}
            src={profile.portrait || "/portrait.webp"}
            width={758}
            height={820}
            alt={
              profile.portrait
                ? "Nicole Licyane"
                : "Illustrated portrait of Nicole Licyane"
            }
            fetchPriority="high"
          />
        </div>
        <div className="hero-summary">
          <ul aria-label="Specialties">
            <li>Product Design</li>
            <li>Web Design</li>
            <li>Creative Development</li>
          </ul>
          <p>
            I’m Nicole Licyane, a Brazilian designer and developer working
            across digital products, websites and creative technology.
          </p>
        </div>
      </section>
      <HomeProjects />
      <section
        className="home-profile shell"
        aria-labelledby="home-profile-title"
      >
        <p id="skill-instructions" className="sr-only">
          Drag a skill to move it, or use the left and right arrow keys. Press
          Escape to reset its position.
        </p>
        <ul
          className="home-skills"
          data-skill-motion
          aria-label="Design and development skills"
        >
          {[
            "UI/UX Design",
            "Product Design",
            "Design Systems",
            "Brand Identity",
            "Framer Development",
            "Creative Development",
            "Prototyping",
            "Responsive Design",
          ].map((skill) => (
            <li key={skill} tabIndex={0} aria-describedby="skill-instructions">
              {skill}
            </li>
          ))}
        </ul>
        <div className="home-profile-grid">
          <div>
            <h2 id="home-profile-title">Who I am</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              sed enim vitae nulla porttitor dignissim. I build ideas through
              curiosity, careful observation and a little experimentation.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              euismod, color and code are part of how I explore new ways to make
              digital experiences feel thoughtful and alive.
            </p>
          </div>
          <dl>
            <div>
              <dt>3</dt>
              <dd>Years of experience</dd>
            </div>
            <div>
              <dt>30+</dt>
              <dd>Projects delivered</dd>
            </div>
            <div>
              <dt>15+</dt>
              <dd>Clients served</dd>
            </div>
          </dl>
        </div>
        <Action href="/about" secondary>
          More about me
        </Action>
      </section>
    </>
  );
}

export function About() {
  const experience = [
    {
      period: "High school",
      role: "Systems Development",
      place: "Technical program",
      summary:
        "At 14, I began studying systems development. Building school projects introduced me to UI/UX and made Figma part of how I thought through an interface.",
    },
    {
      period: "Early projects",
      role: "Prototyping & hackathons",
      place: "Innovation competitions",
      summary:
        "At 15, I won first place in an innovation competition with an app prototype. I later became a South American finalist in the Uber Hackathon.",
    },
    {
      period: "From December 2023",
      role: "App Development Intern",
      place: "Intelbras",
      summary:
        "I worked on the app development team and deepened my front-end skills with Next.js. I was later admitted to Computer Science at UDESC with the top ranking.",
    },
    {
      period: "Independent work",
      role: "Co-founder & Designer",
      place: "Digital agency",
      summary:
        "Freelancing grew into an agency I co-founded. I led two designers and one developer and stayed hands-on in design and implementation for international clients.",
    },
  ];

  return (
    <>
      <section className="shell about-overview" aria-labelledby="about-title">
        <div className="about-intro">
          <h1 id="about-title">About me</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. I’m Nicole
            Licyane, a Brazilian designer and creative developer drawn to the
            space where digital craft meets new ideas.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. A good
            question, a sketch and a working prototype are often where my
            favorite projects begin.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Outside
            the screen, I’m always collecting references, exploring visual
            culture and finding unexpected connections.
          </p>
          {profile.resume ? (
            <a className="action" href={profile.resume} download>
              Download résumé <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <Action href="/work">See my work</Action>
          )}
        </div>
        <figure className="about-portrait">
          <img
            src={profile.portrait || "/portrait.webp"}
            width={758}
            height={820}
            className={profile.portrait ? undefined : "about-illustration"}
            alt={
              profile.portrait
                ? "Portrait of Nicole Licyane"
                : "Illustration of Nicole from her previous portfolio"
            }
          />
        </figure>
        <dl className="about-facts" aria-label="Experience at a glance">
          <div>
            <dt>3</dt>
            <dd>Years of professional experience</dd>
          </div>
          <div>
            <dt>30+</dt>
            <dd>Projects delivered</dd>
          </div>
          <div>
            <dt>15+</dt>
            <dd>Clients served</dd>
          </div>
        </dl>
      </section>
      <section
        className="shell about-experience"
        aria-labelledby="experience-title"
      >
        <h2 id="experience-title">
          My experience{" "}
          <img
            className="editorial-star"
            src="/star.svg?v=2"
            width={26}
            height={26}
            alt=""
          />
        </h2>
        <div className="about-experience-grid">
          {experience.map((item) => (
            <article key={item.role}>
              <p className="about-period">{item.period}</p>
              <div className="about-experience-role">
                <h3>{item.role}</h3>
                <span>{item.place}</span>
              </div>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell toolkit">
        <h2>Tools &amp; skills</h2>
        <ul>
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
