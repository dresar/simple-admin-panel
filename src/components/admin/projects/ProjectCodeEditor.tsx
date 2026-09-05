import React, { useRef, useEffect, useState } from 'react';

interface ProjectCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'markdown' | 'html';
}

export function ProjectCodeEditor({ value, onChange, language = 'markdown' }: ProjectCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      // Reset cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-muted/30">
      <div className="flex text-sm">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-muted/50 text-muted-foreground text-right py-3 px-2 select-none overflow-hidden border-r border-input"
          style={{ fontFamily: 'ui-monospace, monospace' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[300px] p-3 bg-transparent resize-none focus:outline-none leading-6"
          style={{ fontFamily: 'ui-monospace, monospace' }}
          placeholder={`Enter your ${language} content here...`}
          spellCheck={false}
        />
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/50 border-t border-input text-xs text-muted-foreground">
        <span>{language.toUpperCase()}</span>
        <span>{lineCount} lines</span>
      </div>
    </div>
  );
}
