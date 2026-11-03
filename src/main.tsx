import React,{useState} from "react";
import{createRoot}from"react-dom/client";
import"./style.css";
type Ring="Adopt"|"Trial"|"Assess"|"Hold";
type Quadrant="Languages & Frameworks"|"Platforms & Infrastructure"|"Data & AI"|"Tools & Techniques";
type Tech={name:string;ring:Ring;quadrant:Quadrant;experience:string;note:string};
const quadrants:Quadrant[]=["Languages & Frameworks","Platforms & Infrastructure","Data & AI","Tools & Techniques"];
const rings:Ring[]=["Adopt","Trial","Assess","Hold"];
const colors:Record<Ring,string>={Adopt:"#3de0b0",Trial:"#83adff",Assess:"#f9c46b",Hold:"#f18da1"};
const raw:[string,Ring,Quadrant,string,string][]=[
["TypeScript","Adopt",quadrants[0],"Current","Typed frontend and backend development."],
["React","Adopt",quadrants[0],"Current","Component-based user interfaces."],
["Java / Spring Boot","Adopt",quadrants[0],"Current","Enterprise applications and services."],
["Python","Adopt",quadrants[0],"Current","Automation, APIs and AI experiments."],
["Angular","Trial",quadrants[0],"Previous","Frontend framework evaluated against project requirements."],
["Kubernetes","Adopt",quadrants[1],"Current","Cloud-native orchestration."],
["Docker","Adopt",quadrants[1],"Current","Containerized application delivery."],
["Argo CD","Adopt",quadrants[1],"Current","Declarative GitOps deployments."],
["Istio","Trial",quadrants[1],"Current","Service mesh with explicit operational trade-offs."],
["Azure / AKS","Adopt",quadrants[1],"Current","Managed Kubernetes infrastructure."],
["PostgreSQL","Adopt",quadrants[2],"Current","Relational persistence and SQL."],
["MongoDB","Trial",quadrants[2],"Current","Document databases for suitable access patterns."],
["Redis","Adopt",quadrants[2],"Current","Caching and asynchronous processing."],
["Local LLMs","Trial",quadrants[2],"Exploring","Inference and agent experiments on local hardware."],
["RAG","Assess",quadrants[2],"Exploring","Evaluating retrieval-augmented systems."],
["GitOps","Adopt",quadrants[3],"Current","Versioned infrastructure and deployments."],
["Keycloak","Adopt",quadrants[3],"Current","Identity and access management."],
["OpenFGA","Trial",quadrants[3],"Current","Fine-grained relationship-based authorization."],
["OPA","Trial",quadrants[3],"Current","Policy-as-code."],
["CI/CD","Adopt",quadrants[3],"Current","Automated testing, builds and delivery."]
];
const data:Tech[]=raw.map(([name,ring,quadrant,experience,note])=>({name,ring,quadrant,experience,note}));
function App(){
const[query,setQuery]=useState("");const[ring,setRing]=useState<Ring|"All">("All");const[selected,setSelected]=useState<Tech|null>(null);
const visible=data.filter(t=>(ring==="All"||t.ring===ring)&&[t.name,t.quadrant,t.note].join(" ").toLowerCase().includes(query.toLowerCase()));
return <main><header><p className="eyebrow">FLAVIANO CARDONE / ENGINEERING NOTES</p><h1>Personal <em>Technology Radar.</em></h1><p className="subtitle">A living map of technologies I use, evaluate and explore — and the trade-offs behind my choices.</p><a href="https://github.com/fcardone75/personal-tech-radar">Explore source on GitHub ↗</a><span className="edition">EDITION 01 · NOVEMBER 2026</span></header>
<section className="toolbar"><input aria-label="Search" placeholder="Search technologies…" value={query} onChange={e=>setQuery(e.target.value)}/><div>{(["All",...rings] as const).map(r=><button key={r} className={ring===r?"active":""} onClick={()=>setRing(r)}>{r}</button>)}</div></section>
<section className="columns"><div className="radar"><div className="chart"><div className="circle c1"/><div className="circle c2"/><div className="circle c3"/><div className="circle c4"/><div className="line horizontal"/><div className="line vertical"/>{visible.map(t=>{const q=quadrants.indexOf(t.quadrant),r=rings.indexOf(t.ring),group=data.filter(x=>x.quadrant===t.quadrant&&x.ring===t.ring),i=group.indexOf(t);const a=(q*90+16+(i*41)%58)*Math.PI/180;const radius=[13,25,37,46][r];return <button key={t.name} className="point" title={t.name} aria-label={t.name} onClick={()=>setSelected(t)} style={{left:`${50+radius*Math.cos(a)}%`,top:`${50-radius*Math.sin(a)}%`,background:colors[t.ring]}}/>})}</div></div>
<aside><h2>Explore the radar</h2><p>Ring placement expresses a current technology recommendation, not a proficiency score.</p><div className="legend">{rings.map(r=><div key={r}><i style={{background:colors[r]}}/><b>{r}</b><span>{({Adopt:"Use with confidence",Trial:"Experiment in practice",Assess:"Worth investigating",Hold:"Use with caution"} as Record<Ring,string>)[r]}</span></div>)}</div><h3>{visible.length} TECHNOLOGIES</h3><div className="list">{visible.map(t=><button key={t.name} onClick={()=>setSelected(t)}><i style={{background:colors[t.ring]}}/>{t.name}<span>↗</span></button>)}</div></aside></section>
<footer><b>Engineering is about trade-offs.</b><p>This radar is a personal, evolving perspective — not a universal ranking. Initial classifications are provisional and will be reviewed.</p></footer>
{selected&&<div className="backdrop" onClick={()=>setSelected(null)}><div className="modal" role="dialog" aria-modal="true" aria-label={selected.name} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><small>{selected.quadrant}</small><h2>{selected.name}</h2><div className="badges"><span style={{color:colors[selected.ring]}}>{selected.ring}</span><span>{selected.experience}</span></div><p>{selected.note}</p><small>Draft classification — subject to review.</small></div></div>}</main>}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
