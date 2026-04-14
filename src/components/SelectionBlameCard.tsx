"use client";

import { useEffect, useState, useCallback } from "react";

interface BlameChunk {
  s: number;
  e: number;
  a: string;
  c: string;
  t: number;
  m: string;
  av: string;
}

interface BlameHit {
  author: string;
  commitSha: string;
  commitUrl: string;
  timestamp: number;
  message: string;
  avatarUrl: string;
}

function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function findBlameForSelection(node: Node): BlameHit | null {
  const repo =
    process.env.NEXT_PUBLIC_GITHUB_REPO || "CobryDev/ai-strategy";

  let el: HTMLElement | null =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;

  let sourceLine: number | null = null;
  let sectionEl: HTMLElement | null = null;

  while (el) {
    if (sourceLine === null && el.dataset.sourceLine) {
      sourceLine = parseInt(el.dataset.sourceLine, 10);
    }
    if (el.dataset.blameChunks) {
      sectionEl = el;
      break;
    }
    el = el.parentElement;
  }

  if (!sectionEl) return null;

  const chunks: BlameChunk[] = JSON.parse(
    sectionEl.dataset.blameChunks || "[]",
  );
  if (chunks.length === 0) return null;

  let chunk: BlameChunk;

  if (sourceLine !== null) {
    const match = chunks.find((c) => sourceLine! >= c.s && sourceLine! <= c.e);
    chunk = match || chunks[chunks.length - 1];
  } else {
    chunk = chunks[chunks.length - 1];
  }

  return {
    author: chunk.a,
    commitSha: chunk.c,
    commitUrl: `https://github.com/${repo}/commit/${chunk.c}`,
    timestamp: chunk.t,
    message: chunk.m || "",
    avatarUrl: chunk.av || "",
  };
}

export function SelectionBlameCard() {
  const [visible, setVisible] = useState(false);
  const [blame, setBlame] = useState<BlameHit | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      setVisible(false);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) {
      setVisible(false);
      return;
    }

    const hit = findBlameForSelection(selection.anchorNode!);
    if (!hit) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setBlame(hit);
    setPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setVisible(true);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    const dismiss = () => setVisible(false);
    document.addEventListener("scroll", dismiss, { passive: true });
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("scroll", dismiss);
    };
  }, [handleSelection]);

  if (!visible || !blame) return null;

  return (
    <div
      className="selection-blame-card"
      style={{ top: position.top, left: position.left }}
    >
      {blame.avatarUrl ? (
        <img
          src={blame.avatarUrl}
          alt=""
          width={20}
          height={20}
          className="selection-blame-avatar"
        />
      ) : (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="selection-blame-icon"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      <span className="selection-blame-author">{blame.author}</span>
      <span className="selection-blame-sep" aria-hidden="true">
        ·
      </span>
      <time>{timeAgo(blame.timestamp)}</time>
      <span className="selection-blame-sep" aria-hidden="true">
        ·
      </span>
      <a
        href={blame.commitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="selection-blame-commit"
      >
        {blame.commitSha}
      </a>
      {blame.message && (
        <>
          <span className="selection-blame-sep" aria-hidden="true">
            ·
          </span>
          <span className="selection-blame-message">{blame.message}</span>
        </>
      )}
    </div>
  );
}
