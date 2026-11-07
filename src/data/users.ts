import type { User } from '../types'

export const USERS: User[] = [
  // --- PRIMARY LOGGED-IN DEVELOPER ---
  {
    id: 'user_dev_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@pointfex.internal',
    role: 'developer',
    title: 'Senior Frontend Engineer',
    teamId: 'team_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'AR',
    status: 'online',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'Next.js'],
    timezone: 'UTC-5 (EST)',
    github: 'github.com/alex-pointfex',
    joinedSprint: 'Sprint 1',
    bio: 'Frontend specialist focused on modular design systems, high performance interfaces, and state management.',
  },
  // --- TEAM 1 DEVELOPERS (Quantum Core) ---
  {
    id: 'user_dev_02',
    name: 'Marcus Vance',
    email: 'marcus.v@pointfex.internal',
    role: 'developer',
    title: 'Lead Full-Stack Engineer',
    teamId: 'team_01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'MV',
    status: 'online',
    skills: ['Node.js', 'PostgreSQL', 'Express', 'React', 'Docker'],
    timezone: 'UTC-5 (EST)',
    github: 'github.com/marcus-vance',
  },
  {
    id: 'user_dev_03',
    name: 'Elena Rostova',
    email: 'elena.r@pointfex.internal',
    role: 'developer',
    title: 'UI/UX & Frontend Developer',
    teamId: 'team_01',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'ER',
    status: 'away',
    skills: ['Figma', 'React', 'CSS Modules', 'Accessibility', 'Storybook'],
    timezone: 'UTC-5 (EST)',
    github: 'github.com/elena-rostova',
  },
  {
    id: 'user_dev_04',
    name: 'Devon Park',
    email: 'devon.p@pointfex.internal',
    role: 'developer',
    title: 'Backend & Systems Engineer',
    teamId: 'team_01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'DP',
    status: 'online',
    skills: ['Go', 'Redis', 'Kafka', 'PostgreSQL', 'Kubernetes'],
    timezone: 'UTC-8 (PST)',
    github: 'github.com/devonpark',
  },

  // --- TEAM 2 DEVELOPERS (Nexus Cloud) ---
  { id: 'user_dev_05', name: 'Sophia Chen', email: 'sophia.c@pointfex.internal', role: 'developer', title: 'Senior Cloud Engineer', teamId: 'team_02', initials: 'SC', status: 'online' },
  { id: 'user_dev_06', name: 'Liam O’Connor', email: 'liam.o@pointfex.internal', role: 'developer', title: 'Fullstack Engineer', teamId: 'team_02', initials: 'LO', status: 'offline' },
  { id: 'user_dev_07', name: 'Priya Patel', email: 'priya.p@pointfex.internal', role: 'developer', title: 'Frontend Developer', teamId: 'team_02', initials: 'PP', status: 'online' },
  { id: 'user_dev_08', name: 'Lucas Meyer', email: 'lucas.m@pointfex.internal', role: 'developer', title: 'DevOps & CI/CD Engineer', teamId: 'team_02', initials: 'LM', status: 'away' },

  // --- TEAM 3 DEVELOPERS (Apex Mobility) ---
  { id: 'user_dev_09', name: 'Maya Lin', email: 'maya.l@pointfex.internal', role: 'developer', title: 'React Native Lead', teamId: 'team_03', initials: 'ML', status: 'online' },
  { id: 'user_dev_10', name: 'Carlos Mendez', email: 'carlos.m@pointfex.internal', role: 'developer', title: 'Mobile Engineer (iOS)', teamId: 'team_03', initials: 'CM', status: 'online' },
  { id: 'user_dev_11', name: 'Aisha Al-Mansoor', email: 'aisha.a@pointfex.internal', role: 'developer', title: 'Mobile Backend Engineer', teamId: 'team_03', initials: 'AA', status: 'away' },
  { id: 'user_dev_12', name: 'Tobias Schmidt', email: 'tobias.s@pointfex.internal', role: 'developer', title: 'QA & Automation Engineer', teamId: 'team_03', initials: 'TS', status: 'offline' },

  // --- TEAM 4 DEVELOPERS (Sentinel Security) ---
  { id: 'user_dev_13', name: 'Jordan Hayes', email: 'jordan.h@pointfex.internal', role: 'developer', title: 'Security & Auth Engineer', teamId: 'team_04', initials: 'JH', status: 'online' },
  { id: 'user_dev_14', name: 'Kavita Sharma', email: 'kavita.s@pointfex.internal', role: 'developer', title: 'Backend Security Engineer', teamId: 'team_04', initials: 'KS', status: 'online' },
  { id: 'user_dev_15', name: 'Felix Weber', email: 'felix.w@pointfex.internal', role: 'developer', title: 'Fullstack Engineer', teamId: 'team_04', initials: 'FW', status: 'offline' },
  { id: 'user_dev_16', name: 'Chloe Dubois', email: 'chloe.d@pointfex.internal', role: 'developer', title: 'Frontend Engineer', teamId: 'team_04', initials: 'CD', status: 'online' },

  // --- TEAM 5 DEVELOPERS (Horizon AI) ---
  { id: 'user_dev_17', name: 'Tariq Hassan', email: 'tariq.h@pointfex.internal', role: 'developer', title: 'Machine Learning Engineer', teamId: 'team_05', initials: 'TH', status: 'online' },
  { id: 'user_dev_18', name: 'Zoe Thorne', email: 'zoe.t@pointfex.internal', role: 'developer', title: 'Data Pipeline Engineer', teamId: 'team_05', initials: 'ZT', status: 'away' },
  { id: 'user_dev_19', name: 'Kenji Sato', email: 'kenji.s@pointfex.internal', role: 'developer', title: 'AI Frontend Engineer', teamId: 'team_05', initials: 'KS', status: 'online' },
  { id: 'user_dev_20', name: 'Hannah Abbott', email: 'hannah.a@pointfex.internal', role: 'developer', title: 'MLOps Engineer', teamId: 'team_05', initials: 'HA', status: 'online' },

  // --- TEAM 6 DEVELOPERS (Pulse Media) ---
  { id: 'user_dev_21', name: 'David Kim', email: 'david.k@pointfex.internal', role: 'developer', title: 'Video Streaming Engineer', teamId: 'team_06', initials: 'DK', status: 'online' },
  { id: 'user_dev_22', name: 'Nadia Petrova', email: 'nadia.p@pointfex.internal', role: 'developer', title: 'WebRTC & Media Specialist', teamId: 'team_06', initials: 'NP', status: 'offline' },
  { id: 'user_dev_23', name: 'Gabriel Santos', email: 'gabriel.s@pointfex.internal', role: 'developer', title: 'Frontend Graphics Engineer (WebGL)', teamId: 'team_06', initials: 'GS', status: 'online' },
  { id: 'user_dev_24', name: 'Leila Farouk', email: 'leila.f@pointfex.internal', role: 'developer', title: 'Fullstack Media Engineer', teamId: 'team_06', initials: 'LF', status: 'away' },

  // --- 6 PROJECT MANAGERS (PMs) ---
  {
    id: 'user_pm_01',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@pointfex.internal',
    role: 'pm',
    title: 'Senior Project Manager',
    teamId: 'team_01',
    initials: 'SJ',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  { id: 'user_pm_02', name: 'Vikram Seth', email: 'vikram.s@pointfex.internal', role: 'pm', title: 'Project Manager (Cloud Systems)', teamId: 'team_02', initials: 'VS', status: 'online' },
  { id: 'user_pm_03', name: 'Emily Zhang', email: 'emily.z@pointfex.internal', role: 'pm', title: 'Agile Delivery Manager', teamId: 'team_03', initials: 'EZ', status: 'online' },
  { id: 'user_pm_04', name: 'Aaron Ross', email: 'aaron.r@pointfex.internal', role: 'pm', title: 'Security Program Manager', teamId: 'team_04', initials: 'AR', status: 'away' },
  { id: 'user_pm_05', name: 'Beatriz Silva', email: 'beatriz.s@pointfex.internal', role: 'pm', title: 'AI Products PM', teamId: 'team_05', initials: 'BS', status: 'online' },
  { id: 'user_pm_06', name: 'Oliver Wright', email: 'oliver.w@pointfex.internal', role: 'pm', title: 'Media & Streaming PM', teamId: 'team_06', initials: 'OW', status: 'offline' },

  // --- C-SUITE EXECUTIVES ---
  { id: 'user_cto_01', name: 'Dr. Arthur Sterling', email: 'arthur.sterling@pointfex.internal', role: 'cto', title: 'Chief Technology Officer', initials: 'AS', status: 'online' },
  { id: 'user_cpo_01', name: 'Amara Okafor', email: 'amara.okafor@pointfex.internal', role: 'cpo', title: 'Chief People Officer', initials: 'AO', status: 'online' },
  { id: 'user_cfo_01', name: 'Vincent Gallagher', email: 'vincent.g@pointfex.internal', role: 'cfo', title: 'Chief Financial Officer', initials: 'VG', status: 'online' },
  { id: 'user_ceo_01', name: 'Victoria Sterling-Fox', email: 'victoria.fox@pointfex.internal', role: 'ceo', title: 'Chief Executive Officer', initials: 'VF', status: 'online' },
]

export const CURRENT_DEV_ID = 'user_dev_01'
export const getCurrentDeveloper = (): User | undefined => USERS.find((u) => u.id === CURRENT_DEV_ID)
export const CURRENT_PM_ID = 'user_pm_01'
export const getCurrentPm = (): User | undefined => USERS.find((u) => u.id === CURRENT_PM_ID)

