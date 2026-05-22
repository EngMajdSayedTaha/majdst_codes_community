import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx < 1) return;
  env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
});

const sb = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const { data: challenges } = await sb.from('challenges').select('id, week').order('week');
const byWeek = {};
challenges.forEach(c => { byWeek[c.week] = c.id; });
console.log('challenge IDs:', byWeek);

const { error } = await sb.from('challenge_submissions').insert([
  { challenge_id: byWeek[1], handle: '@codewiz_javier', solution: 'https://github.com/javier/cli-tasks', admin_notes: 'Node.js + chalk — really clean output!', status: 'winner' },
  { challenge_id: byWeek[1], handle: '@alex_builds', solution: 'https://github.com/alex/task-cli', admin_notes: 'Python + typer lib. Fast and clean.', status: 'reviewed' },
  { challenge_id: byWeek[1], handle: '@rust_dev_kim', solution: 'https://github.com/kim/rusktask', status: 'reviewed' },
  { challenge_id: byWeek[2], handle: '@cssqueen_mia', solution: 'https://codepen.io/mia/pen/card-flip', admin_notes: 'Pure CSS backface-visibility! Zero JS.', status: 'winner' },
  { challenge_id: byWeek[2], handle: '@frontend_reza', solution: 'https://codepen.io/reza/css-card', status: 'reviewed' },
  { challenge_id: byWeek[3], handle: '@reactpro_sam', solution: 'https://github.com/sam/realtime-chat', status: 'pending' },
  { challenge_id: byWeek[3], handle: '@typescript_lily', solution: 'https://github.com/lily/chat-ui', status: 'pending' },
].filter(s => s.challenge_id));

if (error) console.error('❌', error.message);
else console.log('✅ 7 submissions inserted');
