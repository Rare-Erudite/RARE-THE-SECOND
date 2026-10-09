import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Terminal,
  Hammer,
  FileText,
  Compass,
  Mic,
  MicOff,
  Cpu,
  Sliders,
  Settings as SettingsIcon,
  ShieldCheck,
  Play,
  RotateCcw,
  Plus,
  Send,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Folder,
  Layers,
  Laptop,
  Smartphone,
  Trash2,
  Save,
  BrainCircuit,
  Maximize2
} from 'lucide-react';

// Types
interface TaskItem {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
  risk_level: string;
  updated_at: string;
  requested_by: string;
  plan?: {
    steps: string[];
    risk: string;
    files: string[];
  };
}

interface BuilderRun {
  id: string;
  description: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  priority: string;
  created_at: string;
  toolchain: string;
  events: Array<{ time: string; level: string; message: string }>;
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

interface MemoryItem {
  id: string;
  kind: string;
  text: string;
  tags: string[];
  importance: number;
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [health, setHealth] = useState<any>(null);
  const [assistantName, setAssistantName] = useState('RARE');
  const [autonomyLevel, setAutonomyLevel] = useState(2);
  const [thinkHarder, setThinkHarder] = useState(false);
  const [themeAccent, setThemeAccent] = useState<'blue' | 'purple' | 'pink' | 'green'>('blue');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Fetch initial health and settings
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        if (data.assistant_name) setAssistantName(data.assistant_name);
        if (data.autonomy) setAutonomyLevel(data.autonomy);
      }
    } catch (e) {
      console.error('Error fetching health:', e);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Command Center', icon: Activity },
    { id: 'chat', label: 'Chat / Ask', icon: Terminal },
    { id: 'build', label: 'Projects / Build', icon: Hammer },
    { id: 'docs', label: 'Documents', icon: FileText },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'live', label: 'Live Voice', icon: Mic },
    { id: 'memory', label: 'Memory', icon: Cpu },
    { id: 'control', label: 'Tools / Control', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getAccentColor = () => {
    switch (themeAccent) {
      case 'purple':
        return 'from-purple-600 to-indigo-600 text-purple-400 border-purple-500/30';
      case 'pink':
        return 'from-pink-600 to-rose-600 text-pink-400 border-pink-500/30';
      case 'green':
        return 'from-emerald-600 to-teal-600 text-emerald-400 border-emerald-500/30';
      default:
        return 'from-indigo-600 to-blue-600 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#03040A] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A0D19] border-r border-white/5 flex flex-col justify-between select-none shrink-0">
        <div>
          {/* Logo / Branding */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-lg tracking-widest text-white">{assistantName}</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                    045
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Personal AI Core</div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/10 text-white border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Core Telemetry */}
        <div className="p-4 border-t border-white/5 bg-[#070913]">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Core Online</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Autonomy L{autonomyLevel}</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Provider: {health?.providers?.active === 'gemini' ? 'Gemini 2.5' : 'Deterministic Core'}
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#03040A]">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-white/5 bg-[#0A0D19]/80 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-semibold tracking-wide text-slate-200">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">RARE v0.45.0 Environment</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Think Harder Toggle */}
            <button
              onClick={() => setThinkHarder(!thinkHarder)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs transition-all border ${
                thinkHarder
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20'
                  : 'bg-white/[0.02] text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Think Harder</span>
            </button>

            {/* Voice Mute/Active Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? 'Voice output enabled' : 'Voice output muted'}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Subsystem Health badge */}
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guards Active</span>
            </div>
          </div>
        </header>

        {/* View Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'home' && (
            <CommandCenterView
              onNavigate={setActiveTab}
              autonomyLevel={autonomyLevel}
              assistantName={assistantName}
            />
          )}
          {activeTab === 'chat' && (
            <ChatWorkspaceView
              assistantName={assistantName}
              thinkHarder={thinkHarder}
              voiceEnabled={voiceEnabled}
            />
          )}
          {activeTab === 'build' && <BuildWorkspaceView />}
          {activeTab === 'docs' && <DocumentsWorkspaceView />}
          {activeTab === 'research' && <ResearchWorkspaceView />}
          {activeTab === 'live' && (
            <LiveVoiceView
              assistantName={assistantName}
              voiceEnabled={voiceEnabled}
            />
          )}
          {activeTab === 'memory' && <MemoryWorkspaceView />}
          {activeTab === 'control' && <ControlToolsView />}
          {activeTab === 'settings' && (
            <SettingsWorkspaceView
              assistantName={assistantName}
              setAssistantName={setAssistantName}
              autonomyLevel={autonomyLevel}
              setAutonomyLevel={setAutonomyLevel}
              themeAccent={themeAccent}
              setThemeAccent={setThemeAccent}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 1. Command Center View
// -----------------------------------------------------------------------------
function CommandCenterView({
  onNavigate,
  autonomyLevel,
  assistantName,
}: {
  onNavigate: (tab: string) => void;
  autonomyLevel: number;
  assistantName: string;
}) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [builderRuns, setBuilderRuns] = useState<BuilderRun[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [tRes, bRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/builder'),
      ]);
      if (tRes.ok) setTasks(await tRes.json());
      if (bRes.ok) setBuilderRuns(await bRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRollback = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/rollback`, { method: 'POST' });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101427] to-[#0A0D19] border border-white/10 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Protected Self-Building Subsystem</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {assistantName} Command Center
            </h2>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              Real-time monitoring, development pipelines, toolchain environments, and autonomous repair controls.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Chat</span>
            </button>
            <button
              onClick={() => onNavigate('build')}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-medium flex items-center space-x-2 border border-white/10 transition"
            >
              <Hammer className="w-4 h-4" />
              <span>Projects / Build</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Development Tasks</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{tasks.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Integrity verified</span>
          </div>
        </div>

        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Build Pipeline</span>
            <Hammer className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{builderRuns.length} Runs</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Node 22 / TS 5.7</div>
        </div>

        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Autonomy Policy</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">Level {autonomyLevel}</div>
          <div className="text-[11px] text-cyan-400 mt-1">Supervised Execution</div>
        </div>

        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Safety State</span>
            <RotateCcw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">Checkpoints OK</div>
          <div className="text-[11px] text-emerald-400 mt-1">Rollback ready</div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Active Development Pipeline</h3>
          </div>
          <button
            onClick={() => onNavigate('build')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Manage Builds →
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {tasks.map((task) => (
            <div key={task.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-200">{task.description}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-semibold ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : task.status === 'rolled_back'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Risk: {task.risk_level}</span>
                </div>
                {task.plan && (
                  <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                    <span>Plan: {task.plan.steps.join(' → ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {task.status !== 'rolled_back' && (
                  <button
                    onClick={() => handleRollback(task.id)}
                    className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs border border-white/5 transition flex items-center space-x-1"
                    title="Safely revert this change"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rollback</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subsystem Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Single-Writer Queue</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Exclusive write lock protects state files and git workspace checkpoints from race conditions.
          </p>
          <div className="text-[10px] text-emerald-400 font-mono">STATUS: MUTEX ACQUIRED & SAFE</div>
        </div>

        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Capability Sandboxing</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Conversation, Device, and Document capability layers are bound to isolated execution frames.
          </p>
          <div className="text-[10px] text-indigo-400 font-mono">ACTIVE: 3 CAPABILITIES MOUNTED</div>
        </div>

        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Device Bridge</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Local loopback authenticated via bearer token. Remote peer routing available for paired nodes.
          </p>
          <div className="text-[10px] text-cyan-400 font-mono">HOST: PORT 3000 ACCESSIBLE</div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. Chat / Ask Workspace View
// -----------------------------------------------------------------------------
function ChatWorkspaceView({
  assistantName,
  thinkHarder,
  voiceEnabled,
}: {
  assistantName: string;
  thinkHarder: boolean;
  voiceEnabled: boolean;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_main');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConvId) {
          setActiveConvId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
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
      const res = await fetch(`/api/conversations/${activeConvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          think_harder: thinkHarder,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.user_message,
          data.assistant_message,
        ]);
        if (data.assistant_message?.content) {
          speakText(data.assistant_message.content);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Session #${conversations.length + 1}` }),
      });
      if (res.ok) {
        const newConv = await res.json();
        setConversations((prev) => [newConv, ...prev]);
        setActiveConvId(newConv.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Browser Web Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl border border-white/5 overflow-hidden bg-[#0A0D19]">
      {/* Session List Sidebar */}
      <div className="w-56 border-r border-white/5 bg-[#070913] flex flex-col p-3 shrink-0">
        <button
          onClick={handleCreateNewChat}
          className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium flex items-center justify-center space-x-2 border border-indigo-500/30 transition mb-3"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs truncate transition ${
                activeConvId === c.id
                  ? 'bg-white/[0.08] text-white font-medium border border-white/10'
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0D19]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-500">
                <span>{msg.role === 'user' ? 'You' : assistantName}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Expandable Thought Bubble if present */}
              {msg.thought && (
                <div className="max-w-2xl mb-2 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-300 text-xs font-mono space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold uppercase text-[10px] text-purple-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Deep Reasoning Trace</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed opacity-90">{msg.thought}</pre>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                    : 'bg-[#101427] text-slate-200 border border-white/10 rounded-bl-none shadow-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-400 animate-pulse py-2">
              <BrainCircuit className="w-4 h-4 animate-spin" />
              <span>{assistantName} is formulating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-6 py-2 border-t border-white/5 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('Explain RARE architecture and single-writer locks.')}
            className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/5 shrink-0 transition"
          >
            Explain architecture
          </button>
          <button
            onClick={() => handleSend('Run system selftest diagnostics.')}
            className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/5 shrink-0 transition"
          >
            Run selftest
          </button>
          <button
            onClick={() => handleSend('What is the current builder toolchain status?')}
            className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/5 shrink-0 transition"
          >
            Toolchain status
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/5 bg-[#080B15]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 bg-[#101427] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-indigo-500/50 transition"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-lg transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${assistantName} anything, or enter build/repair commands...`}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1.5"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition shadow-sm"
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
// 3. Projects / Build Workspace View
// -----------------------------------------------------------------------------
function BuildWorkspaceView() {
  const [runs, setRuns] = useState<BuilderRun[]>([]);
  const [toolchains, setToolchains] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<BuilderRun | null>(null);
  const [newDesc, setNewDesc] = useState('');
  const [newToolchain, setNewToolchain] = useState('typescript');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [rRes, tRes] = await Promise.all([
        fetch('/api/builder'),
        fetch('/api/builder/toolchains'),
      ]);
      if (rRes.ok) {
        const data = await rRes.json();
        setRuns(data);
        if (data.length > 0 && !selectedRun) setSelectedRun(data[0]);
      }
      if (tRes.ok) setToolchains(await tRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDesc, toolchain: newToolchain }),
      });
      if (res.ok) {
        setNewDesc('');
        loadData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await fetch(`/api/builder/${id}/cancel`, { method: 'POST' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toolchains Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {toolchains.map((tc, idx) => (
          <div key={idx} className="bg-[#0A0D19] border border-white/5 rounded-xl p-4">
            <div className="text-[11px] text-slate-400 uppercase font-mono">{tc.status}</div>
            <div className="text-sm font-semibold text-white mt-1">{tc.name}</div>
            <div className="text-xs text-indigo-400 mt-0.5">{tc.version}</div>
          </div>
        ))}
      </div>

      {/* New Build Submission Box */}
      <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Hammer className="w-4 h-4 text-indigo-400" />
          <span>Submit Builder Task</span>
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="e.g. Scaffold new document indexing capability or compile build artifact..."
            className="flex-1 bg-[#101427] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={newToolchain}
            onChange={(e) => setNewToolchain(e.target.value)}
            className="bg-[#101427] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="typescript">TypeScript & Node 22</option>
            <option value="capability_scaffold">Capability Registry</option>
            <option value="vite_bundler">Vite Production Bundle</option>
          </select>
          <button
            type="submit"
            disabled={submitting || !newDesc.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium disabled:opacity-40 transition"
          >
            {submitting ? 'Submitting...' : 'Dispatch Job'}
          </button>
        </form>
      </div>

      {/* History and Details Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runs List */}
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Build Execution Runs ({runs.length})
          </h4>
          <div className="space-y-2">
            {runs.map((run) => (
              <div
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className={`p-3 rounded-lg border transition cursor-pointer ${
                  selectedRun?.id === run.id
                    ? 'bg-[#101427] border-indigo-500/40'
                    : 'bg-[#080B15] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">{run.description}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                      run.status === 'succeeded'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : run.status === 'running'
                        ? 'bg-indigo-500/10 text-indigo-400 animate-pulse'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono flex items-center justify-between">
                  <span>Toolchain: {run.toolchain}</span>
                  <span>{new Date(run.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Run Logs / Event Stream */}
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {selectedRun ? `Logs for ${selectedRun.id}` : 'Execution Stream'}
            </h4>
            {selectedRun?.status === 'running' && (
              <button
                onClick={() => handleCancel(selectedRun.id)}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Cancel Run
              </button>
            )}
          </div>

          <div className="flex-1 bg-[#050711] border border-white/5 rounded-lg p-3 font-mono text-[11px] overflow-y-auto space-y-1.5 min-h-[220px]">
            {selectedRun?.events?.map((ev, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-slate-600 shrink-0">[{ev.time}]</span>
                <span
                  className={
                    ev.level === 'success'
                      ? 'text-emerald-400'
                      : ev.level === 'warn'
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }
                >
                  {ev.message}
                </span>
              </div>
            )) || <span className="text-slate-600">Select a run to view execution stream logs.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 4. Documents Workspace View
// -----------------------------------------------------------------------------
function DocumentsWorkspaceView() {
  const [docList, setDocList] = useState<Array<{ path: string; size: number }>>([]);
  const [activePath, setActivePath] = useState<string>('docs/ARCHITECTURE.md');
  const [content, setContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadDocList = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) setDocList(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadDocContent = async (path: string) => {
    try {
      const res = await fetch(`/api/documents/${path}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setActivePath(path);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDocList();
    loadDocContent('docs/ARCHITECTURE.md');
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: activePath, text: content }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        loadDocList();
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredDocs = docList.filter((d) =>
    d.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl border border-white/5 overflow-hidden bg-[#0A0D19]">
      {/* File Tree Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#070913] flex flex-col p-3 shrink-0">
        <div className="mb-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search docs..."
            className="w-full bg-[#101427] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredDocs.map((doc) => (
            <button
              key={doc.path}
              onClick={() => loadDocContent(doc.path)}
              className={`w-full text-left p-2.5 rounded-lg text-xs truncate flex items-center space-x-2 transition ${
                activePath === doc.path
                  ? 'bg-white/[0.08] text-white font-medium border border-white/10'
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{doc.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0D19]">
        <div className="h-12 border-b border-white/5 px-4 flex items-center justify-between bg-[#080B15]">
          <span className="text-xs font-mono text-slate-300">{activePath}</span>
          <div className="flex items-center space-x-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1.5 transition disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save File'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-[#050711] text-slate-200 p-6 font-mono text-xs leading-relaxed focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 5. Research Workspace View
// -----------------------------------------------------------------------------
function ResearchWorkspaceView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || searching) return;
    setSearching(true);
    try {
      const res = await fetch('/api/research/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-xl font-bold text-white">RARE Knowledge & Research Engine</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Query indexed architectural references, safety guarantees, capability interfaces, and engineering specifications.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search architectural topics (e.g. rollback, single-writer lock, capability isolation)..."
            className="w-full bg-[#101427] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium disabled:opacity-40 transition"
        >
          {searching ? 'Querying...' : 'Search Engine'}
        </button>
      </form>

      {/* Results Feed */}
      <div className="space-y-4">
        {results.map((r, i) => (
          <div key={i} className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-indigo-300">{r.title}</h3>
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                {(r.confidence * 100).toFixed(0)}% match
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{r.snippet}</p>
            <div className="text-[11px] text-slate-500 font-mono">Source: {r.source}</div>
          </div>
        ))}

        {results.length === 0 && !searching && (
          <div className="text-center py-12 text-slate-500 text-xs">
            Enter a search topic above to analyze RARE engineering specifications.
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. Live Voice Conversation View
// -----------------------------------------------------------------------------
function LiveVoiceView({
  assistantName,
  voiceEnabled,
}: {
  assistantName: string;
  voiceEnabled: boolean;
}) {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const toggleSession = () => {
    setActive(!active);
    if (!active) {
      setTranscript((prev) => [
        ...prev,
        `${assistantName}: Live voice session active. Speak your command or query.`,
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Live Voice Dialogue</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Hands-free natural speech interface powered by RARE neural reasoning loop.
        </p>
      </div>

      {/* Audio Visualizer Orb */}
      <div className="relative flex items-center justify-center w-48 h-48">
        <div
          className={`absolute inset-0 rounded-full bg-indigo-500/20 blur-xl transition-all duration-700 ${
            active ? 'scale-125 animate-pulse' : 'scale-75 opacity-30'
          }`}
        />
        <div
          className={`w-36 h-36 rounded-full border-2 flex items-center justify-center transition-all ${
            active
              ? 'border-indigo-400 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 shadow-2xl shadow-indigo-500/40'
              : 'border-white/10 bg-[#0A0D19]'
          }`}
        >
          <Mic
            className={`w-12 h-12 transition ${
              active ? 'text-indigo-300 animate-bounce' : 'text-slate-600'
            }`}
          />
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSession}
        className={`px-8 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-lg ${
          active
            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
        }`}
      >
        {active ? 'Terminate Live Session' : 'Initiate Live Voice'}
      </button>

      {/* Live Transcript Log */}
      <div className="w-full bg-[#0A0D19] border border-white/5 rounded-xl p-4 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
          Realtime Transcript Stream
        </div>
        {transcript.map((line, i) => (
          <div key={i} className="text-slate-300">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 7. Memory Workspace View
// -----------------------------------------------------------------------------
function MemoryWorkspaceView() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [newText, setNewText] = useState('');
  const [newKind, setNewKind] = useState('preference');
  const [newImportance, setNewImportance] = useState(2);
  const [search, setSearch] = useState('');

  const loadMemories = async () => {
    try {
      const url = search ? `/api/user-memory?query=${encodeURIComponent(search)}` : '/api/user-memory';
      const res = await fetch(url);
      if (res.ok) setMemories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      const res = await fetch('/api/user-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: newKind,
          text: newText,
          importance: newImportance,
          tags: [newKind],
        }),
      });
      if (res.ok) {
        setNewText('');
        loadMemories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleForget = async (id: string) => {
    try {
      const res = await fetch('/api/user-memory/forget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) loadMemories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search & Add Header */}
      <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Add User Memory Record</span>
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Record persistent preference, fact, or project rule..."
            className="w-full bg-[#101427] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value)}
                className="bg-[#101427] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="preference">Preference</option>
                <option value="architecture">Architecture</option>
                <option value="fact">Fact</option>
                <option value="constraint">Constraint</option>
              </select>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Importance:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newImportance}
                  onChange={(e) => setNewImportance(Number(e.target.value))}
                  className="accent-indigo-500 w-20"
                />
                <span className="font-mono text-white">{newImportance}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newText.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium disabled:opacity-40 transition"
            >
              Commit Memory
            </button>
          </div>
        </form>
      </div>

      {/* Filter and List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Indexed Memories ({memories.length})
          </h4>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter memories..."
            className="bg-[#0A0D19] border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none"
          />
        </div>

        <div className="space-y-2.5">
          {memories.map((m) => (
            <div
              key={m.id}
              className="bg-[#0A0D19] border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                    {m.kind}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Priority: {m.importance}/5
                  </span>
                </div>
                <p className="text-xs text-slate-200">{m.text}</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  {m.tags.map((t, i) => (
                    <span key={i}>#{t}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleForget(m.id)}
                className="p-1.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                title="Forget memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 8. Tools / Control Center View
// -----------------------------------------------------------------------------
function ControlToolsView() {
  const [tools, setTools] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [runningTool, setRunningTool] = useState<string | null>(null);
  const [toolOutput, setToolOutput] = useState<any>(null);

  const loadData = async () => {
    try {
      const [tRes, dRes] = await Promise.all([
        fetch('/api/tools'),
        fetch('/api/devices'),
      ]);
      if (tRes.ok) setTools(await tRes.json());
      if (dRes.ok) setDevices(await dRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunTool = async (name: string) => {
    setRunningTool(name);
    try {
      const res = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setToolOutput(await res.json());
      }
    } finally {
      setRunningTool(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Device Bridge Panel */}
      <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Laptop className="w-4 h-4 text-cyan-400" />
          <span>Device Bridge & Paired Peers</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {devices.map((d) => (
            <div key={d.id} className="bg-[#101427] border border-white/5 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">{d.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{d.url}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-emerald-500/10 text-emerald-400">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Builtin Tools Execution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Builtin System Tools</span>
          </h3>
          <div className="space-y-2">
            {tools.map((t) => (
              <div
                key={t.name}
                className="bg-[#101427] border border-white/5 rounded-lg p-3 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{t.name}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{t.description}</div>
                </div>
                <button
                  onClick={() => handleRunTool(t.name)}
                  disabled={runningTool === t.name}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shrink-0 disabled:opacity-40 transition"
                >
                  {runningTool === t.name ? 'Running...' : 'Execute'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Output */}
        <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-5 flex flex-col space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Execution Output</span>
          </h3>
          <div className="flex-1 bg-[#050711] border border-white/5 rounded-lg p-4 font-mono text-xs overflow-y-auto min-h-[260px] text-emerald-400">
            {toolOutput ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(toolOutput, null, 2)}</pre>
            ) : (
              <span className="text-slate-600">Click "Execute" on any tool above to view live execution logs.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 9. Settings Workspace View
// -----------------------------------------------------------------------------
function SettingsWorkspaceView({
  assistantName,
  setAssistantName,
  autonomyLevel,
  setAutonomyLevel,
  themeAccent,
  setThemeAccent,
}: {
  assistantName: string;
  setAssistantName: (n: string) => void;
  autonomyLevel: number;
  setAutonomyLevel: (l: number) => void;
  themeAccent: 'blue' | 'purple' | 'pink' | 'green';
  setThemeAccent: (a: any) => void;
}) {
  const [nameInput, setNameInput] = useState(assistantName);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistant_name: nameInput,
          autonomy_level: autonomyLevel,
        }),
      });
      if (res.ok) {
        setAssistantName(nameInput);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#0A0D19] border border-white/5 rounded-xl p-6 space-y-6">
        <h3 className="text-base font-semibold text-white">RARE System Configuration</h3>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Assistant Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Assistant Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#101427] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500">Default is RARE. Customizable per workspace preference.</p>
          </div>

          {/* Autonomy Level Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Autonomy Guardrail Level</label>
              <span className="font-mono text-indigo-400 font-bold">Level {autonomyLevel}</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={autonomyLevel}
              onChange={(e) => setAutonomyLevel(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>L1: Observe Only</span>
              <span>L2: Supervised Mode</span>
              <span>L3: Autonomous Repair</span>
            </div>
          </div>

          {/* Theme Accent */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">UI Accent Theme</label>
            <div className="flex gap-3">
              {(['blue', 'purple', 'pink', 'green'] as const).map((accent) => (
                <button
                  type="button"
                  key={accent}
                  onClick={() => setThemeAccent(accent)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition ${
                    themeAccent === accent
                      ? 'bg-white/10 text-white border-white/30 font-medium'
                      : 'bg-white/[0.02] text-slate-400 border-white/5 hover:text-slate-200'
                  }`}
                >
                  {accent}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuration synchronized</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
