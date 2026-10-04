import { useState, type ReactNode } from 'react';

export type ViewerFile = { name: string; code: string };
export type ViewerStep = { title: string; body: ReactNode };

/** Read-only multi-file viewer with step-by-step reveals (there is no JVM in the browser). */
export function FileViewer({ files, steps }: { files: ViewerFile[]; steps?: ViewerStep[] }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  return <section className="file-viewer" aria-label="Code files">
    <div role="tablist" className="file-tabs">
      {files.map((file, index) => <button key={file.name} role="tab" aria-selected={active === index} className={active === index ? 'file-tab active' : 'file-tab'} onClick={() => setActive(index)}>{file.name}</button>)}
    </div>
    <pre className="code-sample" tabIndex={0}><code>{files[active].code}</code></pre>
    {steps && <ol className="debug-steps">
      {steps.slice(0, shown).map(step => <li key={step.title}><strong>{step.title}</strong><div>{step.body}</div></li>)}
      {shown < steps.length && <li className="next-step"><button className="quiet-button" onClick={() => setShown(shown + 1)}>{shown === 0 ? 'Start: first step' : 'Reveal next step'}</button></li>}
    </ol>}
  </section>;
}
