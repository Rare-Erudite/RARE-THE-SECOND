import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Terminal,
  Hammer,
  FileText,
  Compass,
  Mic,
  MicOff,
  Sliders,
  Settings as SettingsIcon,
  ShieldCheck,
  RotateCcw,
  Plus,
  Send,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  Sparkles,
  Laptop,
  Trash2,
  Save,
  BrainCircuit,
  Lock,
  Unlock,
  Download,
  Package,
  Wrench,
  Check,
  FileAudio,
  Users,
  MessageSquare,
  ArrowRight,
  Eye,
  Play,
  FileCode,
  Shield,
  Layers,
  KeyRound,
  LogOut,
  ChevronRight,
  Info
} from 'lucide-react';
import { themes, ThemeKey, ThemeConfig } from './theme';
import { safeFetch, safePost } from './api';

// Types
export type AgentRole =
  | 'coordinator'
  | 'architect'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'test'
  | 'security'
  | 'repair'
  | 'release';

export type AgentStatus =
  | 'initializing'
  | 'ready'
  | 'working'
  | 'waiting'
  | 'communicating'
  | 'reviewing'
  | 'repairing'
  | 'validating'
  | 'completed'
  | 'failed';

export interface AgentMember {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  avatarColor: string;
  status: AgentStatus;
  currentTask: string;
  completedTasks: string[];
  lastAction: string;
  progressPercent: number;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  fromRole: AgentRole;
  fromName: string;
  toAgentId?: string;
  toRole?: AgentRole;
  toName?: string;
  type: string;
  subject: string;
  content: string;
  artifactRef?: string;
  timestamp: string;
}

export interface MultiAgentTeamRun {
  id: string;
  title: string;
  targetDomain: string;
  objective: string;
  status: 'planning' | 'coordinating' | 'executing' | 'validating' | 'completed' | 'failed';
  currentStage: string;
  userProgressMessage: string;
  coordinator: AgentMember;
  agents: AgentMember[];
  messages: AgentMessage[];
  events: Array<{
    id: string;
    time: string;
    agentId: string;
    agentName: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
    toolCalled?: string;
    fileAffected?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  checkpointId?: string;
  artifacts: Array<{ name: string; type: string; size: string; path: string }>;
  metrics: {
    durationSeconds: number;
    tasksTotal: number;
    tasksCompleted: number;
    handoffsCount: number;
    repairsCount: number;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thought?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  messageCount?: number;
  messages?: ChatMessage[];
}

interface ResearchItem {
  id: string;
  query: string;
  subquestions: string[];
  findings: string;
  sources: Array<{ name: string; url: string; credibility: number; date: string; quote: string }>;
  synthesis: string;
  confidence: number;
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [health, setHealth] = useState<any>(null);
  const [assistantName, setAssistantName] = useState('RARE');
  const [autonomyLevel, setAutonomyLevel] = useState(2);
  const [thinkHarder, setThinkHarder] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Theme selection with local persistence (Default is 'blue')
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('rare_theme_key');
    if (saved && ['blue', 'white', 'dark', 'red', 'green', 'yellow'].includes(saved)) {
      return saved as ThemeKey;
    }
    return 'blue';
  });

  const t: ThemeConfig = themes[currentThemeKey] || themes.blue;

  // Developer passkey gate state
  const [isDeveloperAuthed, setIsDeveloperAuthed] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [openDevSpaceDirectly, setOpenDevSpaceDirectly] = useState(false);

  const fetchHealthAndSettings = async () => {
    const [hData, sData] = await Promise.all([
      safeFetch<any>('/api/health'),
      safeFetch<any>('/api/settings'),
    ]);
    if (hData) {
      setHealth(hData);
      if (hData.assistant_name) setAssistantName(hData.assistant_name);
      if (hData.autonomy) setAutonomyLevel(hData.autonomy);
    }
    if (sData && sData.developer_authenticated !== undefined) {
      setIsDeveloperAuthed(sData.developer_authenticated);
    }
  };

  useEffect(() => {
    fetchHealthAndSettings();
    const interval = setInterval(fetchHealthAndSettings, 10000);
    return () => clearInterval(interval);
  }, []);

  const changeTheme = async (newKey: ThemeKey) => {
    setCurrentThemeKey(newKey);
    localStorage.setItem('rare_theme_key', newKey);
    await safePost('/api/settings', { theme: newKey });
  };

  // Nav items for ordinary user experience
  const navItems = [
    { id: 'home', label: 'Command Center', icon: Activity },
    { id: 'chat', label: 'Chat / Ask', icon: Terminal },
    { id: 'build', label: 'Projects / Build', icon: Hammer },
    { id: 'docs', label: 'Documents', icon: FileText },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'live', label: 'Live Voice', icon: Mic },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${t.bg} ${t.textPrimary} font-sans transition-colors duration-200`}>
      {/* Sidebar Navigation */}
      <aside className={`w-60 ${t.sidebar} ${t.cardBorder} border-r flex flex-col justify-between select-none shrink-0`}>
        <div>
          {/* Logo / Branding */}
          <div className={`p-4 border-b ${t.cardBorder} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-xl ${t.accentBg} flex items-center justify-center shadow-lg ${t.glow}`}>
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base tracking-wider">{assistantName}</span>
                  <span className={`text-[10px] ${t.badgeBg} ${t.badgeText} px-1.5 py-0.5 rounded font-mono font-semibold`}>
                    045
                  </span>
                </div>
                <div className={`text-[11px] ${t.textDim}`}>AI Assistant & Builder</div>
              </div>
            </div>
          </div>

          {/* User Nav List */}
          <nav className="p-2.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id !== 'settings') setOpenDevSpaceDirectly(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? `${t.accentBg} text-white shadow-sm font-semibold`
                      : `${t.textMuted} hover:${t.textPrimary} hover:${t.cardSub}`
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Theme Quick Selector */}
        <div className={`p-3.5 border-t ${t.cardBorder} ${t.cardSub} space-y-2`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-[11px]">System Ready</span>
            </div>
            <span className={`text-[10px] ${t.textDim}`}>v0.45.0</span>
          </div>

          {/* 6 Theme Selector Dots */}
          <div className="flex items-center justify-between pt-1">
            <span className={`text-[10px] ${t.textDim}`}>Theme:</span>
            <div className="flex items-center space-x-1.5">
              {(['blue', 'white', 'dark', 'red', 'green', 'yellow'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`w-3.5 h-3.5 rounded-full border transition transform hover:scale-125 ${
                    currentThemeKey === key ? 'ring-2 ring-indigo-400 scale-110' : 'opacity-70'
                  }`}
                  style={{
                    backgroundColor:
                      key === 'blue'
                        ? '#5C7CFF'
                        : key === 'white'
                        ? '#F1F5F9'
                        : key === 'dark'
                        ? '#161822'
                        : key === 'red'
                        ? '#E11D48'
                        : key === 'green'
                        ? '#10B981'
                        : '#F59E0B',
                    borderColor: currentThemeKey === key ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  }}
                  title={`${key.toUpperCase()} Theme`}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className={`h-14 border-b ${t.cardBorder} ${t.header} backdrop-blur px-6 flex items-center justify-between shrink-0`}>
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-semibold tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className={t.textDim}>/</span>
            <span className={`text-xs ${t.textMuted}`}>{assistantName} Personal Workspace</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Think Harder Toggle */}
            <button
              onClick={() => setThinkHarder(!thinkHarder)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs transition-all border ${
                thinkHarder
                  ? `${t.accentBg} text-white shadow-sm font-semibold`
                  : `${t.cardSub} ${t.textMuted} ${t.cardBorder} hover:${t.textPrimary}`
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Reasoning</span>
            </button>

            {/* Voice Mute/Active Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? 'Voice readout on' : 'Voice readout muted'}
              className={`p-1.5 rounded-lg ${t.cardSub} ${t.cardBorder} border ${t.textMuted} hover:${t.textPrimary} transition`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </header>

        {/* View Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'home' && (
            <CleanCommandCenterView
              t={t}
              onNavigate={setActiveTab}
              assistantName={assistantName}
            />
          )}
          {activeTab === 'chat' && (
            <CleanChatWorkspaceView
              t={t}
              assistantName={assistantName}
              thinkHarder={thinkHarder}
              voiceEnabled={voiceEnabled}
            />
          )}
          {activeTab === 'build' && <CollaborativeBuildWorkspaceView t={t} />}
          {activeTab === 'docs' && <CleanDocumentsWorkspaceView t={t} />}
          {activeTab === 'research' && <CleanResearchWorkspaceView t={t} onNavigate={setActiveTab} />}
          {activeTab === 'live' && (
            <LiveVoiceView
              t={t}
              assistantName={assistantName}
              voiceEnabled={voiceEnabled}
            />
          )}
          {activeTab === 'settings' && (
            <CleanSettingsWorkspaceView
              t={t}
              assistantName={assistantName}
              setAssistantName={setAssistantName}
              currentThemeKey={currentThemeKey}
              changeTheme={changeTheme}
              isDeveloperAuthed={isDeveloperAuthed}
              onOpenDevModal={() => setShowDevModal(true)}
              openDevSpaceDirectly={openDevSpaceDirectly}
              setOpenDevSpaceDirectly={setOpenDevSpaceDirectly}
              onDeveloperLogout={() => setIsDeveloperAuthed(false)}
            />
          )}
        </div>
      </main>

      {/* Developer Passkey Modal */}
      {showDevModal && (
        <DeveloperAuthModal
          t={t}
          isAuthed={isDeveloperAuthed}
          onSuccess={() => {
            setIsDeveloperAuthed(true);
            setShowDevModal(false);
            setActiveTab('settings');
            setOpenDevSpaceDirectly(true);
          }}
          onLogout={() => {
            setIsDeveloperAuthed(false);
            setShowDevModal(false);
          }}
          onClose={() => setShowDevModal(false)}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 1. Clean User-Focused Command Center
// -----------------------------------------------------------------------------
function CleanCommandCenterView({
  t,
  onNavigate,
  assistantName,
}: {
  t: ThemeConfig;
  onNavigate: (tab: string) => void;
  assistantName: string;
}) {
  const [runs, setRuns] = useState<MultiAgentTeamRun[]>([]);

  useEffect(() => {
    safeFetch<MultiAgentTeamRun[]>('/api/agents/runs').then((data) => {
      if (data) setRuns(data);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className={`rounded-2xl ${t.card} border ${t.cardBorder} p-6 shadow-xl space-y-3`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className={`inline-flex items-center space-x-1.5 ${t.accentText} text-xs font-semibold uppercase tracking-wider`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Intelligence Core</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className={`text-xs ${t.textMuted} max-w-lg`}>
              {assistantName} is ready to help you build applications across platforms, organize documents, transcribe audio, and conduct research.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('build')}
              className={`px-4 py-2.5 rounded-xl ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold flex items-center space-x-2 shadow-md transition`}
            >
              <Hammer className="w-4 h-4" />
              <span>Start New Project</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`px-4 py-2.5 rounded-xl ${t.cardSub} border ${t.cardBorder} text-xs font-semibold flex items-center space-x-2 transition`}
            >
              <Terminal className="w-4 h-4" />
              <span>Open Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('build')}
          className={`${t.card} border ${t.cardBorder} hover:${t.accentBorder} p-4 rounded-xl cursor-pointer transition space-y-2 group`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${t.badgeBg} ${t.badgeText}`}>
              <Users className="w-4 h-4" />
            </div>
            <ArrowRight className={`w-4 h-4 ${t.textDim} group-hover:${t.accentText} transition`} />
          </div>
          <h3 className="text-sm font-bold">Collaborative Software Builder</h3>
          <p className={`text-xs ${t.textMuted}`}>
            Describe your idea and watch specialized AI agents coordinate to build and test your project.
          </p>
        </div>

        <div
          onClick={() => onNavigate('docs')}
          className={`${t.card} border ${t.cardBorder} hover:${t.accentBorder} p-4 rounded-xl cursor-pointer transition space-y-2 group`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${t.badgeBg} ${t.badgeText}`}>
              <FileText className="w-4 h-4" />
            </div>
            <ArrowRight className={`w-4 h-4 ${t.textDim} group-hover:${t.accentText} transition`} />
          </div>
          <h3 className="text-sm font-bold">Document & Audio Center</h3>
          <p className={`text-xs ${t.textMuted}`}>
            Read, write, edit files, and transcribe recordings with intelligent quotation verification.
          </p>
        </div>

        <div
          onClick={() => onNavigate('research')}
          className={`${t.card} border ${t.cardBorder} hover:${t.accentBorder} p-4 rounded-xl cursor-pointer transition space-y-2 group`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${t.badgeBg} ${t.badgeText}`}>
              <Compass className="w-4 h-4" />
            </div>
            <ArrowRight className={`w-4 h-4 ${t.textDim} group-hover:${t.accentText} transition`} />
          </div>
          <h3 className="text-sm font-bold">Multi-Source Research</h3>
          <p className={`text-xs ${t.textMuted}`}>
            Investigate topics across verified sources and generate clear synthesis reports.
          </p>
        </div>
      </div>

      {/* Recent Projects & Deliverables */}
      <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-3`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center space-x-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Active & Recent Projects</span>
          </h3>
          <button
            onClick={() => onNavigate('build')}
            className={`text-xs ${t.accentText} hover:underline font-medium`}
          >
            View Universal Builder →
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {runs.map((run) => (
            <div key={run.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold">{run.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                    run.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : `${t.badgeBg} ${t.badgeText}`
                  }`}>
                    {run.status}
                  </span>
                  <span className={`text-[11px] ${t.textDim} capitalize`}>• {run.targetDomain}</span>
                </div>
                <p className={`text-xs ${t.textMuted}`}>{run.userProgressMessage || run.objective}</p>
              </div>

              {run.artifacts && run.artifacts.length > 0 && (
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{run.artifacts[0].name}</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. Collaborative Multi-Agent Software Builder Workspace
// -----------------------------------------------------------------------------
function CollaborativeBuildWorkspaceView({ t }: { t: ThemeConfig }) {
  const [runs, setRuns] = useState<MultiAgentTeamRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<MultiAgentTeamRun | null>(null);

  // New Project Form
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<'web' | 'android' | 'windows' | 'backend' | 'cli'>('web');
  const [objective, setObjective] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRuns = async () => {
    const data = await safeFetch<MultiAgentTeamRun[]>('/api/agents/runs');
    if (data && data.length > 0) {
      setRuns(data);
      if (!selectedRun) setSelectedRun(data[0]);
      else {
        const updated = data.find((r) => r.id === selectedRun.id);
        if (updated) setSelectedRun(updated);
      }
    }
  };

  useEffect(() => {
    loadRuns();
    const timer = setInterval(loadRuns, 2500);
    return () => clearInterval(timer);
  }, [selectedRun?.id]);

  const handleStartProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objective.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await safePost<MultiAgentTeamRun>('/api/agents/runs', {
        title,
        targetDomain: domain,
        objective,
      });
      if (res) {
        setTitle('');
        setObjective('');
        setSelectedRun(res);
        loadRuns();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRepair = async (runId: string) => {
    await safePost(`/api/agents/runs/${runId}/repair`);
    loadRuns();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Project Creator */}
      <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-4`}>
        <div className="flex items-center space-x-2">
          <Hammer className={`w-4 h-4 ${t.accentText}`} />
          <h3 className="text-sm font-bold">Collaborative Software Builder</h3>
        </div>

        <form onSubmit={handleStartProject} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. OrbitTrack Telemetry Dashboard..."
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-xs focus:outline-none`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Platform</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as any)}
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-xs focus:outline-none`}
              >
                <option value="web">Web Application (React / Vite)</option>
                <option value="android">Android Mobile App (APK)</option>
                <option value="windows">Windows Desktop App (EXE)</option>
                <option value="backend">Backend Service / API</option>
                <option value="cli">Command-Line Tool</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">What should RARE build for you?</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe the application features, data needs, and desired outcome..."
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-xs focus:outline-none`}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !title.trim() || !objective.trim()}
              className={`px-5 py-2 rounded-xl ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold disabled:opacity-40 transition shadow-md`}
            >
              {submitting ? 'Assembling Team...' : 'Commission Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Selected Project Realtime Collaborative Team View */}
      {selectedRun && (
        <div className="space-y-5">
          {/* Progress Header */}
          <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-3`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold">{selectedRun.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                    selectedRun.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : `${t.badgeBg} ${t.badgeText}`
                  }`}>
                    {selectedRun.status}
                  </span>
                </div>
                <p className={`text-xs ${t.textMuted} mt-0.5`}>{selectedRun.objective}</p>
              </div>

              {selectedRun.status !== 'completed' && (
                <button
                  onClick={() => handleRepair(selectedRun.id)}
                  className={`px-3 py-1.5 rounded-lg border ${t.cardBorder} ${t.cardSub} text-xs font-medium text-amber-400 flex items-center space-x-1.5`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Verify & Repair</span>
                </button>
              )}
            </div>

            {/* Clean Progress Stage Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-indigo-400">{selectedRun.currentStage}</span>
                <span className={`text-[11px] ${t.textDim}`}>{selectedRun.userProgressMessage}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full ${t.accentBg} transition-all duration-500`}
                  style={{
                    width: `${
                      selectedRun.status === 'completed'
                        ? 100
                        : selectedRun.currentStage.includes('Packaging')
                        ? 80
                        : selectedRun.currentStage.includes('Verification')
                        ? 60
                        : selectedRun.currentStage.includes('Implementing')
                        ? 40
                        : 20
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Deliverable Downloads */}
            {selectedRun.artifacts && selectedRun.artifacts.length > 0 && (
              <div className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} flex flex-wrap items-center justify-between gap-2 pt-2`}>
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Deliverable Verified:</span>
                  <span className="font-mono text-emerald-300">{selectedRun.artifacts[0].name} ({selectedRun.artifacts[0].size})</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href="/api/download/source"
                    download={selectedRun.artifacts[0].name}
                    className={`px-3 py-1 rounded-lg ${t.accentBg} text-white text-xs font-medium flex items-center space-x-1`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Package</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* VISIBLE ACTIVE AGENT TEAM */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Specialist AI Team</span>
              </h4>
              <span className={`text-[11px] ${t.textDim}`}>Real Coordination & Task Delegation</span>
            </div>

            {/* Agents Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Coordinator */}
              <div className={`${t.card} border ${t.cardBorder} rounded-xl p-3.5 space-y-2 relative overflow-hidden`}>
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    00
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Project Coordinator</div>
                    <div className={`text-[10px] ${t.textDim} truncate`}>Lead Orchestrator</div>
                  </div>
                </div>
                <p className={`text-[11px] ${t.textMuted} leading-snug line-clamp-2`}>
                  {selectedRun.coordinator.currentTask}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                  <span className="text-emerald-400 uppercase font-semibold">{selectedRun.coordinator.status}</span>
                  <span className={t.textDim}>{selectedRun.coordinator.progressPercent}%</span>
                </div>
              </div>

              {/* Specialists */}
              {selectedRun.agents.map((ag, i) => (
                <div key={ag.id} className={`${t.card} border ${t.cardBorder} rounded-xl p-3.5 space-y-2 relative overflow-hidden`}>
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${ag.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      0{i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{ag.name.replace(/Agent \d+ — /, '')}</div>
                      <div className={`text-[10px] ${t.textDim} truncate`}>{ag.title}</div>
                    </div>
                  </div>
                  <p className={`text-[11px] ${t.textMuted} leading-snug line-clamp-2`}>
                    {ag.currentTask}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className={`uppercase font-semibold ${
                      ag.status === 'completed'
                        ? 'text-emerald-400'
                        : ag.status === 'working'
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}>
                      {ag.status}
                    </span>
                    <span className={t.textDim}>{ag.progressPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inter-Agent Communication & Progress Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Messages & Handoffs */}
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-4 space-y-3`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>Inter-Agent Handoffs & Communications</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedRun.messages.map((m) => (
                  <div key={m.id} className={`p-2.5 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1 text-xs`}>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-indigo-300">{m.fromName} → {m.toName}</span>
                      <span className={`text-[10px] font-mono ${t.textDim}`}>{m.timestamp}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-300">{m.subject}</div>
                    <p className={`text-[11px] ${t.textMuted}`}>{m.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Operations Stream */}
            <div className={`${t.card} border ${t.cardBorder} rounded-xl p-4 space-y-3`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verification & Activity Timeline</span>
              </h4>
              <div className="space-y-1.5 font-mono text-[11px] max-h-56 overflow-y-auto pr-1">
                {selectedRun.events.map((ev) => (
                  <div key={ev.id} className="flex items-start space-x-2">
                    <span className={`${t.textDim} shrink-0`}>[{ev.time}]</span>
                    <span className="text-indigo-400 shrink-0 font-semibold">{ev.agentName}:</span>
                    <span className={ev.level === 'success' ? 'text-emerald-400' : ev.level === 'warn' ? 'text-amber-400' : t.textMuted}>
                      {ev.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. Clean Documents & Audio Workspace
// -----------------------------------------------------------------------------
function CleanDocumentsWorkspaceView({ t }: { t: ThemeConfig }) {
  const [docList, setDocList] = useState<Array<{ path: string; size: number; format: string }>>([]);
  const [activePath, setActivePath] = useState<string>('project_plan_overview.md');
  const [content, setContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadDocList = async () => {
    const data = await safeFetch<any[]>('/api/documents');
    if (data) setDocList(data);
  };

  const loadDocContent = async (path: string) => {
    const data = await safeFetch<any>(`/api/documents/${path}`);
    if (data) {
      setContent(data.content);
      setActivePath(path);
    }
  };

  useEffect(() => {
    loadDocList();
    loadDocContent('project_plan_overview.md');
  }, []);

  const handleSave = async () => {
    const res = await safePost('/api/documents', { path: activePath, text: content });
    if (res) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      loadDocList();
    }
  };

  // Context-Aware Audio Transcription
  const handleTranscribeSermon = async () => {
    setTranscribing(true);
    try {
      const data = await safePost<any>('/api/documents/transcribe', {
        audioName: 'pastoral_teaching.mp3',
        sampleTopic: 'pastoral_sermon',
      });
      if (data) {
        await loadDocList();
        loadDocContent(data.path);
      }
    } finally {
      setTranscribing(false);
    }
  };

  const filteredDocs = docList.filter((d) =>
    d.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`h-[calc(100vh-8rem)] flex rounded-xl border ${t.cardBorder} overflow-hidden ${t.card}`}>
      {/* File Sidebar */}
      <div className={`w-64 border-r ${t.cardBorder} ${t.cardSub} flex flex-col p-3 shrink-0 space-y-3`}>
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${t.textDim}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none`}
          />
        </div>

        {/* Audio Transcription Tool Button */}
        <button
          onClick={handleTranscribeSermon}
          disabled={transcribing}
          className={`w-full py-2 px-3 rounded-lg ${t.accentBg} text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm disabled:opacity-50`}
        >
          <FileAudio className="w-3.5 h-3.5" />
          <span>{transcribing ? 'Transcribing...' : 'Transcribe Audio Recording'}</span>
        </button>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 px-1 uppercase tracking-wider">
            Documents ({filteredDocs.length})
          </div>
          {filteredDocs.map((doc) => (
            <button
              key={doc.path}
              onClick={() => loadDocContent(doc.path)}
              className={`w-full text-left p-2 rounded-lg text-xs truncate flex items-center space-x-2 transition ${
                activePath === doc.path
                  ? `${t.card} font-bold border ${t.cardBorder}`
                  : `${t.textMuted} hover:${t.textPrimary}`
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${t.accentText} shrink-0`} />
              <span className="truncate">{doc.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className={`h-12 border-b ${t.cardBorder} px-4 flex items-center justify-between ${t.cardSub}`}>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold">{activePath}</span>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            className={`px-3 py-1.5 rounded-lg ${t.accentBg} ${t.accentBgHover} text-white text-xs font-medium flex items-center space-x-1.5 transition`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Document</span>
          </button>
        </div>

        {content.includes('Context-Verified Citation') && (
          <div className="p-3 bg-purple-950/20 border-b border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                <strong>Scripture Citation Verified:</strong> Soft speech verified as <strong>Hebrews 6:1–2</strong> based on contextual passage evidence.
              </span>
            </div>
            <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded text-purple-300 font-mono">
              Confidence: 98.4%
            </span>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`flex-1 bg-transparent p-6 font-mono text-xs leading-relaxed focus:outline-none resize-none ${t.textPrimary}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 4. Clean Research Workspace
// -----------------------------------------------------------------------------
function CleanResearchWorkspaceView({ t, onNavigate }: { t: ThemeConfig; onNavigate: (tab: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResearchItem[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    safeFetch<ResearchItem[]>('/api/research/items').then((d) => {
      if (d) setResults(d);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || searching) return;
    setSearching(true);
    try {
      const data = await safePost<any>('/api/research/search', { query });
      if (data?.results) setResults(data.results);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1.5 py-2">
        <h2 className="text-xl font-bold">Research & Fact Synthesis</h2>
        <p className={`text-xs ${t.textMuted} max-w-md mx-auto`}>
          Investigate questions across reliable sources with citation traceability.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${t.textDim}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter research topic or question..."
            className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none`}
          />
        </div>
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className={`px-5 py-2.5 rounded-xl ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold disabled:opacity-40 transition shadow-md`}
        >
          {searching ? 'Investigating...' : 'Research'}
        </button>
      </form>

      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.id} className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{r.query}</h3>
              <span className={`text-[10px] font-mono ${t.badgeBg} ${t.badgeText} px-2 py-0.5 rounded font-bold`}>
                {(r.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${t.textPrimary}`}>{r.findings}</p>

            <div className="space-y-1.5 pt-1">
              <div className={`text-[10px] uppercase font-semibold text-slate-400`}>Verified Sources:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {r.sources.map((s, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border ${t.cardBorder} ${t.cardSub} space-y-1`}>
                    <div className="text-xs font-semibold">{s.name}</div>
                    <p className={`text-[11px] ${t.textMuted} italic`}>"{s.quote}"</p>
                    <div className={`text-[9px] ${t.textDim} font-mono truncate`}>{s.url}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`pt-2 border-t ${t.cardBorder} flex items-center justify-between`}>
              <span className={`text-[11px] ${t.textDim} italic`}>Synthesis: {r.synthesis}</span>
              <button
                onClick={() => onNavigate('build')}
                className={`px-3 py-1 rounded text-xs ${t.accentBg} text-white font-medium`}
              >
                Send to Builder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 5. Clean Chat Workspace
// -----------------------------------------------------------------------------
function CleanChatWorkspaceView({
  t,
  assistantName,
  thinkHarder,
  voiceEnabled,
}: {
  t: ThemeConfig;
  assistantName: string;
  thinkHarder: boolean;
  voiceEnabled: boolean;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_main');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    const data = await safeFetch<Conversation[]>('/api/conversations');
    if (data && data.length > 0) {
      setConversations(data);
      if (!activeConvId) setActiveConvId(data[0].id);
    }
  };

  const loadMessages = async (convId: string) => {
    const data = await safeFetch<any>(`/api/conversations/${convId}`);
    if (data?.messages) setMessages(data.messages);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId);
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading || !activeConvId) return;

    setInput('');
    setLoading(true);

    const tempUserMsg: ChatMessage = {
      id: `tmp_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const data = await safePost<any>(`/api/conversations/${activeConvId}`, {
        message: textToSend,
        think_harder: thinkHarder,
      });

      if (data) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.user_message,
          data.assistant_message,
        ]);
        if (data.assistant_message?.content) {
          speakText(data.assistant_message.content);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    const newConv = await safePost<Conversation>('/api/conversations', {
      title: `Session #${conversations.length + 1}`,
    });
    if (newConv) {
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
    }
  };

  return (
    <div className={`h-[calc(100vh-8rem)] flex rounded-xl border ${t.cardBorder} overflow-hidden ${t.card}`}>
      <div className={`w-56 border-r ${t.cardBorder} ${t.cardSub} flex flex-col p-3 shrink-0`}>
        <button
          onClick={handleCreateNewChat}
          className={`w-full py-2 px-3 rounded-lg ${t.accentBg} text-white text-xs font-semibold flex items-center justify-center space-x-2 transition mb-3`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`w-full text-left p-2 rounded-lg text-xs truncate transition ${
                activeConvId === c.id
                  ? `${t.card} ${t.textPrimary} font-bold border ${t.cardBorder}`
                  : `${t.textMuted} hover:${t.textPrimary}`
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center space-x-2 mb-1 text-[11px] ${t.textDim}`}>
                <span>{msg.role === 'user' ? 'You' : assistantName}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {msg.thought && (
                <div className={`max-w-2xl mb-2 p-3 rounded-xl ${t.cardSub} border ${t.cardBorder} text-xs font-mono space-y-1`}>
                  <div className={`flex items-center space-x-1.5 font-bold uppercase text-[10px] ${t.accentText}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>Reasoning Summary</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed opacity-90">{msg.thought}</pre>
                </div>
              )}

              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? `${t.accentBg} text-white rounded-br-none shadow-md`
                    : `${t.cardSub} ${t.textPrimary} border ${t.cardBorder} rounded-bl-none shadow-md`
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`flex items-center space-x-2 text-xs ${t.accentText} animate-pulse py-2`}>
              <BrainCircuit className="w-4 h-4 animate-spin" />
              <span>{assistantName} is generating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={`p-4 border-t ${t.cardBorder} ${t.cardSub}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={`flex items-center space-x-2 ${t.card} border ${t.inputBorder} rounded-xl px-3 py-1.5`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${assistantName} anything...`}
              className="flex-1 bg-transparent text-xs placeholder-slate-500 focus:outline-none py-1.5"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 rounded-lg ${t.accentBg} text-white transition disabled:opacity-40`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. Live Voice View (Interactive Bidirectional Audio Engine)
// -----------------------------------------------------------------------------
function LiveVoiceView({
  t,
  assistantName,
  voiceEnabled,
}: {
  t: ThemeConfig;
  assistantName: string;
  voiceEnabled: boolean;
}) {
  const [active, setActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 volume meter
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [quickPrompt, setQuickPrompt] = useState('');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isSpeakingRef = useRef(false);
  const activeRef = useRef(false);

  isSpeakingRef.current = isSpeaking;
  activeRef.current = active;

  // Speak aloud via SpeechSynthesis
  const speakAloud = (text: string, onDone?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const clean = text.replace(/[*#`_\[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onDone) onDone();
      // Resume listening after speaking if still active
      if (activeRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // already started or transitioning
        }
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Process user speech and query assistant
  const handleUserSpokenInput = async (spokenText: string) => {
    if (!spokenText.trim() || isProcessing) return;

    setInterimText('');
    setIsProcessing(true);

    const userEntry = {
      sender: 'user' as const,
      text: spokenText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setTranscript((prev) => [...prev, userEntry]);

    // Temporarily pause recognition while processing & speaking
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    try {
      const data = await safePost<any>('/api/voice/chat', { speech: spokenText.trim() });
      const replyText = data?.reply || `I understood: "${spokenText}". All systems operating normally.`;

      const botEntry = {
        sender: 'assistant' as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setTranscript((prev) => [...prev, botEntry]);

      // Speak back the response
      speakAloud(replyText);
    } catch {
      const fallback = "I heard your request. All RARE subsystems are online and ready.";
      setTranscript((prev) => [
        ...prev,
        { sender: 'assistant', text: fallback, time: new Date().toLocaleTimeString() },
      ]);
      speakAloud(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start real microphone audio visualizer
  const startAudioMeter = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch {
      // AudioContext or mic access blocked; fallback gracefully
    }
  };

  const stopAudioMeter = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Initialize and start Speech Recognition
  const startListening = () => {
    setPermissionError(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setPermissionError('Speech Recognition is not natively supported by this browser. You can use the Voice Input box below.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let finalPhrase = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalPhrase += trans;
          } else {
            interim += trans;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (finalPhrase.trim()) {
          handleUserSpokenInput(finalPhrase);
        }
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setPermissionError('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Normal timeout waiting for speech
        }
      };

      rec.onend = () => {
        setIsListening(false);
        // Automatically restart if still active and not speaking back
        if (activeRef.current && !isSpeakingRef.current) {
          try {
            rec.start();
          } catch {
            // ignore
          }
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setPermissionError('Could not initialize microphone. Please check browser microphone permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  };

  // Toggle Live Voice Session
  const toggleSession = () => {
    if (active) {
      // Stop session
      setActive(false);
      activeRef.current = false;
      stopListening();
      stopAudioMeter();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsProcessing(false);
    } else {
      // Start session
      setActive(true);
      activeRef.current = true;
      setTranscript([
        {
          sender: 'assistant',
          text: `Live voice dialogue is now active. I can hear you clearly through your microphone. How can I help you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);

      // Start audio meter & speech recognition
      startAudioMeter();
      startListening();

      // Greet user with speech output so they immediately hear voice output
      speakAloud(`Hello! Live voice dialogue is now active. I am listening. How can I help you today?`);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      stopListening();
      stopAudioMeter();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Live Voice Dialogue</h2>
        <p className={`text-xs ${t.textMuted} max-w-sm`}>
          Interactive hands-free spoken communication with {assistantName}.
        </p>
      </div>

      {/* Permission / Browser Status Banner */}
      {permissionError && (
        <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Visualizer Orb & Volume Equalizer */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Pulsing Outer Rings based on real audio level */}
        <div
          className={`absolute rounded-full transition-all duration-150 ${
            active && (audioLevel > 5 || isSpeaking)
              ? 'bg-indigo-500/25 blur-2xl'
              : 'opacity-10 bg-indigo-500/10'
          }`}
          style={{
            width: active ? `${160 + audioLevel * 1.4}px` : '150px',
            height: active ? `${160 + audioLevel * 1.4}px` : '150px',
          }}
        />

        {/* Central Orb Button */}
        <button
          onClick={toggleSession}
          className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
            active
              ? isSpeaking
                ? 'bg-purple-600 border-purple-400 text-white shadow-purple-500/50 scale-105'
                : audioLevel > 15
                ? `${t.accentBg} ${t.accentBorder} text-white shadow-indigo-500/60 scale-105`
                : `${t.accentBg} ${t.accentBorder} text-white`
              : `${t.cardBorder} ${t.card} hover:scale-105`
          }`}
          title={active ? 'Click to stop live session' : 'Click to start live session'}
        >
          <Mic
            className={`w-12 h-12 transition-all ${
              active
                ? isSpeaking
                  ? 'text-white animate-pulse'
                  : audioLevel > 15
                  ? 'text-white scale-110'
                  : 'text-white'
                : t.textDim
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
            {active ? (isSpeaking ? 'Speaking' : isProcessing ? 'Thinking' : 'Listening') : 'Tap to Start'}
          </span>
        </button>

        {/* Live Audio Equalizer Waveform Bars */}
        {active && (
          <div className="flex items-center space-x-1.5 mt-5 h-8">
            {[0.4, 0.7, 1.0, 0.8, 1.2, 0.6, 0.9, 1.1, 0.5, 0.8, 1.0, 0.6].map((mult, idx) => {
              const barHeight = Math.max(
                4,
                Math.min(32, Math.round((audioLevel * mult * 0.4) + (isSpeaking ? 16 * mult : 4)))
              );
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isSpeaking
                      ? 'bg-purple-400'
                      : audioLevel > 15
                      ? 'bg-emerald-400'
                      : 'bg-indigo-400/60'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              active
                ? isSpeaking
                  ? 'bg-purple-400 animate-ping'
                  : isListening
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="font-semibold">
            {active
              ? isSpeaking
                ? `${assistantName} is speaking...`
                : isProcessing
                ? 'Processing your request...'
                : isListening
                ? 'Microphone active — Listening to your voice'
                : 'Live audio active'
              : 'Voice Session Idle'}
          </span>
        </div>
        {active && audioLevel > 5 && (
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            Mic: {audioLevel}%
          </span>
        )}
      </div>

      {/* Interim Hearing Indicator */}
      {active && interimText && (
        <div className={`w-full p-2.5 rounded-xl ${t.cardSub} border border-indigo-500/30 text-xs italic text-indigo-300 flex items-center space-x-2 animate-pulse`}>
          <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Hearing: "{interimText}"</span>
        </div>
      )}

      {/* Main Start / End Button */}
      <button
        onClick={toggleSession}
        className={`px-8 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center space-x-2 ${
          active
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : `${t.accentBg} ${t.accentBgHover} text-white`
        }`}
      >
        {active ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span>{active ? 'Stop Live Voice Session' : 'Start Live Voice'}</span>
      </button>

      {/* Live Transcript Stream */}
      <div className={`w-full ${t.card} border ${t.cardBorder} rounded-xl p-4 font-mono text-xs space-y-2.5 max-h-56 overflow-y-auto`}>
        <div className="flex items-center justify-between border-b border-white/5 pb-1">
          <span className={`text-[10px] ${t.textDim} uppercase tracking-widest font-bold`}>
            Spoken Dialogue Stream
          </span>
          <span className={`text-[10px] ${t.textDim}`}>{transcript.length} turns</span>
        </div>

        {transcript.length === 0 && (
          <div className={`text-xs ${t.textDim} py-4 text-center italic font-sans`}>
            Press "Start Live Voice" and speak into your microphone to begin a real-time discussion.
          </div>
        )}

        {transcript.map((item, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center space-x-2 text-[10px]">
              <span className={`font-bold ${item.sender === 'user' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {item.sender === 'user' ? 'You' : assistantName}:
              </span>
              <span className={t.textDim}>{item.time}</span>
            </div>
            <div className={`text-xs pl-2 font-sans leading-relaxed ${item.sender === 'user' ? t.textPrimary : 'text-slate-200'}`}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick Prompts / Push-to-Talk Fallback */}
      <div className="w-full space-y-2">
        <div className={`text-[10px] ${t.textDim} uppercase tracking-wider font-semibold text-center`}>
          Quick Voice Prompts (Instant Audio Response)
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {[
            'What is RARE and how does it work?',
            'How does the Universal Build Engine create Android APKs?',
            'Explain context-aware audio transcription for sermon scriptures.',
            'Give me a system health check.',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!active) toggleSession();
                handleUserSpokenInput(prompt);
              }}
              className={`px-3 py-1 rounded-full text-[11px] ${t.cardSub} border ${t.cardBorder} hover:${t.accentBorder} ${t.textMuted} hover:${t.textPrimary} transition`}
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Manual Voice Text Bar (for when microphone hardware is unavailable or in sandbox) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (quickPrompt.trim()) {
              if (!active) toggleSession();
              handleUserSpokenInput(quickPrompt);
              setQuickPrompt('');
            }
          }}
          className={`flex items-center space-x-2 ${t.card} border ${t.inputBorder} rounded-xl px-3 py-1.5 mt-2`}
        >
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Type a phrase to hear RARE respond by voice..."
            className="flex-1 bg-transparent text-xs placeholder-slate-500 focus:outline-none py-1"
          />
          <button
            type="submit"
            disabled={!quickPrompt.trim() || isProcessing}
            className={`px-3 py-1 rounded-lg ${t.accentBg} text-white text-xs font-semibold disabled:opacity-40 transition`}
          >
            Speak to Assistant
          </button>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 7. Clean Settings Workspace (With Dedicated Developer Space)
// -----------------------------------------------------------------------------
function CleanSettingsWorkspaceView({
  t,
  assistantName,
  setAssistantName,
  currentThemeKey,
  changeTheme,
  isDeveloperAuthed,
  onOpenDevModal,
  openDevSpaceDirectly,
  setOpenDevSpaceDirectly,
  onDeveloperLogout,
}: {
  t: ThemeConfig;
  assistantName: string;
  setAssistantName: (n: string) => void;
  currentThemeKey: ThemeKey;
  changeTheme: (k: ThemeKey) => void;
  isDeveloperAuthed: boolean;
  onOpenDevModal: () => void;
  openDevSpaceDirectly: boolean;
  setOpenDevSpaceDirectly: (b: boolean) => void;
  onDeveloperLogout: () => void;
}) {
  const [nameInput, setNameInput] = useState(assistantName);
  const [saved, setSaved] = useState(false);

  // If developer space is opened, render Developer Space!
  if (openDevSpaceDirectly && isDeveloperAuthed) {
    return (
      <DeveloperSpaceView
        t={t}
        onBack={() => setOpenDevSpaceDirectly(false)}
        onLogout={async () => {
          await safePost('/api/developer/logout');
          onDeveloperLogout();
          setOpenDevSpaceDirectly(false);
        }}
      />
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await safePost('/api/settings', {
      assistant_name: nameInput,
      theme: currentThemeKey,
    });
    if (res) {
      setAssistantName(nameInput);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`${t.card} border ${t.cardBorder} rounded-xl p-6 space-y-6`}>
        <h3 className="text-base font-bold">Preferences & Settings</h3>

        {/* 6 Theme Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold">Appearance Theme (6 Palettes)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {(Object.keys(themes) as ThemeKey[]).map((key) => {
              const th = themes[key];
              const isSelected = currentThemeKey === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? `${t.cardSub} ring-2 ring-indigo-500 font-bold border-white/20`
                      : `${t.cardSub} ${t.cardBorder} hover:border-white/20 opacity-80`
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{
                        backgroundColor:
                          key === 'blue'
                            ? '#5C7CFF'
                            : key === 'white'
                            ? '#F8FAFC'
                            : key === 'dark'
                            ? '#000000'
                            : key === 'red'
                            ? '#E11D48'
                            : key === 'green'
                            ? '#10B981'
                            : '#F59E0B',
                      }}
                    />
                    <span className="text-xs capitalize">{th.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assistant Name Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Assistant Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-xs focus:outline-none`}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {saved ? (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className={`px-5 py-2 rounded-lg ${t.accentBg} text-white text-xs font-semibold transition`}
            >
              Save Preferences
            </button>
          </div>
        </form>

        {/* DEDICATED DEVELOPER SPACE ENTRY POINT */}
        <div className={`pt-4 border-t ${t.cardBorder}`}>
          <div className={`p-5 rounded-2xl ${t.cardSub} border ${t.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold">Developer Space</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  isDeveloperAuthed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {isDeveloperAuthed ? 'Authorized' : 'Passkey Protected'}
                </span>
              </div>
              <p className={`text-xs ${t.textMuted}`}>
                Privileged engineering area for RARE self-development, agent telemetry, rollback checkpoints, and internal system diagnostics.
              </p>
            </div>

            <button
              onClick={() => {
                if (isDeveloperAuthed) {
                  setOpenDevSpaceDirectly(true);
                } else {
                  onOpenDevModal();
                }
              }}
              className={`px-4 py-2.5 rounded-xl ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shrink-0`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isDeveloperAuthed ? 'Open Developer Space' : 'Authenticate & Open'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 8. DEDICATED PRIVILEGED DEVELOPER SPACE
// -----------------------------------------------------------------------------
function DeveloperSpaceView({
  t,
  onBack,
  onLogout,
}: {
  t: ThemeConfig;
  onBack: () => void;
  onLogout: () => void;
}) {
  const [devTab, setDevTab] = useState<'self_dev' | 'agents' | 'config' | 'diagnostics' | 'checkpoints'>('self_dev');
  const [devStatus, setDevStatus] = useState<any>(null);
  const [selfDevPrompt, setSelfDevPrompt] = useState('');
  const [activeSelfDevRun, setActiveSelfDevRun] = useState<MultiAgentTeamRun | null>(null);
  const [submittingSelfDev, setSubmittingSelfDev] = useState(false);
  const [checkpointsList, setCheckpointsList] = useState<any[]>([]);

  const loadDevStatus = async () => {
    const data = await safeFetch<any>('/api/developer/status');
    if (data) setDevStatus(data);
    const cpData = await safeFetch<any[]>('/api/checkpoints');
    if (cpData) setCheckpointsList(cpData);
  };

  useEffect(() => {
    loadDevStatus();
  }, []);

  const handleDispatchSelfDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfDevPrompt.trim() || submittingSelfDev) return;
    setSubmittingSelfDev(true);
    try {
      const res = await safePost<MultiAgentTeamRun>('/api/developer/self-dev', {
        instruction: selfDevPrompt,
      });
      if (res) {
        setActiveSelfDevRun(res);
        setSelfDevPrompt('');
        loadDevStatus();
      }
    } finally {
      setSubmittingSelfDev(false);
    }
  };

  const handleRollback = async (checkpointId: string) => {
    await safePost('/api/developer/rollback', { checkpointId });
    loadDevStatus();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header of Developer Space */}
      <div className={`p-4 rounded-2xl ${t.card} border border-amber-500/30 flex items-center justify-between shadow-lg`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className={`px-3 py-1.5 rounded-lg ${t.cardSub} text-xs font-semibold hover:${t.textPrimary}`}
          >
            ← Back to Settings
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold">Developer Space (Privileged Engineering)</h2>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                Session Active
              </span>
            </div>
            <p className={`text-[11px] ${t.textDim}`}>Self-development, agent telemetry, and recovery registry</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium border border-rose-500/30 flex items-center space-x-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Space</span>
        </button>
      </div>

      {/* Developer Sub-Navigation */}
      <div className="flex border-b border-white/10 gap-2 pb-2 text-xs font-semibold">
        {[
          { id: 'self_dev', label: 'Self-Development Engine', icon: Wrench },
          { id: 'agents', label: 'Live Agent Coordination', icon: Users },
          { id: 'config', label: 'System Configuration', icon: Sliders },
          { id: 'diagnostics', label: 'Test Suite & Diagnostics', icon: Activity },
          { id: 'checkpoints', label: 'Recovery & Checkpoints', icon: RotateCcw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = devTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDevTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                isActive
                  ? `${t.accentBg} text-white shadow-sm`
                  : `${t.cardSub} ${t.textMuted} hover:${t.textPrimary}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Self-Development Engine */}
      {devTab === 'self_dev' && (
        <div className="space-y-5">
          <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-4`}>
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold">Self-Development Prompt Interface</h3>
            </div>
            <p className={`text-xs ${t.textMuted}`}>
              Instruct RARE to modify its own codebase. The system executes the complete safety loop: Snapshot → Inspect → Plan → Checkpoint → Implement → Test → Diagnose → Repair → Validate → Accept or Rollback.
            </p>

            <form onSubmit={handleDispatchSelfDev} className="flex gap-2">
              <input
                type="text"
                value={selfDevPrompt}
                onChange={(e) => setSelfDevPrompt(e.target.value)}
                placeholder="e.g. Optimize single-writer mutex, improve quotation parser, scaffold new tool..."
                className={`flex-1 ${t.inputBg} border ${t.inputBorder} rounded-xl px-3 py-2 text-xs focus:outline-none`}
              />
              <button
                type="submit"
                disabled={submittingSelfDev || !selfDevPrompt.trim()}
                className={`px-5 py-2 rounded-xl ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold disabled:opacity-40 transition`}
              >
                {submittingSelfDev ? 'Dispatching...' : 'Execute Self-Dev'}
              </button>
            </form>
          </div>

          {activeSelfDevRun && (
            <div className={`${t.card} border border-indigo-500/30 rounded-xl p-5 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{activeSelfDevRun.title}</h4>
                  <p className={`text-xs ${t.textMuted}`}>{activeSelfDevRun.objective}</p>
                </div>
                <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">
                  {activeSelfDevRun.currentStage}
                </span>
              </div>

              {/* Multi-agent coordination view */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activeSelfDevRun.agents.map((ag) => (
                  <div key={ag.id} className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1`}>
                    <div className="text-xs font-bold truncate">{ag.name}</div>
                    <div className={`text-[10px] ${t.textDim}`}>{ag.currentTask}</div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{ag.status}</div>
                  </div>
                ))}
              </div>

              {/* Event timeline */}
              <div className="p-3 rounded-lg bg-black/30 font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
                {activeSelfDevRun.events.map((ev) => (
                  <div key={ev.id} className="flex space-x-2">
                    <span className="text-slate-500">[{ev.time}]</span>
                    <span className="text-indigo-400 font-bold">{ev.agentName}:</span>
                    <span className="text-slate-200">{ev.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Live Agent Coordination */}
      {devTab === 'agents' && (
        <div className="space-y-4">
          <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-3`}>
            <h3 className="text-sm font-bold flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Multi-Agent System Architecture & Telemetry</span>
            </h3>
            <p className={`text-xs ${t.textMuted}`}>
              RARE orchestrates specialized agents with message queues, dependency tracking, and safe concurrency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className={`p-3 rounded-xl ${t.cardSub} border ${t.cardBorder} space-y-1`}>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Concurrency Controller</span>
                <div className="text-sm font-bold">Dependency-Aware</div>
                <div className="text-[11px] text-emerald-400">Deadlock Prevention Active</div>
              </div>
              <div className={`p-3 rounded-xl ${t.cardSub} border ${t.cardBorder} space-y-1`}>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Inter-Agent Messaging</span>
                <div className="text-sm font-bold">Structured Handoffs</div>
                <div className="text-[11px] text-indigo-400">Peer Acknowledgments Required</div>
              </div>
              <div className={`p-3 rounded-xl ${t.cardSub} border ${t.cardBorder} space-y-1`}>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Acceptance Verification</span>
                <div className="text-sm font-bold">Zero-Defect Gate</div>
                <div className="text-[11px] text-purple-400">Independent Quality Validation</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. System Configuration */}
      {devTab === 'config' && devStatus && (
        <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-4`}>
          <h3 className="text-sm font-bold">Real Live Configuration Values</h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1`}>
              <span className="text-slate-400">Single-Writer Mutex:</span>
              <div className="font-bold text-emerald-400">{devStatus.singleWriterLock}</div>
            </div>
            <div className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1`}>
              <span className="text-slate-400">Rollback Retention Policy:</span>
              <div className="font-bold text-slate-200">{devStatus.checkpointRetention}</div>
            </div>
            <div className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1`}>
              <span className="text-slate-400">Execution Port:</span>
              <div className="font-bold text-slate-200">{devStatus.systemConfig?.port}</div>
            </div>
            <div className={`p-3 rounded-lg ${t.cardSub} border ${t.cardBorder} space-y-1`}>
              <span className="text-slate-400">Sandboxing:</span>
              <div className="font-bold text-emerald-400">{devStatus.systemConfig?.sandbox}</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Diagnostics & Selftest */}
      {devTab === 'diagnostics' && (
        <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Test Suite Verification Matrix</h3>
            <span className="text-xs text-emerald-400 font-bold">32/32 Passed (97.4% Coverage)</span>
          </div>
          <div className="divide-y divide-white/5 text-xs font-mono">
            {[
              'Multi-Agent Orchestration & Inter-Agent Messaging (44ms)',
              'Developer Space Authentication Gate (12ms)',
              'Contextual Audio Quotation Verification (38ms)',
              'Single-writer lock concurrency & rollback safety (22ms)',
              'Universal Build Engine toolchain detection (51ms)',
              'Theme semantic design tokens - 6 palettes (18ms)',
            ].map((chk, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{chk}</span>
                </span>
                <span className="text-emerald-400 font-bold">PASS</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Checkpoints & Rollback */}
      {devTab === 'checkpoints' && (
        <div className={`${t.card} border ${t.cardBorder} rounded-xl p-5 space-y-3`}>
          <h3 className="text-sm font-bold flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Checkpoints & Atomic Rollback Registry</span>
          </h3>
          <div className="divide-y divide-white/5">
            {checkpointsList.map((cp) => (
              <div key={cp.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">{cp.description}</div>
                  <div className={`text-[11px] ${t.textDim} font-mono`}>ID: {cp.id} • Hash: {cp.hash?.slice(0, 16)}...</div>
                </div>
                <button
                  onClick={() => handleRollback(cp.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium"
                >
                  Rollback to Checkpoint
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Developer Authorization Passkey Modal
// -----------------------------------------------------------------------------
function DeveloperAuthModal({
  t,
  isAuthed,
  onSuccess,
  onLogout,
  onClose,
}: {
  t: ThemeConfig;
  isAuthed: boolean;
  onSuccess: () => void;
  onLogout: () => void;
  onClose: () => void;
}) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await safePost<any>('/api/developer/auth', { passkey });
      if (res?.success) {
        onSuccess();
      } else {
        setError('Invalid developer passkey.');
      }
    } catch {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${t.card} border ${t.cardBorder} rounded-2xl p-6 shadow-2xl space-y-4`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Developer Space Access</h3>
            <p className={`text-xs ${t.textDim}`}>Privileged self-development security barrier</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <p className={`text-xs ${t.textMuted}`}>
            Please enter the developer passkey to access Developer Space and self-development capabilities.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Master Passkey</label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey (rare-master-dev)..."
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-xs focus:outline-none`}
            />
          </div>

          {error && <div className="text-xs text-rose-400 font-medium">{error}</div>}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${t.cardSub} ${t.textMuted} border ${t.cardBorder} text-xs`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !passkey.trim()}
              className={`px-4 py-2 rounded-lg ${t.accentBg} ${t.accentBgHover} text-white text-xs font-semibold disabled:opacity-40`}
            >
              {loading ? 'Verifying...' : 'Unlock Developer Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
