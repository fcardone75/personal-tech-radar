import { useState } from 'react';
import { projects } from '../data';
import { ringIndex, type Project } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import type { PlacedBlip } from '../radar/layout';

const VISIBLE_CHIPS = 10;

interface CardProps {
  project: Project;
  entries: PlacedBlip[];
  onSelect: (id: string) => void;
}

function ProjectCard({ project, entries, onSelect }: CardProps) {
  const { t } = useLocale();
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
        {t.projects.count(entries.length)}
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
          {expanded ? t.projects.fewer : t.projects.all(entries.length)}
        </button>
      )}
    </article>
  );
}

export default function Projects({ blips, onSelect }: { blips: PlacedBlip[]; onSelect: (id: string) => void }) {
  const { t, project: localizeProject } = useLocale();
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">{t.projects.index}</p>
          <h2 id="projects-title">
            {t.projects.title}<span className="accent">.</span>
          </h2>
          <p className="section-lead">{t.projects.lead}</p>
        </header>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={localizeProject(project)}
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
