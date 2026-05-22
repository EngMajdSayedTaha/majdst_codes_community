/**
 * Seed script — run with: node scripts/seed.mjs
 * Reads VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or anon key) from .env
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ── Parse .env manually (no dotenv needed) ──────────────────────────────────
const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
});

const supabaseUrl = env.VITE_SUPABASE_URL;
// Prefer service role key (bypasses RLS) — fall back to anon key
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ── Helpers ──────────────────────────────────────────────────────────────────
async function insert(table, rows, label) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`  ❌ ${label}: ${error.message}`);
  } else {
    console.log(`  ✅ ${label} (${rows.length} rows)`);
  }
}

async function run() {
  console.log('\n🌱  Seeding majdst.codes database…\n');

  // ── 1. Fix site_stats duplicates ─────────────────────────────────────────
  console.log('📊  Fixing site_stats duplicates…');
  const { data: allStats } = await supabase.from('site_stats').select('id, sort_order').order('id');
  const seen = new Set();
  const toDelete = [];
  for (const row of (allStats ?? [])) {
    if (seen.has(row.sort_order)) {
      toDelete.push(row.id);
    } else {
      seen.add(row.sort_order);
    }
  }
  if (toDelete.length > 0) {
    await supabase.from('site_stats').delete().in('id', toDelete);
    console.log(`  ✅ Removed ${toDelete.length} duplicate stat rows`);
  }

  // Upsert clean stats
  const { data: existingStats } = await supabase.from('site_stats').select('sort_order');
  const existingSortOrders = new Set((existingStats ?? []).map(s => s.sort_order));
  const statsToInsert = [
    { label: 'Dev Cards',   value: '42',     sort_order: 1, is_published: true },
    { label: 'Challenges',  value: '17',     sort_order: 2, is_published: true },
    { label: 'Members',     value: '1.2K+',  sort_order: 3, is_published: true },
    { label: 'New Content', value: 'Weekly', sort_order: 4, is_published: true },
  ].filter(s => !existingSortOrders.has(s.sort_order));
  if (statsToInsert.length > 0) {
    await insert('site_stats', statsToInsert, 'site_stats (missing rows)');
  } else {
    console.log('  ✅ site_stats already clean');
  }

  // ── 2. Dev Cards ──────────────────────────────────────────────────────────
  console.log('\n📚  Seeding dev_cards…');
  const { data: existingCards } = await supabase.from('dev_cards').select('id').limit(1);
  if ((existingCards ?? []).length > 0) {
    console.log('  ⏭  dev_cards already has data — skipping');
  } else {
    await insert('dev_cards', [
      {
        title: 'Git Branching Strategy',
        description: 'Learn the Git branching model that lets you ship features faster while keeping main always deployable.',
        difficulty: 'beginner', learning_time: '20 min',
        topics: ['git', 'workflow', 'devops'],
        link: 'https://nvie.com/posts/a-successful-git-branching-model/',
        icon: '🌿', tag_key: 'git',
        fun_fact: 'Linus Torvalds created Git in just 10 days in 2005.',
        saves_count: 48, is_published: true, sort_order: 1,
      },
      {
        title: 'React useCallback & useMemo',
        description: 'Master performance optimization hooks to prevent unnecessary re-renders and expensive recalculations.',
        difficulty: 'intermediate', learning_time: '35 min',
        topics: ['react', 'hooks', 'performance'],
        link: 'https://react.dev/reference/react/useCallback',
        icon: '⚛️', tag_key: 'react',
        fun_fact: 'React was originally called "FaxJS" internally at Facebook.',
        saves_count: 72, is_published: true, sort_order: 2,
      },
      {
        title: 'TypeScript Generics',
        description: 'Write reusable, type-safe code with TypeScript generics — the superpower most devs underuse.',
        difficulty: 'intermediate', learning_time: '45 min',
        topics: ['typescript', 'generics', 'types'],
        link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
        icon: '🔷', tag_key: 'typescript',
        fun_fact: 'TypeScript was created at Microsoft by Anders Hejlsberg, who also created C#.',
        saves_count: 89, is_published: true, sort_order: 3,
      },
      {
        title: 'CSS Grid Mastery',
        description: 'From simple layouts to complex responsive designs — everything you need about CSS Grid.',
        difficulty: 'beginner', learning_time: '30 min',
        topics: ['css', 'grid', 'layout', 'responsive'],
        link: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        icon: '🎨', tag_key: 'css',
        fun_fact: 'CSS Grid was first shipped in IE10 back in 2012 — developed by Microsoft.',
        saves_count: 65, is_published: true, sort_order: 4,
      },
      {
        title: 'Node.js Event Loop',
        description: 'Deep dive into how Node.js handles async operations, the call stack, and the event queue.',
        difficulty: 'advanced', learning_time: '60 min',
        topics: ['nodejs', 'javascript', 'async', 'event-loop'],
        link: 'https://nodejs.org/en/guides/event-loop-timers-and-nexttick',
        icon: '🔄', tag_key: 'nodejs',
        fun_fact: 'Node.js processes about 1 billion npm package downloads per week.',
        saves_count: 91, is_published: true, sort_order: 5,
      },
      {
        title: 'REST API Design Principles',
        description: 'Build APIs that developers love — versioning, error codes, pagination, and documentation.',
        difficulty: 'intermediate', learning_time: '40 min',
        topics: ['api', 'rest', 'backend', 'design'],
        link: 'https://restfulapi.net/',
        icon: '🌐', tag_key: 'api',
        fun_fact: 'REST was defined by Roy Fielding in his 2000 doctoral dissertation at UC Irvine.',
        saves_count: 54, is_published: true, sort_order: 6,
      },
      {
        title: 'Docker for Developers',
        description: 'Containerize your apps, write Dockerfiles, and understand volumes, networks, and Compose.',
        difficulty: 'intermediate', learning_time: '50 min',
        topics: ['docker', 'devops', 'containers', 'deployment'],
        link: 'https://docs.docker.com/get-started/',
        icon: '🐳', tag_key: 'docker',
        fun_fact: 'The Docker logo whale is named "Moby Dock" — a nod to Moby-Dick.',
        saves_count: 78, is_published: true, sort_order: 7,
      },
      {
        title: 'SQL Window Functions',
        description: 'Unlock the power of SQL analytics with ROW_NUMBER, RANK, LAG, LEAD, and PARTITION BY.',
        difficulty: 'advanced', learning_time: '55 min',
        topics: ['sql', 'database', 'analytics', 'postgresql'],
        link: 'https://mode.com/sql-tutorial/sql-window-functions/',
        icon: '📊', tag_key: 'sql',
        fun_fact: 'Window functions were added to the SQL standard in 2003 but most DBs implemented them much later.',
        saves_count: 43, is_published: true, sort_order: 8,
      },
    ], 'dev_cards');
  }

  // ── 3. Community Members ──────────────────────────────────────────────────
  console.log('\n👥  Seeding community_members…');
  const { data: existingMembers } = await supabase.from('community_members').select('id').limit(1);
  if ((existingMembers ?? []).length > 0) {
    console.log('  ⏭  community_members already has data — skipping');
  } else {
    await insert('community_members', [
      {
        name: 'Majd Sayed Taha', github_username: 'majdsayed',
        bio: 'Full-stack developer building community tools and developer resources. Passionate about open source and clean code.',
        avatar_url: 'https://i.pravatar.cc/150?img=68',
        role: 'Founder & Full-Stack Dev',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        github_url: 'https://github.com/majdsayed',
        twitter_url: 'https://twitter.com/majdsayed',
        linkedin_url: 'https://linkedin.com/in/majdsayed',
        is_featured: true, is_published: true, sort_order: 1,
      },
      {
        name: 'Sarah Chen', github_username: 'sarahchen_dev',
        bio: 'Frontend engineer obsessed with accessibility and design systems. Building the web one component at a time.',
        avatar_url: 'https://i.pravatar.cc/150?img=47',
        role: 'Frontend Engineer',
        skills: ['React', 'CSS', 'Accessibility', 'Figma', 'TypeScript'],
        github_url: 'https://github.com/sarahchen_dev',
        twitter_url: 'https://twitter.com/sarahchen_dev',
        linkedin_url: '',
        is_featured: true, is_published: true, sort_order: 2,
      },
      {
        name: 'Rami Al-Farsi', github_username: 'ramialfarsi',
        bio: 'DevOps and cloud architect. Kubernetes whisperer. Automating everything that can be automated.',
        avatar_url: 'https://i.pravatar.cc/150?img=12',
        role: 'DevOps Engineer',
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python'],
        github_url: 'https://github.com/ramialfarsi',
        twitter_url: '',
        linkedin_url: 'https://linkedin.com/in/ramialfarsi',
        is_featured: true, is_published: true, sort_order: 3,
      },
      {
        name: 'Priya Nair', github_username: 'priyanair_codes',
        bio: 'Backend developer and database wizard. Fan of clean architecture and hexagonal design patterns.',
        avatar_url: 'https://i.pravatar.cc/150?img=49',
        role: 'Backend Developer',
        skills: ['Go', 'PostgreSQL', 'Redis', 'gRPC', 'Linux'],
        github_url: 'https://github.com/priyanair_codes',
        twitter_url: 'https://twitter.com/priyanair_codes',
        linkedin_url: '',
        is_featured: false, is_published: true, sort_order: 4,
      },
      {
        name: 'Lucas Mendes', github_username: 'lucasmendes_js',
        bio: 'JavaScript enthusiast, open source contributor, and technical writer. I break things so you don\'t have to.',
        avatar_url: 'https://i.pravatar.cc/150?img=33',
        role: 'JavaScript Developer',
        skills: ['Vue.js', 'Node.js', 'GraphQL', 'Testing', 'MongoDB'],
        github_url: 'https://github.com/lucasmendes_js',
        twitter_url: '',
        linkedin_url: 'https://linkedin.com/in/lucasmendes',
        is_featured: false, is_published: true, sort_order: 5,
      },
      {
        name: 'Amira Hassan', github_username: 'amirahassan',
        bio: 'Mobile developer (React Native + Flutter) and UI/UX advocate. Making apps beautiful and fast.',
        avatar_url: 'https://i.pravatar.cc/150?img=54',
        role: 'Mobile Developer',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Figma'],
        github_url: 'https://github.com/amirahassan',
        twitter_url: 'https://twitter.com/amirahassan',
        linkedin_url: 'https://linkedin.com/in/amirahassan',
        is_featured: false, is_published: true, sort_order: 6,
      },
    ], 'community_members');
  }

  // ── 4. Challenges ─────────────────────────────────────────────────────────
  console.log('\n🏆  Seeding challenges…');
  const { data: existingChallenges } = await supabase.from('challenges').select('id').limit(1);
  if ((existingChallenges ?? []).length > 0) {
    console.log('  ⏭  challenges already has data — skipping');
  } else {
    const { data: inserted, error: cErr } = await supabase.from('challenges').insert([
      {
        title: 'Build a CLI Task Manager',
        description: 'Create a command-line task manager in any language. Support adding, listing, completing, and deleting tasks. Persist data to a JSON file. Bonus points for color output and a TUI interface!',
        difficulty: 'medium', reward: 50, is_featured: true, week: 1,
        status: 'completed', start_date: '2026-05-01', end_date: '2026-05-07',
        link: 'https://majdst.codes/challenges/1',
        tags: ['cli', 'node', 'python', 'rust'],
        winner_handle: '@codewiz_javier', is_published: true,
      },
      {
        title: 'CSS-Only Animated Card',
        description: 'Build a product card with a hover animation using ONLY CSS — no JavaScript. The card should flip, reveal details, and look polished. Mobile-responsive gets bonus points.',
        difficulty: 'easy', reward: 25, is_featured: false, week: 2,
        status: 'completed', start_date: '2026-05-08', end_date: '2026-05-14',
        link: 'https://majdst.codes/challenges/2',
        tags: ['css', 'animation', 'html', 'frontend'],
        winner_handle: '@cssmaster_mia', is_published: true,
      },
      {
        title: 'Real-time Chat Component',
        description: 'Build a real-time chat UI component with message sending, timestamps, and a "typing..." indicator. Use any frontend framework + WebSocket or SSE. No full backend required — mock it if needed.',
        difficulty: 'hard', reward: 100, is_featured: true, week: 3,
        status: 'active', start_date: '2026-05-15', end_date: '2026-05-21',
        link: 'https://majdst.codes/challenges/3',
        tags: ['react', 'websocket', 'realtime', 'typescript'],
        winner_handle: '', is_published: true,
      },
      {
        title: 'Open Source Contribution',
        description: 'Make a meaningful contribution to any open source project on GitHub. Create a PR, get it merged, and share the link with proof. All skill levels welcome — docs count too!',
        difficulty: 'medium', reward: 75, is_featured: false, week: 4,
        status: 'active', start_date: '2026-05-22', end_date: '2026-05-28',
        link: 'https://majdst.codes/challenges/4',
        tags: ['opensource', 'github', 'contribution', 'community'],
        winner_handle: '', is_published: true,
      },
    ]).select('id, week');

    if (cErr) {
      console.error(`  ❌ challenges: ${cErr.message}`);
    } else {
      console.log(`  ✅ challenges (${inserted.length} rows)`);

      // ── 5. Submissions ────────────────────────────────────────────────────
      console.log('\n📝  Seeding challenge_submissions…');
      const byWeek = {};
      for (const c of inserted) byWeek[c.week] = c.id;

      const submissions = [
        { challenge_id: byWeek[1], handle: '@codewiz_javier', solution: 'https://github.com/javier/cli-tasks', admin_notes: 'Built with Node.js + chalk. Really clean output!', status: 'winner' },
        { challenge_id: byWeek[1], handle: '@alex_builds', solution: 'https://github.com/alex/task-cli', admin_notes: 'Python + typer library. Fast and clean!', status: 'reviewed' },
        { challenge_id: byWeek[1], handle: '@rust_dev_kim', solution: 'https://github.com/kim/rusktask', admin_notes: 'First Rust project! TUI with ratatui library.', status: 'reviewed' },
        { challenge_id: byWeek[2], handle: '@cssqueen_mia', solution: 'https://codepen.io/mia/pen/card-flip', admin_notes: 'CSS perspective + backface-visibility. Pure CSS, zero JS!', status: 'winner' },
        { challenge_id: byWeek[2], handle: '@frontend_reza', solution: 'https://codepen.io/reza/css-card', admin_notes: 'Parallax on hover using CSS transforms only.', status: 'reviewed' },
        { challenge_id: byWeek[3], handle: '@reactpro_sam', solution: 'https://github.com/sam/realtime-chat', status: 'pending' },
        { challenge_id: byWeek[3], handle: '@typescript_lily', solution: 'https://github.com/lily/chat-ui', status: 'pending' },
      ].filter(s => s.challenge_id);

      await insert('challenge_submissions', submissions, 'challenge_submissions');
    }
  }

  // ── 6. Newsletter Subscribers ─────────────────────────────────────────────
  console.log('\n📬  Seeding newsletter_subscribers…');
  const { data: existingSubs } = await supabase.from('newsletter_subscribers').select('id').limit(1);
  if ((existingSubs ?? []).length > 0) {
    console.log('  ⏭  newsletter_subscribers already has data — skipping');
  } else {
    await insert('newsletter_subscribers', [
      { email: 'majd.sayed.taha@gmail.com' },
      { email: 'sarah.codes@gmail.com' },
      { email: 'rami.devops@outlook.com' },
      { email: 'priya.backend@gmail.com' },
      { email: 'lucas.js@hotmail.com' },
      { email: 'frontend.fan@yahoo.com' },
      { email: 'coder.dan@gmail.com' },
      { email: 'typescriptlover@dev.io' },
      { email: 'webdev.anna@gmail.com' },
      { email: 'opendev@protonmail.com' },
      { email: 'react.queen@outlook.com' },
      { email: 'devhacker42@gmail.com' },
      { email: 'nodejs.master@gmail.com' },
      { email: 'css.wizard@icloud.com' },
    ], 'newsletter_subscribers');
  }

  console.log('\n✅  Seeding complete!\n');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
