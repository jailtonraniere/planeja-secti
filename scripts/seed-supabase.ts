import { createClient } from '@supabase/supabase-js';
import { initialProjects } from '../src/data.ts';

const url = 'https://gosyzjdobosofshemfvr.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvc3l6amRvYm9zb2ZzaGVtZnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Njg1MjEsImV4cCI6MjEwMjI0NDUyMX0.zCBIYhamWl3207S3byifT431Ho3DbXSg544e4rdXQv0';

const supabase = createClient(url, key);

async function seed() {
  console.log('Seeding projects:', initialProjects.length);
  const rows = initialProjects.map((p) => ({
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
    updated_by: p.updatedBy || 'Importação oficial',
  }));

  const { error } = await supabase.from('workshop_projects').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Successfully seeded 92 projects into Supabase!');
  }

  const { count } = await supabase.from('workshop_projects').select('*', { count: 'exact', head: true });
  console.log('Database count:', count);
}

seed();
