const PRINCIPLES = [
  {
    title: 'Context first.',
    text: 'No technology is universally right. Requirements, team maturity and operational cost matter.',
  },
  {
    title: 'Build to learn.',
    text: 'I keep coding and experimenting because hands-on feedback sharpens architectural decisions.',
  },
  {
    title: 'Revisit decisions.',
    text: 'Good choices evolve. This radar records a point of view, not an immutable verdict.',
  },
];

export default function Principles() {
  return (
    <section id="principles" className="section principles" aria-labelledby="principles-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">04 / How I think</p>
          <h2 id="principles-title">
            Principles over hype<span className="accent">.</span>
          </h2>
        </header>
        <ol className="principles-grid">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title} className="principle">
              <span className="principle-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
