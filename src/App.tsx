import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, ChevronRight, Download, Printer, Save, Search, TriangleAlert, WifiOff, Plus } from 'lucide-react';
import { areas, axes, executiveSecretariats, indicatorCatalog, objectives, strategy } from './data';
import { load, save, type Store } from './storage';
import type { Participant, Project } from './types';
import { normalizeDisplay, validate } from './validation';

type Page = 'home' | 'identify' | 'projects' | 'edit' | 'review' | 'dashboard';
const steps = ['Enquadramento', 'Iniciativas e meta', 'Resultados anuais', 'Indicador e métrica'];

export function App() {
  const [store, setStore] = useState<Store>(load);
  const [page, setPage] = useState<Page>('home');
  const [selected, setSelected] = useState<string>('');
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [execFilter, setExecFilter] = useState('Todas');
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjExec, setNewProjExec] = useState('');

  const project = store.projects.find((p) => p.id === selected);

  useEffect(() => {
    const t = setTimeout(() => {
      save(store);
      setSaved(true);
      setTimeout(() => setSaved(false), 1400);
    }, 350);
    return () => clearTimeout(t);
  }, [store]);

  const update = (patch: Partial<Project>) => {
    if (!project) return;
    setStore((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === project.id
          ? {
              ...p,
              ...patch,
              updatedAt: new Date().toISOString(),
              updatedBy: s.participant?.name || 'Participante',
            }
          : p
      ),
      history: [
        ...s.history,
        {
          at: new Date().toISOString(),
          author: s.participant?.name || 'Participante',
          project: project.name,
          summary: 'Rascunho atualizado',
        },
      ],
    }));
  };

  const goProject = (id: string) => {
    setSelected(id);
    setStep(0);
    setPage('edit');
  };

  const createNewProject = (name: string, executive: string) => {
    const id = crypto.randomUUID();
    const p: Project = {
      id,
      name: name.trim(),
      executive: executive.trim() || store.participant?.executive || 'Pendente',
      axis: '',
      objective: '',
      area: '',
      secondaryArea: '',
      initiatives: [],
      goal: '',
      actual2025: '',
      target2026: '',
      target2027: '',
      target2028: '',
      unit: '',
      indicator: '',
      metric: '',
      frequency: '',
      owner: store.participant?.name || '',
      notes: '',
      status: 'Em preenchimento',
      provenance: 'Proposta para discussão',
      updatedAt: new Date().toISOString(),
      updatedBy: store.participant?.name || '',
    };
    setStore((s) => ({ ...s, projects: [...s.projects, p] }));
    setNewProjectModal(false);
    setNewProjName('');
    setNewProjExec('');
    goProject(id);
  };

  const exportCsv = () => {
    const rows = store.projects.map((p) => [
      p.name,
      p.executive,
      p.axis,
      p.objective,
      p.area,
      p.goal,
      p.actual2025,
      p.target2026,
      p.target2027,
      p.target2028,
      p.unit,
      p.indicator,
      p.metric,
      p.owner,
      p.status,
    ]);
    const csv = [
      ['Projeto', 'Executiva', 'Eixo', 'Objetivo', 'Área', 'Meta', '2025', '2026', '2027', '2028', 'Unidade', 'Indicador', 'Métrica', 'Responsável', 'Status'],
      ...rows,
    ]
      .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(';'))
      .join('\n');
    download('planeja-secti.csv', '\ufeff' + csv, 'text/csv');
  };

  return (
    <div className="app">
      <header>
        <button className="brand" onClick={() => setPage('home')}>
          <div className="brand-badge">
            RECIFE
            <span>PREFEITURA</span>
          </div>
          <div className="brand-inst">
            <b>Secretaria de Transformação Digital, Ciência e Tecnologia</b>
            <small>Prefeitura do Recife</small>
          </div>
          <div className="brand-divider" />
          <div className="brand-app">
            <b>Planeja SECTI</b>
            <small>Oficina 2025–2028</small>
          </div>
        </button>
        <nav>
          <button onClick={() => setPage('projects')}>
            <Search />
            Projetos
          </button>
          <button onClick={() => setPage('dashboard')}>
            <BarChart3 />
            Painel
          </button>
        </nav>
        <div className="save">
          {!navigator.onLine ? (
            <>
              <WifiOff /> Offline
            </>
          ) : saved ? (
            <>
              <CheckCircle2 /> Salvo
            </>
          ) : (
            <>
              <Save /> Autosave
            </>
          )}
        </div>
      </header>

      <main>
        {page === 'home' && (
          <HomePage
            start={() => setPage(store.participant ? 'projects' : 'identify')}
            dashboard={() => setPage('dashboard')}
          />
        )}
        {page === 'identify' && (
          <Identify
            initial={store.participant}
            done={(p) => {
              setStore((s) => ({ ...s, participant: p }));
              setPage('projects');
            }}
          />
        )}
        {page === 'projects' && (
          <Projects
            projects={store.projects}
            query={query}
            setQuery={setQuery}
            open={goProject}
            openNewModal={() => {
              setNewProjExec(store.participant?.executive || 'SETD');
              setNewProjectModal(true);
            }}
          />
        )}
        {page === 'edit' && project && (
          <Editor p={project} step={step} setStep={setStep} update={update} review={() => setPage('review')} />
        )}
        {page === 'review' && project && (
          <Review p={project} back={() => setPage('edit')} update={update} />
        )}
        {page === 'dashboard' && (
          <Dashboard
            projects={store.projects}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            execFilter={execFilter}
            setExecFilter={setExecFilter}
            open={goProject}
            csv={exportCsv}
          />
        )}
      </main>

      {/* Modal de Novo Projeto */}
      {newProjectModal && (
        <div className="modal-backdrop" onClick={() => setNewProjectModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="kicker">Novo Cadastro</div>
            <h3>Cadastrar novo projeto ou programa</h3>
            <p>Adicione uma nova iniciativa ao portfólio da oficina.</p>

            <label>
              Nome do projeto / programa *
              <input
                autoFocus
                placeholder="Ex.: Novo Sistema de Atendimento"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
              />
            </label>

            <label>
              Secretaria Executiva Responsável *
              <select value={newProjExec} onChange={(e) => setNewProjExec(e.target.value)}>
                <option value="">Selecione a secretaria executiva</option>
                {executiveSecretariats.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button className="secondary" onClick={() => setNewProjectModal(false)}>
                Cancelar
              </button>
              <button
                className="primary"
                disabled={!newProjName.trim() || !newProjExec}
                onClick={() => createNewProject(newProjName, newProjExec)}
              >
                Cadastrar e Iniciar <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ start, dashboard }: { start: () => void; dashboard: () => void }) {
  return (
    <section className="hero">
      <div className="hero-inst-header">
        <div className="gov-title">Prefeitura do Recife</div>
        <div className="sec-title">Secretaria de Transformação Digital, Ciência e Tecnologia</div>
      </div>
      <div className="eyebrow" style={{ marginTop: '24px' }}>
        OFICINA DE PLANEJAMENTO ESTRATÉGICO 2025–2028
      </div>
      <h1>
        Decisões claras.
        <br />
        <em>Resultados acompanháveis.</em>
      </h1>
      <p>
        Espaço oficial de trabalho coletivo para estruturar, enquadrar e acompanhar as metas, indicadores e projetos da
        SECTI Recife no ciclo 2025–2028.
      </p>
      <div className="hero-actions">
        <button className="primary" onClick={start}>
          Iniciar planejamento <ChevronRight />
        </button>
        <button className="secondary" onClick={dashboard}>
          Acompanhar oficina
        </button>
      </div>

      <div className="exec-strip">
        <div className="kicker">Secretarias Executivas Integradas</div>
        <div className="exec-tags">
          {executiveSecretariats.map((sec) => (
            <span key={sec.id} className="exec-pill">
              <b>{sec.id}</b> {sec.name.split('—')[1]}
            </span>
          ))}
        </div>
      </div>

      <div className="principles" style={{ marginTop: '36px' }}>
        <article>
          <small>MISSÃO INSTITUCIONAL</small>
          <b>Base oficial SECTI</b>
          <p>{strategy.mission}</p>
        </article>
        <article>
          <small>VISÃO DE FUTURO</small>
          <b>Base oficial SECTI</b>
          <p>{strategy.vision}</p>
        </article>
        <article>
          <small>VALORES & CULTURA</small>
          <b>Base oficial SECTI</b>
          <p>{strategy.values}</p>
        </article>
      </div>
    </section>
  );
}

function Identify({ initial, done }: { initial?: Participant; done: (p: Participant) => void }) {
  const [p, setP] = useState(initial || { name: '', executive: '', role: '' });
  return (
    <section className="panel narrow">
      <div className="kicker">Identificação do Participante</div>
      <h2>Como você participa desta oficina?</h2>
      <p>Seus dados acompanham o histórico das alterações e facilitam a consolidação.</p>

      <label>
        Seu nome completo *
        <input
          placeholder="Ex.: Maria Silva"
          value={p.name}
          onChange={(e) => setP({ ...p, name: e.target.value })}
        />
      </label>

      <label>
        Secretaria Executiva *
        <select
          value={p.executive}
          onChange={(e) => setP({ ...p, executive: e.target.value })}
        >
          <option value="">Selecione sua Secretaria Executiva</option>
          {executiveSecretariats.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Função, gerência ou equipe
        <input
          placeholder="Ex.: Gerente de Projetos / Analista"
          value={p.role}
          onChange={(e) => setP({ ...p, role: e.target.value })}
        />
      </label>

      <button className="primary" disabled={!p.name.trim() || !p.executive} onClick={() => done(p)}>
        Continuar para os Projetos <ChevronRight />
      </button>
    </section>
  );
}

function Projects({
  projects,
  query,
  setQuery,
  open,
  openNewModal,
}: {
  projects: Project[];
  query: string;
  setQuery: (s: string) => void;
  open: (s: string) => void;
  openNewModal: () => void;
}) {
  const [selectedExec, setSelectedExec] = useState('Todas');

  const filtered = projects.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.executive.toLowerCase().includes(query.toLowerCase()) ||
      p.area.toLowerCase().includes(query.toLowerCase());
    const matchesExec = selectedExec === 'Todas' || p.executive.toUpperCase() === selectedExec.toUpperCase();
    return matchesQuery && matchesExec;
  });

  return (
    <section className="content">
      <div className="title-row">
        <div>
          <div className="kicker">Portfólio Institucional SECTI</div>
          <h2>Projetos e Programas Estratégicos</h2>
        </div>
        <button className="primary" onClick={openNewModal}>
          <Plus /> Novo projeto
        </button>
      </div>

      <div className="filter-bar">
        <div className="search">
          <Search />
          <input
            placeholder="Pesquisar por projeto, área temática ou responsável"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="exec-filter-chips">
          <button
            className={`chip ${selectedExec === 'Todas' ? 'active' : ''}`}
            onClick={() => setSelectedExec('Todas')}
          >
            Todas ({projects.length})
          </button>
          {executiveSecretariats.map((sec) => {
            const count = projects.filter((p) => p.executive.toUpperCase() === sec.id.toUpperCase()).length;
            return (
              <button
                key={sec.id}
                className={`chip ${selectedExec === sec.id ? 'active' : ''}`}
                onClick={() => setSelectedExec(sec.id)}
              >
                {sec.id} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="project-grid">
        {filtered.map((p) => (
          <button className="project-card" key={p.id} onClick={() => open(p.id)}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span className={'badge ' + statusClass(p.provenance)}>{p.provenance}</span>
                <span className="badge-exec">{p.executive || 'Pendente'}</span>
              </div>
              <h3>{normalizeDisplay(p.name)}</h3>
              <p>
                {p.axis ? `Eixo ${p.axis}` : 'Eixo a definir'} · {p.area || 'Área pendente'}
              </p>
              {p.divergence && (
                <small>
                  <TriangleAlert /> Divergência registrada
                </small>
              )}
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>

      <p className="notice">
        Portfólio estratégico oficial da Secretaria de Transformação Digital, Ciência e Tecnologia — Ciclo 2025–2028.
      </p>
    </section>
  );
}

function Editor({
  p,
  step,
  setStep,
  update,
  review,
}: {
  p: Project;
  step: number;
  setStep: (n: number) => void;
  update: (x: Partial<Project>) => void;
  review: () => void;
}) {
  return (
    <section className="content">
      <div className="title-row">
        <div>
          <div className="kicker">
            {p.executive} · {p.provenance}
          </div>
          <h2>{p.name}</h2>
        </div>
        <span className="badge amber">{p.status}</span>
      </div>

      <div className="progress">
        <i style={{ width: `${(step + 1) * 25}%` }} />
      </div>

      <div className="steps">
        {steps.map((s, i) => (
          <button className={i === step ? 'active' : ''} onClick={() => setStep(i)} key={s}>
            <span>{i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      <div className="panel form">
        {step === 0 && <Strategic p={p} update={update} />}
        {step === 1 && (
          <>
            <h3>Iniciativas e meta estratégica</h3>
            <p>Iniciativa é o que será feito. Meta é o resultado que se deseja alcançar.</p>
            <label>
              Iniciativas (uma por linha)
              <textarea
                value={p.initiatives.join('\n')}
                onChange={(e) => update({ initiatives: e.target.value.split('\n') })}
              />
            </label>
            <label>
              Meta estratégica *
              <textarea value={p.goal} onChange={(e) => update({ goal: e.target.value })} />
            </label>
          </>
        )}
        {step === 2 && <Annual p={p} update={update} />}
        {step === 3 && <Indicator p={p} update={update} />}

        <div className="form-actions">
          <button className="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Voltar
          </button>
          {step < 3 ? (
            <button className="primary" onClick={() => setStep(step + 1)}>
              Continuar <ChevronRight />
            </button>
          ) : (
            <button className="primary" onClick={review}>
              Revisar ficha <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Strategic({ p, update }: { p: Project; update: (x: Partial<Project>) => void }) {
  return (
    <>
      <h3>Enquadramento estratégico</h3>
      <p>Escolha uma classificação principal. Uma segunda área pode ser registrada como observação.</p>

      <label>
        Secretaria Executiva Responsável *
        <select value={p.executive} onChange={(e) => update({ executive: e.target.value })}>
          <option value="">Selecione a executiva</option>
          {executiveSecretariats.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Eixo principal *
        <select value={p.axis} onChange={(e) => update({ axis: e.target.value, objective: '', area: '' })}>
          <option value="">Selecione</option>
          {axes.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Objetivo estratégico *
        <select
          value={p.objective}
          disabled={!p.axis}
          onChange={(e) => update({ objective: e.target.value, area: '' })}
        >
          <option value="">Selecione</option>
          {(objectives[p.axis] || []).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>

      <label>
        Área temática principal *
        <select value={p.area} disabled={!p.objective} onChange={(e) => update({ area: e.target.value })}>
          <option value="">Selecione</option>
          {(areas[p.objective] || []).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>

      <label>
        Área secundária (opcional)
        <input value={p.secondaryArea} onChange={(e) => update({ secondaryArea: e.target.value })} />
      </label>

      {p.divergence && (
        <div className="warning">
          <TriangleAlert />
          <div>
            <b>Divergência a validar</b>
            <p>{p.divergence}</p>
          </div>
        </div>
      )}
    </>
  );
}

function Annual({ p, update }: { p: Project; update: (x: Partial<Project>) => void }) {
  return (
    <>
      <h3>Resultados anuais</h3>
      <p>Todos os anos usam a mesma unidade. Campo vazio continua como pendente.</p>
      <label>
        Unidade de medida *
        <input
          value={p.unit}
          onChange={(e) => update({ unit: e.target.value })}
          placeholder="Ex.: pessoas, %, serviços"
        />
      </label>
      <div className="annual">
        {[
          ['Realizado 2025', 'actual2025'],
          ['Meta 2026', 'target2026'],
          ['Meta 2027', 'target2027'],
          ['Meta 2028', 'target2028'],
        ].map(([l, k]) => (
          <label key={k}>
            {l}
            <input
              type="number"
              value={String(p[k as keyof Project])}
              onChange={(e) => update({ [k]: e.target.value })}
            />
          </label>
        ))}
      </div>
    </>
  );
}

function Indicator({ p, update }: { p: Project; update: (x: Partial<Project>) => void }) {
  const suggestions = indicatorCatalog
    .filter((i) => !p.executive || p.executive === 'Pendente' || i.executive.toLowerCase() === p.executive.toLowerCase())
    .slice(0, 40);

  return (
    <>
      <h3>Indicador estratégico principal</h3>
      <p>Use um único indicador principal. O catálogo oficial oferece sugestões; você pode criar outro.</p>
      <label>
        Indicador *
        <input
          list="indicator-catalog"
          value={p.indicator}
          onChange={(e) => {
            const i = indicatorCatalog.find((x) => x.name === e.target.value);
            update(
              i
                ? {
                    indicator: i.name,
                    metric: i.metric,
                    unit: i.unit,
                    frequency: i.frequency,
                    owner: p.owner || i.owner,
                  }
                : { indicator: e.target.value }
            );
          }}
          placeholder="Pesquisar entre 150 indicadores oficiais"
        />
        <datalist id="indicator-catalog">
          {suggestions.map((i) => (
            <option key={`${i.sourceRow}-${i.name}`} value={i.name}>
              {i.subject} · {i.executive}
            </option>
          ))}
        </datalist>
      </label>
      <label>
        Fórmula ou descrição da métrica *
        <textarea
          value={p.metric}
          onChange={(e) => update({ metric: e.target.value })}
          placeholder="Explique exatamente como calcular"
        />
      </label>
      <div className="two">
        <label>
          Frequência
          <select value={p.frequency} onChange={(e) => update({ frequency: e.target.value })}>
            <option value="">Selecione</option>
            <option>Mensal</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Anual</option>
          </select>
        </label>
        <label>
          Responsável pelo preenchimento *
          <input value={p.owner} onChange={(e) => update({ owner: e.target.value })} />
        </label>
      </div>
      <label>
        Observações
        <textarea value={p.notes} onChange={(e) => update({ notes: e.target.value })} />
      </label>
    </>
  );
}

function Review({ p, back, update }: { p: Project; back: () => void; update: (x: Partial<Project>) => void }) {
  const errors = validate(p);
  return (
    <section className="content">
      <div className="title-row">
        <div>
          <div className="kicker">Revisão final</div>
          <h2>{p.name}</h2>
        </div>
        <button className="secondary" onClick={() => window.print()}>
          <Printer /> Imprimir ficha
        </button>
      </div>
      {errors.length > 0 && (
        <div className="warning">
          <TriangleAlert />
          <div>
            <b>{errors.length} pendência(s)</b>
            <ul>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="sheet">
        <h3>Ficha consolidada</h3>
        <dl>
          <dt>Secretaria Executiva</dt>
          <dd>{p.executive || 'Pendente'}</dd>
          <dt>Enquadramento</dt>
          <dd>
            {p.axis || 'Pendente'} → {p.objective || 'Pendente'} → {p.area || 'Pendente'}
          </dd>
          <dt>Meta estratégica</dt>
          <dd>{p.goal || 'Pendente'}</dd>
          <dt>Resultados</dt>
          <dd>
            2025: {p.actual2025 || 'Pendente'} · 2026: {p.target2026 || 'Pendente'} · 2027: {p.target2027 || 'Pendente'} ·{' '}
            2028: {p.target2028 || 'Pendente'} {p.unit}
          </dd>
          <dt>Indicador</dt>
          <dd>{p.indicator || 'Pendente'}</dd>
          <dt>Métrica</dt>
          <dd>{p.metric || 'Pendente'}</dd>
          <dt>Responsável</dt>
          <dd>{p.owner || 'Pendente'}</dd>
        </dl>
      </div>
      <div className="form-actions">
        <button className="secondary" onClick={back}>
          Voltar e editar
        </button>
        <button
          className="primary"
          disabled={errors.length > 0}
          onClick={() => update({ status: 'Pronto para validação' })}
        >
          Marcar pronto para validação
        </button>
      </div>
    </section>
  );
}

function Dashboard({
  projects,
  statusFilter,
  setStatusFilter,
  execFilter,
  setExecFilter,
  open,
  csv,
}: {
  projects: Project[];
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  execFilter: string;
  setExecFilter: (s: string) => void;
  open: (s: string) => void;
  csv: () => void;
}) {
  const counts = useMemo(
    () =>
      Object.fromEntries(
        ['Não iniciado', 'Em preenchimento', 'Pendente', 'Pronto para validação', 'Validado'].map((s) => [
          s,
          projects.filter((p) => p.status === s).length,
        ])
      ),
    [projects]
  );

  const shown = projects.filter((p) => {
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchesExec = execFilter === 'Todas' || p.executive.toUpperCase() === execFilter.toUpperCase();
    return matchesStatus && matchesExec;
  });

  return (
    <section className="content">
      <div className="title-row">
        <div>
          <div className="kicker">Visão Geral da SECTI</div>
          <h2>Painel de Acompanhamento da Oficina</h2>
        </div>
        <button className="primary" onClick={csv}>
          <Download /> Exportar CSV
        </button>
      </div>

      <div className="stats">
        <article>
          <b>{projects.length}</b>
          <span>Total Projetos</span>
        </article>
        {Object.entries(counts).map(([s, n]) => (
          <article key={s}>
            <b>{n}</b>
            <span>{s}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Lacunas e Pendências</h3>
          <p>{projects.filter((p) => validate(p).length).length} projetos com campos pendentes</p>
          <div className="bar">
            <i
              style={{
                width: `${
                  projects.length
                    ? 100 - (projects.filter((p) => validate(p).length).length / projects.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          <h3 style={{ marginTop: '24px' }}>Divergências Mapeadas</h3>
          <p>{projects.filter((p) => p.divergence).length} aguardando decisão na oficina</p>

          <h3 style={{ marginTop: '24px' }}>Por Secretaria Executiva</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
            {executiveSecretariats.map((sec) => {
              const total = projects.filter((p) => p.executive.toUpperCase() === sec.id.toUpperCase()).length;
              return (
                <li key={sec.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #d2e1ef' }}>
                  <span><b>{sec.id}</b> <small style={{ color: 'var(--muted)' }}>{sec.name.split('—')[1]}</small></span>
                  <b>{total}</b>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="panel">
          <div className="table-head">
            <h3>Projetos ({shown.length})</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select value={execFilter} onChange={(e) => setExecFilter(e.target.value)}>
                <option value="Todas">Todas as Executivas</option>
                {executiveSecretariats.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}
                  </option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Todos">Todos os Status</option>
                {Object.keys(counts).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          {shown.map((p) => (
            <button className="row" onClick={() => open(p.id)} key={p.id}>
              <span>
                <b>{p.name}</b>
                <small>
                  {p.executive} · {p.area || 'Área a definir'}
                </small>
              </span>
              <em>{p.status}</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function download(name: string, text: string, type: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function statusClass(p: string) {
  return p.includes('Divergência') ? 'red' : p.includes('Importada') ? 'blue' : 'amber';
}
