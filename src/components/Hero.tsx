import { REPO_URL } from '../data';
import { ArrowDown, ArrowUpRight } from './icons';

export default function Hero({ edition }: { edition: string }) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="eyebrow">
          <span className="edition-tag">Edition {edition}</span>
          Personal technology radar
        </p>
        <h1 id="hero-title" className="hero-title">
          <span>Technology is a choice.</span>
          <em>Not a checklist.</em>
        </h1>
        <p className="hero-intro">
          My evolving perspective on the tools, platforms and ideas shaping how I build software. Built on experience,
          curiosity and engineering trade-offs.
        </p>
        <p className="hero-byline">
          <strong>Flaviano Cardone</strong>
          <span>Senior Cloud &amp; AI Solution Architect and Technical Lead</span>
          <span>Chartered engineer, Rome</span>
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#radar">
            Explore the radar
            <ArrowDown />
          </a>
          <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
            View the source
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
