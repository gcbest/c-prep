import { useEffect, useId, useState } from 'react';

// Mermaid is large, so it is imported only when a diagram is on screen (lessons 23 and 26).
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    const dark = document.documentElement.dataset.theme === 'dark';
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral' });
      const out = await mermaid.render(id, chart);
      if (alive) setSvg(out.svg);
    }).catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [chart, id]);
  if (failed) return <pre className="mermaid-fallback">{chart}</pre>;
  return <figure className="diagram">
    {svg ? <div role="img" aria-label={caption ?? 'Diagram'} dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="muted">Loading diagram…</p>}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}
