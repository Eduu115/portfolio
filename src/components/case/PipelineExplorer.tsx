import { Fragment, useEffect, useState } from 'react';

export type Scenario = 'happy' | 'consumer' | 'sandbox';
export interface ExplorerCopy {
  title: string; intro: string; groupLabel: string;
  tabs: Record<Scenario, string>;
  bracket: string; hint: string;
  nodes: { submission: [string, string]; sandbox: [string, string]; sandboxFail: string;
           testing: [string, string]; review: [string, string]; notifications: string;
           leaderboard: string; leaderboardFail: string; fallback: [string, string];
           retry: string; dlt: [string, string] };
  narrative: Record<Scenario, { title: string; body: string }>;
  facts: [string, string][];
}

const read = (): Scenario => {
  const q = new URLSearchParams(window.location.search).get('scenario');
  return q === 'consumer' || q === 'sandbox' ? q : 'happy';
};

// Paths copiados de @phosphor-icons/core (regular). No dibujes iconos a mano.
const P = {
  arrowRight: 'M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z',
  xCircle: 'M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z',
  checkCircle: 'M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z',
  retry: 'M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z',
  tray: 'M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,16V152h-28.7A15.86,15.86,0,0,0,168,156.69L148.69,176H107.31L88,156.69A15.86,15.86,0,0,0,76.69,152H48V48Zm0,160H48V168H76.69L96,187.31A15.86,15.86,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z',
};
const I = ({ d, size = 14, className = '', rotate = 0 }: { d: string; size?: number; className?: string; rotate?: number }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}
       style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}><path d={d} /></svg>
);

/** `inline` puts name and desc on one line (the small failing node in the horizontal diagram). */
function Node({ name, desc, variant = 'default', small = false, inline = false }:
  { name: string; desc?: string; variant?: 'default' | 'fail' | 'fallback' | 'dlt'; small?: boolean; inline?: boolean }) {
  return (
    <div className={`px-node is-${variant}${small ? ' is-small' : ''}`}>
      <span className="px-name" translate={variant === 'default' || (variant === 'fail' && !inline) ? 'no' : undefined}>
        {variant === 'fail' && <I d={P.xCircle} className="text-fail" />}
        {variant === 'fallback' && <I d={P.checkCircle} className="text-accent-text" />}
        {variant === 'dlt' && <I d={P.tray} className="text-muted" />}
        {inline && desc ? `${name} ${desc}` : name}
      </span>
      {desc && !inline && <span className={variant === 'dlt' ? 'px-sub' : 'px-desc'}>{desc}</span>}
    </div>
  );
}

export default function PipelineExplorer({ copy }: { copy: ExplorerCopy }) {
  const [s, setS] = useState<Scenario>('happy');
  useEffect(() => { setS(read()); }, []);
  const choose = (next: Scenario) => {
    setS(next);
    const u = new URL(window.location.href);
    if (next === 'happy') u.searchParams.delete('scenario'); else u.searchParams.set('scenario', next);
    window.history.replaceState(null, '', u);
  };
  const n = copy.nodes;
  const sandbox = s === 'sandbox'
    ? <Node name={n.sandbox[0]} desc={n.sandboxFail} variant="fail" />
    : <Node name={n.sandbox[0]} desc={n.sandbox[1]} />;
  const leaderboardH = s === 'consumer'
    ? <Node name={n.leaderboard} desc={n.leaderboardFail} variant="fail" small inline />
    : <Node name={n.leaderboard} small />;
  const leaderboardV = s === 'consumer'
    ? <Node name={n.leaderboard} desc={n.leaderboardFail} variant="fail" />
    : <Node name={n.leaderboard} />;
  const arrow = (rot = 0) => <span className="px-arrow" aria-hidden="true"><I d={P.arrowRight} size={rot ? 16 : 18} rotate={rot} /></span>;
  const retryBranch = (
    <div className="px-branch">
      <span className="px-wire is-accent is-retry" />
      <div className="px-pill"><I d={P.retry} className="text-accent-text" /><span>{n.retry}</span></div>
      <span className="px-wire is-dlt" />
      <Node name={n.dlt[0]} desc={n.dlt[1]} variant="dlt" />
    </div>
  );
  const fallbackBranch = (
    <div className="px-branch">
      <span className="px-wire is-accent is-fallback" />
      <Node name={n.fallback[0]} desc={n.fallback[1]} variant="fallback" />
    </div>
  );

  return (
    <div className="card px-card">
      <div className="px-head">
        <div className="px-head-text">
          <h2 id="flow-title" className="font-display t-h2 px-title">{copy.title}</h2>
          <p className="px-intro">{copy.intro}</p>
        </div>
        <div role="group" aria-label={copy.groupLabel} className="px-tabs">
          {(['happy', 'consumer', 'sandbox'] as Scenario[]).map((k) => (
            <button key={k} type="button" aria-pressed={s === k} className={`px-tab${s === k ? ' is-on' : ''}`} onClick={() => choose(k)}>
              {copy.tabs[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-canvas">
        {/* Horizontal ≥ 1024 */}
        <div className="px-h" aria-hidden="false">
          <div className="px-flow px-bracket-row">
            <span className="px-bracket" />
            <span className="px-bracket-label">{copy.bracket}</span>
          </div>
          <div className="px-flow is-main">
            <Node name={n.submission[0]} desc={n.submission[1]} />{arrow()}
            {sandbox}{arrow()}
            <Node name={n.testing[0]} desc={n.testing[1]} />{arrow()}
            <Node name={n.review[0]} desc={n.review[1]} />{arrow()}
            <div className="px-kafka" translate="no">kafka</div>{arrow()}
            <div className="px-stack"><Node name={n.notifications} small />{leaderboardH}</div>
          </div>
          <div className="px-flow is-branches">
            {s === 'happy' && <p className="px-hint">{copy.hint}</p>}
            {s === 'sandbox' && <div style={{ gridColumn: 3 }}>{fallbackBranch}</div>}
            {s === 'consumer' && <div style={{ gridColumn: 11 }}>{retryBranch}</div>}
          </div>
        </div>
        {/* Vertical < 1024 */}
        <div className="px-v">
          <Node name={n.submission[0]} desc={n.submission[1]} />{arrow(90)}
          <div className="px-orchestrated">
            <span className="px-bracket-label is-inline">{copy.bracket}</span>
            {sandbox}
            {s === 'sandbox' && fallbackBranch}
            {arrow(90)}<Node name={n.testing[0]} desc={n.testing[1]} />
            {arrow(90)}<Node name={n.review[0]} desc={n.review[1]} />
          </div>
          {arrow(90)}<div className="px-kafka is-v" translate="no">kafka</div>{arrow(90)}
          <div className="px-pair"><Node name={n.notifications} />{leaderboardV}</div>
          {s === 'consumer' && <div className="px-pair"><span />{retryBranch}</div>}
        </div>
      </div>

      <div className="px-foot">
        <div aria-live="polite" className="px-narrative">
          <h3 className="t-title-md">{copy.narrative[s].title}</h3>
          <p>{copy.narrative[s].body}</p>
        </div>
        <dl className="kv px-facts">
          {copy.facts.map(([k, v]) => (<Fragment key={k}><dt className="label">{k}</dt><dd>{v}</dd></Fragment>))}
        </dl>
      </div>
    </div>
  );
}
