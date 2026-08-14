import type { Project, Participant } from './types';
import { initialProjects } from './data';
import { supabase } from './supabaseClient';

const KEY = 'planeja-secti-v2-oficial';

export interface Store {
  projects: Project[];
  participant?: Participant;
  history: { at: string; author: string; project: string; summary: string }[];
}

function projectFromDb(r: Record<string, any>): Project {
  return {
    id: r.id,
    name: r.name,
    executive: r.executive || '',
    axis: r.axis || '',
    objective: r.objective || '',
    area: r.area || '',
    secondaryArea: r.secondary_area || '',
    initiatives: Array.isArray(r.initiatives) ? r.initiatives : [],
    goal: r.goal || '',
    actual2025: r.actual_2025 || '',
    target2026: r.target_2026 || '',
    target2027: r.target_2027 || '',
    target2028: r.target_2028 || '',
    unit: r.unit || '',
    indicator: r.indicator || '',
    metric: r.metric || '',
    frequency: r.frequency || '',
    owner: r.owner || '',
    notes: r.notes || '',
    status: r.status || 'Pendente',
    provenance: r.provenance || 'Importada da base',
    divergence: r.divergence || undefined,
    updatedAt: r.updated_at || new Date().toISOString(),
    updatedBy: r.updated_by || 'Participante',
  };
}

function projectToDb(p: Project) {
  return {
    id: p.id,
    name: p.name,
    executive: p.executive,
    axis: p.axis,
    objective: p.objective,
    area: p.area,
    secondary_area: p.secondaryArea || '',
    initiatives: p.initiatives,
    goal: p.goal || '',
    actual_2025: p.actual2025 || '',
    target_2026: p.target2026 || '',
    target_2027: p.target2027 || '',
    target_2028: p.target2028 || '',
    unit: p.unit || '',
    indicator: p.indicator || '',
    metric: p.metric || '',
    frequency: p.frequency || '',
    owner: p.owner || '',
    notes: p.notes || '',
    status: p.status || 'Pendente',
    provenance: p.provenance || 'Importada da base',
    divergence: p.divergence || null,
    updated_at: p.updatedAt || new Date().toISOString(),
    updated_by: p.updatedBy || 'Participante',
  };
}

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      return JSON.parse(raw) as Store;
    }
  } catch (err) {
    console.warn('Falha ao ler localStorage:', err);
  }
  return { projects: initialProjects, history: [] };
}

export function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event('secti-saved'));
  } catch (err) {
    console.error('Erro no salvamento local:', err);
  }
}

export async function syncProjectToSupabase(p: Project) {
  try {
    const row = projectToDb(p);
    const { error } = await supabase.from('workshop_projects').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Erro ao sincronizar com Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Supabase offline:', err);
  }
}

export async function fetchProjectsFromSupabase(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase.from('workshop_projects').select('*').order('name');
    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map(projectFromDb);
  } catch {
    return null;
  }
}

export function subscribeToProjectsRealtime(onUpdate: (project: Project) => void) {
  const channel = supabase
    .channel('realtime:workshop_projects')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'workshop_projects' },
      (payload) => {
        if (payload.new && (payload.new as any).id) {
          onUpdate(projectFromDb(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
