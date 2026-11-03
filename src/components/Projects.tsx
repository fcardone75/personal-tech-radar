import { useState } from 'react';
import { projects } from '../data';
import { ringIndex, type Project } from '../data/model';
import type { PlacedBlip } from '../radar/layout';

const VISIBLE_CHIPS = 10;

interface CardProps {
  project: Project;
  entries: PlacedBlip[];
  onSelect: (id: string) => void;
}

function ProjectCard({ project, entries, onSelect }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, VISIBLE_CHIPS);
  const listId = `project-${project.id}-entries`;

  return (
    <article id={`project-${project.id}`} className="project-card" aria-labelledby={`project-${project.id}-title`}>
      <header className="project-head">
        <h3 id={`project-${project.id}-title`}>{project.title}</h3>
        {project.years && <span className="project-years">{project.years}</span>}
      </header>
      <p className="project-description">{project.description}</p>
      <p className="project-count">
        {entries.length} radar {entries.length === 1 ? 'entry' : 'entries'}
      </p>
      <ul className="chip-list" id={listId}>
        {visible.map(({ entry, number }) => (
          <li key={entry.id}>
            <button type="button" className="chip" onClick={() => onSelect(entry.id)}>
              <span className={`chip-num ring-bg-${entry.ring}`}>{number}</span>
              {entry.name}
            </button>
          </li>
        ))}
      </ul>
      {entries.length > VISIBLE_CHIPS && (
        <button
          type="button"
          className="link-button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show fewer' : `Show all ${entries.length}`}
        </button>
      )}
    </article>
  );
}

export default function Projects({ blips, onSelect }: { blips: PlacedBlip[]; onSelect: (id: string) => void }) {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">03 / Evidence</p>
          <h2 id="projects-title">
            Projects behind the radar<span className="accent">.</span>
          </h2>
          <p className="section-lead">Every ring comes from real work. These are the projects, and what each one put on the radar.</p>
        </header>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              entries={blips
                .filter((b) => b.entry.usedIn.includes(project.id))
                .sort((a, b) => ringIndex(a.entry.ring) - ringIndex(b.entry.ring) || a.number - b.number)}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
