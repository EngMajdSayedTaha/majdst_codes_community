import React, { useRef, useState, KeyboardEvent, useCallback } from 'react';

export const LANGUAGES = [
  { value: 'python',     label: 'Python',     icon: '🐍', ext: '.py'   },
  { value: 'javascript', label: 'JavaScript', icon: '🟨', ext: '.js'   },
  { value: 'typescript', label: 'TypeScript', icon: '🔷', ext: '.ts'   },
  { value: 'cpp',        label: 'C++',        icon: '⚙️',  ext: '.cpp'  },
  { value: 'csharp',     label: 'C#',         icon: '💜', ext: '.cs'   },
  { value: 'php',        label: 'PHP',        icon: '🐘', ext: '.php'  },
  { value: 'go',         label: 'Go',         icon: '🐹', ext: '.go'   },
  { value: 'rust',       label: 'Rust',       icon: '🦀', ext: '.rs'   },
  { value: 'java',       label: 'Java',       icon: '☕', ext: '.java' },
  { value: 'kotlin',     label: 'Kotlin',     icon: '🟣', ext: '.kt'   },
  { value: 'swift',      label: 'Swift',      icon: '🦉', ext: '.swift'},
  { value: 'ruby',       label: 'Ruby',       icon: '💎', ext: '.rb'   },
  { value: 'bash',       label: 'Bash',       icon: '🐚', ext: '.sh'   },
  { value: 'sql',        label: 'SQL',        icon: '🗄️',  ext: '.sql'  },
  { value: 'other',      label: 'Other',      icon: '📄', ext: '.txt'  },
];

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  hasError?: boolean;
  minRows?: number;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  hasError = false,
  minRows = 12,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [langOpen, setLangOpen] = useState(false);

  const selectedLang = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

  /* ── line numbers ── */
  const lineCount = Math.max(minRows, (value.split('\n').length));
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  /* ── sync scroll ── */
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  /* ── tab key ── */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const newVal = value.slice(0, start) + '  ' + value.slice(end);
      onChange(newVal);
      // restore cursor after react re-render
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className={`code-editor${hasError ? ' code-editor-error' : ''}`}>
      {/* ── header bar ── */}
      <div className="code-editor-header">
        <div className="code-editor-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        <div className="code-editor-lang-wrap">
          <button
            type="button"
            className="code-editor-lang-btn"
            onClick={() => setLangOpen(p => !p)}
            aria-haspopup="listbox"
            aria-expanded={langOpen ? 'true' : 'false'}
          >
            <span className="lang-icon">{selectedLang.icon}</span>
            <span className="lang-label">{selectedLang.label}</span>
            <span className="lang-ext">{selectedLang.ext}</span>
            <svg className={`lang-chevron${langOpen ? ' open' : ''}`} width="10" height="10" viewBox="0 0 10 10">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>

          {langOpen && (
            <ul className="code-editor-lang-dropdown" role="listbox" aria-label="Select programming language">
              {LANGUAGES.map(lang => (
                <li
                  key={lang.value}
                  role="option"
                  aria-selected={lang.value === language ? 'true' : 'false'}
                  className={`lang-option${lang.value === language ? ' active' : ''}`}
                  onClick={() => { onLanguageChange(lang.value); setLangOpen(false); }}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                  <span className="lang-option-ext">{lang.ext}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="code-editor-file">solution{selectedLang.ext}</span>
      </div>

      {/* ── editor body ── */}
      <div className="code-editor-body">
        {/* line numbers */}
        <div className="code-editor-lines" ref={lineNumbersRef} aria-hidden="true">
          {lineNumbers.map(n => (
            <div key={n} className="code-line-num">{n}</div>
          ))}
        </div>

        {/* textarea */}
        <textarea
          ref={textareaRef}
          className="code-editor-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={`// Write your ${selectedLang.label} solution here…`}
          aria-label={`${selectedLang.label} solution code`}
          style={{ minHeight: `${minRows * 22}px` } as React.CSSProperties}
        />
      </div>

      {/* ── status bar ── */}
      <div className="code-editor-statusbar">
        <span>{selectedLang.label}</span>
        <span className="statusbar-sep" />
        <span>{value.split('\n').length} lines</span>
        <span className="statusbar-sep" />
        <span>{value.length} chars</span>
      </div>
    </div>
  );
}
