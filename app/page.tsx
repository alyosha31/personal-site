const posts = [
  {
    date: "Jul 18, 2026",
    title: "The quiet craft of making things that last",
    excerpt:
      "A note on choosing durable ideas over loud ones, and why the best work often starts with paying better attention.",
    tag: "Essays",
    featured: true,
  },
  {
    date: "Jun 30, 2026",
    title: "A field guide to useful side projects",
    excerpt: "Small rules for turning curiosity into something you can actually finish.",
    tag: "Building",
  },
  {
    date: "May 12, 2026",
    title: "Notes from a slower internet",
    excerpt: "What I’m keeping, what I’m leaving, and the tools that help me think clearly.",
    tag: "Notes",
  },
  {
    date: "Apr 04, 2026",
    title: "Learning in public, without performing",
    excerpt: "On sharing unfinished work with generosity, context, and a little less noise.",
    tag: "Essays",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Home">
          /a
        </a>
        <div className="nav-links">
          <a href="#writing">Writing</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-contact" href="mailto:hello@example.com">
          Say hello <span>↗</span>
        </a>
      </nav>

      <section className="hero shell" id="top">
        <p className="eyebrow">Personal notes · ideas · things made</p>
        <h1>
          Making sense of
          <br />
          <em>the messy middle.</em>
        </h1>
        <div className="hero-bottom">
          <p className="intro">
            I&apos;m Alex — a builder and curious person writing about technology,
            creative work, and the small choices that shape a good life.
          </p>
          <a className="scroll-cue" href="#writing">
            <span className="arrow-circle">↓</span> Start reading
          </a>
        </div>
      </section>

      <section className="feature shell" id="writing">
        <div className="section-label"><span>01</span> Featured writing</div>
        <article className="feature-card">
          <div className="feature-art" aria-hidden="true">
            <span className="art-sun" />
            <span className="art-line line-one" />
            <span className="art-line line-two" />
            <span className="art-note">a little<br />further →</span>
          </div>
          <div className="feature-copy">
            <p className="post-meta">{posts[0].date} <span>·</span> {posts[0].tag}</p>
            <h2>{posts[0].title}</h2>
            <p>{posts[0].excerpt}</p>
            <a className="read-link" href="#read">Read the essay <span>↗</span></a>
          </div>
        </article>
      </section>

      <section className="archive shell">
        <div className="archive-head">
          <div className="section-label"><span>02</span> The archive</div>
          <p>A running collection of thoughts, experiments, and observations.</p>
        </div>
        <div className="post-list">
          {posts.slice(1).map((post) => (
            <a className="post-row" href="#read" key={post.title}>
              <p className="post-meta">{post.date}</p>
              <div><h3>{post.title}</h3><p>{post.excerpt}</p></div>
              <span className="post-tag">{post.tag}</span>
              <span className="row-arrow">↗</span>
            </a>
          ))}
        </div>
        <a className="all-posts" href="#writing">Browse all writing <span>→</span></a>
      </section>

      <section className="projects shell" id="projects">
        <div className="section-label"><span>03</span> Things I&apos;m making</div>
        <div className="projects-grid">
          <div><h2>Ideas are better<br /><em>when they ship.</em></h2></div>
          <div className="project-placeholder"><span>Coming soon</span><p>A few experiments and tools<br />will live here soon.</p></div>
        </div>
      </section>

      <section className="about shell" id="about">
        <p className="eyebrow">A bit about me</p>
        <div className="about-grid"><h2>Still figuring it out,<br /><em>one note at a time.</em></h2><p>This is where I keep the things I don&apos;t want to lose: questions, half-formed ideas, and lessons from building on the internet. Thanks for stopping by.</p></div>
      </section>

      <footer className="footer shell"><span>© 2026 Alex</span><span>Made with curiosity + a decent cup of coffee</span><div><a href="#top">Top ↑</a><a href="https://github.com">GitHub ↗</a></div></footer>
    </main>
  );
}
