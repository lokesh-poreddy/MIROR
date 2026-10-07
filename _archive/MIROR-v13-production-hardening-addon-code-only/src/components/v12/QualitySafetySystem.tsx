const quality = [
  ["01","Prepare","Review scope, drawings, site conditions and execution requirements before work begins."],
  ["02","Verify","Use inspection points, material checks and documented handoffs around critical activities."],
  ["03","Control","Keep execution decisions, sequencing and interfaces visible to the project team."],
  ["04","Correct","Identify deviations, record action and close the loop rather than allowing issues to disappear."],
];
const safety = [
  ["01","Plan the work","Start from the activity, work area, access and foreseeable controls."],
  ["02","Protect the team","Keep safe work practices, PPE and site controls explicit in the execution story."],
  ["03","Inspect","Use repeatable checks around active work fronts and higher-risk activities."],
  ["04","Learn","Treat observations and corrective actions as inputs to better future execution."],
];

export function QualitySafetySystem(){
 return <section className="v12-section v12-section--dark" aria-labelledby="v12-qas-title"><div className="v12-container">
   <div className="v12-section__head"><div><span className="v12-kicker v12-kicker-light">Quality & Safety</span></div><div className="v12-section__head-copy"><h2 id="v12-qas-title">Process is part of the proof.</h2><p>Miror can communicate disciplined quality and safety practices without inventing certifications, accident statistics or unsupported compliance claims.</p></div></div>
   <div className="v12-dark-grid">
    <div className="v12-dark-card"><span>QUALITY SYSTEM / 01</span><h3>From prepare to correct.</h3><div className="v12-list">{quality.map(([n,t,b])=><div className="v12-list__row" key={n}><span>{n}</span><strong>{t}</strong><small>{b}</small></div>)}</div></div>
    <div className="v12-dark-card"><span>SAFETY SYSTEM / 02</span><h3>From plan to learn.</h3><div className="v12-list">{safety.map(([n,t,b])=><div className="v12-list__row" key={n}><span>{n}</span><strong>{t}</strong><small>{b}</small></div>)}</div></div>
   </div>
 </div></section>;
}
