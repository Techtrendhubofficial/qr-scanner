import React, { useState, useEffect, useRef } from 'react';
import { NoteItem, NoteAttachment } from '../types';
import { 
  Sparkles, 
  Camera, 
  Image as ImageIcon, 
  Paperclip, 
  Trash2, 
  Plus, 
  Save, 
  Share2, 
  Download, 
  Pin, 
  Search, 
  FileText, 
  CheckSquare, 
  Wand2, 
  Languages, 
  ListOrdered, 
  List, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Quote, 
  Code, 
  Eye, 
  Edit3, 
  X, 
  Send, 
  Copy, 
  Check, 
  Maximize2, 
  ChevronRight, 
  Tag, 
  Clock, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

const CATEGORIES = ['全部', '工作', '学习', '灵感', '会议', '生活', '待办'];

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'welcome-nexus-ai',
    title: '🌟 欢迎使用 Nexus Notepad AI (Notion 级多模态旗舰版)',
    content: `# 🌟 欢迎使用 Nexus Notepad AI

Notion AI 每年需千余马币订阅费，而在这里，你可以**完全免费**使用原生 Google Gemini 驱动的超级多模态 AI 智能笔记！

### 📸 你最想要的「拍照与文件上传」功能现已全面就绪：
- **拍照提取 (OCR)**：点击下方相机按钮，直接拍摄书本、收据、白板或手写草稿，AI 会自动识别并整理成精美排版！
- **相册/附件上传**：支持上传各类照片（PNG、JPG、WEBP）以及文档。
- **Notion 级别一键 AI 工具**：
  - ✨ 智能润色纠错
  - 📝 总结核心要点
  - 🚀 深度扩写续写
  - ✅ 自动抽取待办事项清单
  - 🌐 中 / 英 / 马来语（Bahasa Melayu）三语实时互译
- **安全免订阅**：笔记数据自动保存在本地，永不泄露，随时支持导出为 Markdown 或 TXT！

试试点击下方的 **相机 📸** 或 **图片 🖼️** 按钮上传一张照片给 AI 试试吧！`,
    category: '灵感',
    pinned: true,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    attachments: [],
  },
  {
    id: 'sample-meeting-note',
    title: '💼 季度规划与产品待办示例',
    content: `## 2026 季度重点规划

- [ ] 完成 Nexus Notepad 多模态拍照与上传模块上线
- [ ] 测试手机端相册 OCR 识别文字准确率
- [ ] 支持将白板讨论草图转化为思维导图 Markdown
- [ ] 导出历史笔记至本地离线存储

> 💡 提示：点击右上角 "✨ AI 助手"，选择 "提取待办事项" 或 "总结核心要点"，AI 会自动分析本篇笔记！`,
    category: '会议',
    pinned: false,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
    attachments: [],
  }
];

export const NexusNotepad: React.FC = () => {
  // Notes State
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_notepad_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    return notes[0]?.id || '';
  });

  // Editor states
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];
  const [editorTitle, setEditorTitle] = useState(activeNote?.title || '');
  const [editorContent, setEditorContent] = useState(activeNote?.content || '');
  const [editorCategory, setEditorCategory] = useState(activeNote?.category || '工作');
  const [editorAttachments, setEditorAttachments] = useState<NoteAttachment[]>(activeNote?.attachments || []);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [copiedNote, setCopiedNote] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar drawer

  // Image zoom preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // AI Assistant states
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiCopied, setAiCopied] = useState(false);

  // Hidden file inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync editor with active note switch
  useEffect(() => {
    if (activeNote) {
      setEditorTitle(activeNote.title);
      setEditorContent(activeNote.content);
      setEditorCategory(activeNote.category || '工作');
      setEditorAttachments(activeNote.attachments || []);
      setAiResponse('');
      setAiError('');
    }
  }, [activeNoteId]);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_notepad_notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [notes]);

  // Debounced auto-save current note
  useEffect(() => {
    if (!activeNoteId) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id === activeNoteId) {
            return {
              ...n,
              title: editorTitle.trim() || '无标题笔记',
              content: editorContent,
              category: editorCategory,
              attachments: editorAttachments,
              updatedAt: Date.now(),
            };
          }
          return n;
        })
      );
      setSaveStatus('saved');
    }, 600);

    return () => clearTimeout(timer);
  }, [editorTitle, editorContent, editorCategory, editorAttachments, activeNoteId]);

  // Create new note
  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: 'note_' + Date.now(),
      title: '新建笔记 ' + new Date().toLocaleDateString('zh-CN'),
      content: '',
      category: '工作',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attachments: [],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setSidebarOpen(false);
  };

  // Delete note
  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (notes.length <= 1) {
      if (window.confirm('只剩这最后一篇笔记，确定清空并重置吗？')) {
        const emptyNote: NoteItem = {
          id: 'note_' + Date.now(),
          title: '新建空白笔记',
          content: '',
          category: '工作',
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          attachments: [],
        };
        setNotes([emptyNote]);
        setActiveNoteId(emptyNote.id);
      }
      return;
    }

    if (window.confirm('确定要删除这篇笔记吗？此操作无法撤销。')) {
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0]?.id || '');
      }
    }
  };

  // Toggle pin
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // File to Base64 Helper
  const fileToBase64 = (file: File): Promise<{ base64: string; preview: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Result is data:mime;base64,xxxx
        const commaIndex = result.indexOf(',');
        const base64 = commaIndex !== -1 ? result.substring(commaIndex + 1) : result;
        resolve({ base64, preview: result });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle uploaded files/photos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: NoteAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size limit: 15MB
      if (file.size > 15 * 1024 * 1024) {
        alert(`文件 "${file.name}" 超过 15MB 限制，请选择较小的文件。`);
        continue;
      }

      try {
        const { base64, preview } = await fileToBase64(file);
        const isImg = file.type.startsWith('image/');
        newAttachments.push({
          id: 'att_' + Date.now() + '_' + i,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          data: base64,
          previewUrl: isImg ? preview : undefined,
          type: isImg ? 'image' : 'document',
        });
      } catch (err) {
        console.error('Failed reading file:', err);
      }
    }

    if (newAttachments.length > 0) {
      setEditorAttachments((prev) => [...prev, ...newAttachments]);
      // Open AI panel automatically to suggest OCR or analysis
      setIsAiPanelOpen(true);
      if (newAttachments.some((a) => a.type === 'image')) {
        setAiPrompt('请仔细识别并提取照片中的文字内容，整理成结构清晰、格式精美的 Markdown 笔记。');
      }
    }

    // Reset input
    e.target.value = '';
  };

  // Paste image handler (Ctrl+V)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const { base64, preview } = await fileToBase64(file);
          const newAtt: NoteAttachment = {
            id: 'att_' + Date.now(),
            name: `截屏粘贴_${new Date().toLocaleTimeString('zh-CN')}.png`,
            mimeType: file.type || 'image/png',
            size: file.size,
            data: base64,
            previewUrl: preview,
            type: 'image',
          };
          setEditorAttachments((prev) => [...prev, newAtt]);
          setIsAiPanelOpen(true);
          setAiPrompt('请识别粘贴的截图内容，提取出关键信息并为我整理。');
        }
      }
    }
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    setEditorAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Format Toolbar helpers
  const insertTextAtCursor = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = before + selected + after;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setEditorContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 50);
  };

  // Call Server-side Gemini AI
  const executeAiRequest = async (promptText: string, specificAction?: string) => {
    if (!promptText.trim()) return;

    setAiLoading(true);
    setAiError('');
    setAiResponse('');

    try {
      // Prepare image parts if attachments exist
      const imageParts = editorAttachments.map((att) => ({
        mimeType: att.mimeType,
        data: att.data,
      }));

      const response = await fetch('/api/ai/notepad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          contextNote: editorContent.trim(),
          imageParts: imageParts,
          actionType: specificAction,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI 请求失败');
      }

      setAiResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || '网络连接或 AI 响应超时，请重试');
    } finally {
      setAiLoading(false);
    }
  };

  // Action handlers
  const handleAiAction = (actionKey: string) => {
    setIsAiPanelOpen(true);
    let prompt = '';

    switch (actionKey) {
      case 'ocr':
        prompt = '请精准识别提取当前笔记上传的所有图片/文档中的文字，还原排版结构，保留表格和清单，输出为可以直接使用的 Markdown 格式。';
        break;
      case 'summarize':
        prompt = '请针对当前笔记（及上传附件）进行深度总结：\n1. 用 3-5 句精炼的 Executive Summary 概述核心内容\n2. 提炼核心关键要点（Key Takeaways）\n3. 列出关键结论';
        break;
      case 'polish':
        prompt = '请对当前笔记的内容进行语法纠正、语句通顺润色，提升文笔专业度与逻辑流畅度，同时保持原意不变。';
        break;
      case 'expand':
        prompt = '请基于当前笔记的主题和内容，进行深入扩写和发散思考，补充更丰富的案例、分析维度和具体执行细节。';
        break;
      case 'todos':
        prompt = '请仔细梳理当前笔记及附件，提取出所有行动项（Action Items）并生成为可勾选的 Markdown 待办清单格式（- [ ] 任务描述）。';
        break;
      case 'translate_zh_en':
        prompt = '请将当前笔记内容翻译为高水准的地道专业英文（如果已经是英文则翻译为优雅中文）。';
        break;
      case 'translate_ms':
        prompt = '请将当前笔记内容专业地翻译为马来西亚常用官方语言（Bahasa Melayu），语言地道自然。';
        break;
      default:
        prompt = aiPrompt;
    }

    setAiPrompt(prompt);
    executeAiRequest(prompt, actionKey);
  };

  // Insert AI Result into note
  const handleInsertAiResult = (position: 'bottom' | 'top' | 'replace') => {
    if (!aiResponse) return;

    if (position === 'bottom') {
      const separator = editorContent.trim() ? '\n\n---\n### 🤖 AI 生成内容\n\n' : '';
      setEditorContent((prev) => prev + separator + aiResponse);
    } else if (position === 'top') {
      const separator = editorContent.trim() ? '\n\n---\n\n' : '';
      setEditorContent((prev) => `### 🤖 AI 生成内容\n\n${aiResponse}` + separator + prev);
    } else if (position === 'replace') {
      if (window.confirm('确定用 AI 的生成结果替换当前笔记的全部内容吗？')) {
        setEditorContent(aiResponse);
      }
    }
  };

  // Save AI Result as New Note
  const handleSaveAiAsNewNote = () => {
    if (!aiResponse) return;
    const newNote: NoteItem = {
      id: 'note_' + Date.now(),
      title: 'AI 整理: ' + (editorTitle || '未命名主题'),
      content: aiResponse,
      category: editorCategory || '灵感',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attachments: [],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsAiPanelOpen(false);
  };

  // Export note to file
  const handleExportNote = (format: 'md' | 'txt') => {
    const filename = `${editorTitle || 'Nexus_Note'}.${format}`;
    const blob = new Blob([editorContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy full note
  const handleCopyNote = () => {
    navigator.clipboard.writeText(editorContent);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchCategory = selectedCategory === '全部' || n.category === selectedCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-[#090d16] text-slate-100 overflow-hidden select-none">
      {/* Top Secondary Action Bar */}
      <div className="border-b border-slate-800/80 bg-[#0e1424]/90 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>笔记列表 ({notes.length})</span>
          </button>

          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建笔记</span>
          </button>

          {/* Save status badge */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 ml-1">
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                <span>自动保存中...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>已自动保存</span>
              </>
            )}
          </span>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* AI Panel trigger button */}
          <button
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isAiPanelOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25 ring-1 ring-purple-400'
                : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-600/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>Nexus AI 助手</span>
            <span className="hidden sm:inline-block bg-purple-500/30 text-purple-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              Notion级
            </span>
          </button>

          {/* Preview / Edit Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={isPreviewMode ? '切换为编辑模式' : '预览 Markdown 排版'}
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">编辑</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">预览</span>
              </>
            )}
          </button>

          {/* Export Dropdown / Copy */}
          <button
            onClick={handleCopyNote}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="复制全文"
          >
            {copiedNote ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copiedNote ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={() => handleExportNote('md')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="导出为 Markdown 文件"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出 .md</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Note List (Responsive Drawer on mobile, column on desktop) */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } fixed md:static inset-y-0 left-0 z-30 w-72 sm:w-80 bg-[#0c1220] border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out shrink-0`}
        >
          {/* Sidebar Header */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                全部笔记 ({notes.length})
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题或笔记内容..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Badges */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-1">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                没有找到相关笔记
              </div>
            ) : (
              filteredNotes
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt)
                .map((note) => {
                  const isActive = note.id === activeNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setSidebarOpen(false);
                      }}
                      className={`group relative p-2.5 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-950/40 border border-emerald-500/40 shadow-sm'
                          : 'hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4
                          className={`text-xs font-medium truncate flex-1 ${
                            isActive ? 'text-emerald-300 font-semibold' : 'text-slate-200'
                          }`}
                        >
                          {note.pinned && <span className="text-amber-400 mr-1">📌</span>}
                          {note.title || '无标题笔记'}
                        </h4>

                        {/* Note Actions */}
                        <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleTogglePin(note.id, e)}
                            className="p-1 text-slate-400 hover:text-amber-400"
                            title={note.pinned ? '取消置顶' : '置顶笔记'}
                          >
                            <Pin
                              className={`w-3 h-3 ${
                                note.pinned ? 'text-amber-400 fill-amber-400' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="删除笔记"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Content excerpt */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {note.content.replace(/#|\*|`/g, '') || '空白内容...'}
                      </p>

                      {/* Footer tags & attachments count */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {note.category || '工作'}
                        </span>
                        <div className="flex items-center gap-2">
                          {note.attachments && note.attachments.length > 0 && (
                            <span className="flex items-center gap-0.5 text-teal-400">
                              <ImageIcon className="w-2.5 h-2.5" />
                              {note.attachments.length}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(note.updatedAt).toLocaleDateString('zh-CN', {
                              month: 'numeric',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </aside>

        {/* Mobile backdrop for sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-xs"
          />
        )}

        {/* Center: Main Editor / Preview Canvas */}
        <section className="flex-1 flex flex-col bg-[#090d16] overflow-y-auto">
          {/* Note Metadata Header */}
          <div className="p-3 sm:p-5 border-b border-slate-800/80 bg-[#090d16]/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Title input */}
              <input
                type="text"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="给这篇笔记起一个标题..."
                className="w-full text-base sm:text-xl font-bold bg-transparent text-white placeholder-slate-500 border-none focus:outline-none tracking-tight"
              />

              {/* Category picker & word count */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={editorCategory}
                  onChange={(e) => setEditorCategory(e.target.value)}
                  className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  {CATEGORIES.filter((c) => c !== '全部').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {editorContent.length} 字
                </span>
              </div>
            </div>

            {/* Markdown Toolbar */}
            {!isPreviewMode && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-slate-400 border-t border-slate-800/60 pt-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('**', '**', '粗体文字')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="粗体"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('*', '*', '斜体文字')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="斜体"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-slate-800 mx-0.5" />
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('# ', '', '一级标题')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="一级标题 H1"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('## ', '', '二级标题')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="二级标题 H2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-slate-800 mx-0.5" />
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('- ', '', '无序列表项')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="无序列表"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('1. ', '', '有序列表项')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="有序列表"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('- [ ] ', '', '待办任务')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white text-emerald-400"
                  title="待办复选框"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-slate-800 mx-0.5" />
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('> ', '', '引用语段')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="引用"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor('```\n', '\n```', '代码内容')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                  title="代码块"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>

                {/* Upload action shortcut buttons */}
                <div className="ml-auto flex items-center gap-1.5">
                  {/* Native Camera Capture Button */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-medium bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 transition-colors"
                    title="手机直接拍照上传并识别"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>拍照</span>
                  </button>

                  {/* Album / Photo Upload Button */}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                    title="上传相册图片"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                    <span>传图</span>
                  </button>

                  {/* Document / File Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 transition-colors"
                    title="上传文档"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">文档</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hidden Input Elements */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Attachments Carousel / Chips */}
            {editorAttachments.length > 0 && (
              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    已附加 {editorAttachments.length} 个文件/图片 (AI 已挂载多模态分析)
                  </span>
                  <button
                    onClick={() => handleAiAction('ocr')}
                    className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1 font-semibold underline decoration-dotted"
                  >
                    <Sparkles className="w-3 h-3" />
                    一键识图转笔记
                  </button>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {editorAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="relative group shrink-0 w-24 h-24 rounded-lg bg-slate-800/90 border border-slate-700 overflow-hidden flex flex-col items-center justify-center"
                    >
                      {att.type === 'image' && att.previewUrl ? (
                        <>
                          <img
                            src={att.previewUrl}
                            alt={att.name}
                            onClick={() => setPreviewImage(att.previewUrl || null)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5 text-[9px] text-slate-300 truncate">
                            {att.name}
                          </div>
                        </>
                      ) : (
                        <div className="p-2 text-center flex flex-col items-center justify-center">
                          <FileText className="w-6 h-6 text-emerald-400 mb-1" />
                          <span className="text-[10px] text-slate-300 truncate max-w-[80px]">
                            {att.name}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {(att.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      )}

                      {/* Remove attachment button */}
                      <button
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/80 hover:bg-rose-600 text-white shadow-md transition-colors"
                        title="删除附件"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Editor Body or Markdown Render Preview */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col">
            {isPreviewMode ? (
              <div 
                className="prose prose-invert prose-emerald max-w-none text-slate-200 leading-relaxed overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(editorContent || '*当前笔记暂无内容，请在编辑模式输入...*'),
                }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onPaste={handlePaste}
                placeholder="开始书写你的笔记... (支持 Markdown 语法，也可直接按 Ctrl+V 粘贴截图，或点击上方拍照/传图)"
                className="w-full flex-1 bg-transparent text-slate-200 text-sm leading-relaxed resize-none focus:outline-none font-mono min-h-[350px] placeholder-slate-600"
              />
            )}
          </div>
        </section>

        {/* Right Drawer: Notion-Grade AI Assistant Panel */}
        <aside
          className={`${
            isAiPanelOpen ? 'translate-x-0' : 'translate-x-full'
          } fixed md:static inset-y-0 right-0 z-30 w-80 sm:w-96 bg-[#0c1220] border-l border-slate-800 flex flex-col transition-transform duration-200 ease-in-out shadow-2xl shrink-0`}
        >
          {/* AI Panel Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#111728]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Nexus AI 智能助手
                </h3>
                <span className="text-[10px] text-purple-300">
                  超能多模态 • 智能润色 / 识图 / 提炼
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAiPanelOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI One-Click Shortcuts (Notion AI toolkit) */}
          <div className="p-3 border-b border-slate-800 bg-[#090d16]/50 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ⚡ 一键 Notion AI 快捷操作
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAiAction('ocr')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition-all text-left truncate"
              >
                <Camera className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">识图提文字 (OCR)</span>
              </button>

              <button
                onClick={() => handleAiAction('summarize')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-left truncate"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">提炼核心要点</span>
              </button>

              <button
                onClick={() => handleAiAction('polish')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-left truncate"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">智能润色纠错</span>
              </button>

              <button
                onClick={() => handleAiAction('todos')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-left truncate"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">提取待办清单</span>
              </button>

              <button
                onClick={() => handleAiAction('expand')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-left truncate"
              >
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">深度续写拓展</span>
              </button>

              <button
                onClick={() => handleAiAction('translate_zh_en')}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-left truncate"
              >
                <Languages className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">中英翻译</span>
              </button>

              <button
                onClick={() => handleAiAction('translate_ms')}
                disabled={aiLoading}
                className="col-span-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-600/30 transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>翻译为马来文 (Bahasa Melayu)</span>
              </button>
            </div>
          </div>

          {/* AI Response or Status Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {aiLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <div className="text-xs text-purple-300 font-medium">
                  Nexus AI 正在深度解析笔记与附件...
                </div>
                <p className="text-[11px] text-slate-400 max-w-[220px]">
                  原生 Gemini 3.8 Flash 引擎分析中，无需消耗昂贵订阅费
                </p>
              </div>
            )}

            {aiError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/50 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <div className="font-semibold">处理异常</div>
                  <div className="text-[11px] text-rose-400 mt-0.5">{aiError}</div>
                </div>
              </div>
            )}

            {aiResponse && !aiLoading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="font-semibold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 生成结果
                  </span>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResponse);
                      setAiCopied(true);
                      setTimeout(() => setAiCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {aiCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{aiCopied ? '已复制' : '复制'}</span>
                  </button>
                </div>

                {/* Rendered AI Markdown */}
                <div
                  className="prose prose-invert prose-purple text-xs leading-relaxed max-w-none bg-slate-900/80 p-3 rounded-xl border border-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(aiResponse),
                  }}
                />

                {/* Insertion Action Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    如何将结果应用到笔记？
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleInsertAiResult('bottom')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      追加到笔记末尾
                    </button>
                    <button
                      onClick={() => handleInsertAiResult('top')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      插入到笔记开头
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleInsertAiResult('replace')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                    >
                      覆盖替换当前笔记
                    </button>
                    <button
                      onClick={handleSaveAiAsNewNote}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                    >
                      保存为新笔记
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!aiLoading && !aiResponse && !aiError && (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                  <Sparkles className="w-6 h-6 animate-bounce" />
                </div>
                <div className="text-xs font-medium text-slate-300">
                  随时向 Nexus AI 提问
                </div>
                <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-normal">
                  点击上方快捷按钮，或在下方输入框直接提问、要求总结照片、分析文件等。
                </p>
              </div>
            )}
          </div>

          {/* AI Free Prompt Input Box */}
          <div className="p-3 border-t border-slate-800 bg-[#111728]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeAiRequest(aiPrompt);
              }}
              className="relative"
            >
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="对笔记或上传照片提问... (例如：分析这张收据总共消费多少钱、帮我把手写文字整理成方案)"
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none h-18"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all"
                title="发送给 AI"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
