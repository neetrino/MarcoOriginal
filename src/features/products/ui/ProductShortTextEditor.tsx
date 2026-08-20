"use client";

import { useLayoutEffect, useRef } from "react";
import { Bold, Italic, Link } from "lucide-react";

export const PRODUCT_TEXT_COLORS = [
  "#111827",
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#EAB308",
] as const;

type ProductShortTextEditorProps = {
  html: string;
  disabled: boolean;
  ariaLabel: string;
  boldLabel: string;
  italicLabel: string;
  linkLabel: string;
  colorLabel: string;
  linkPrompt: string;
  onChange: (html: string) => void;
};

function selectionIsInside(root: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const node = selection.anchorNode;
  return Boolean(node && root.contains(node));
}

export function ProductShortTextEditor({
  html,
  disabled,
  ariaLabel,
  boldLabel,
  italicLabel,
  linkLabel,
  colorLabel,
  linkPrompt,
  onChange,
}: ProductShortTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialHtmlRef = useRef(html);

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = initialHtmlRef.current;
  }, []);

  function emitChange(): void {
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function runCommand(command: string, value?: string): void {
    const editor = editorRef.current;
    if (!editor || disabled) return;
    editor.focus();
    if (!selectionIsInside(editor)) return;
    document.execCommand(command, false, value);
    emitChange();
  }

  function applyColor(color: string): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    document.execCommand("styleWithCSS", false, "true");
    runCommand("foreColor", color);
  }

  function applyLink(): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0).cloneRange();
    const href = window.prompt(linkPrompt, "https://");
    if (!href) return;
    const editor = editorRef.current;
    if (!editor || disabled) return;
    editor.focus();
    const next = window.getSelection();
    next?.removeAllRanges();
    next?.addRange(range);
    document.execCommand("createLink", false, href.trim());
    emitChange();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2">
        <button
          type="button"
          disabled={disabled}
          aria-label={boldLabel}
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-50"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("bold")}
        >
          <Bold className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={disabled}
          aria-label={italicLabel}
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-50"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("italic")}
        >
          <Italic className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={disabled}
          aria-label={linkLabel}
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-50"
          onMouseDown={(event) => event.preventDefault()}
          onClick={applyLink}
        >
          <Link className="h-4 w-4" aria-hidden />
        </button>
        <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden />
        {PRODUCT_TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            disabled={disabled}
            aria-label={`${colorLabel} ${color}`}
            className="h-4 w-4 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyColor(color)}
          />
        ))}
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        contentEditable={!disabled}
        suppressContentEditableWarning
        className="min-h-[8.5rem] px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none"
        onInput={emitChange}
      />
    </div>
  );
}
