"use client";

import { useEffect, useState, useCallback } from "react";

interface BlameInfo {
  author: string;
  date: Date;
  contributors: number;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
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

function getBlameFromSelection(node: Node): BlameInfo | null {
  let el: HTMLElement | null =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;

  while (el) {
    if (el.dataset.blameAuthor) {
      return {
        author: el.dataset.blameAuthor,
        date: new Date(el.dataset.blameDate || ""),
        contributors: parseInt(el.dataset.blameContributors || "1", 10),
      };
    }
    el = el.parentElement;
  }
  return null;
}

export function SelectionBlameCard() {
  const [visible, setVisible] = useState(false);
  const [blame, setBlame] = useState<BlameInfo | null>(null);
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

    const info = getBlameFromSelection(selection.anchorNode!);
    if (!info || isNaN(info.date.getTime())) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setBlame(info);
    setPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setVisible(true);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    document.addEventListener("scroll", () => setVisible(false), {
      passive: true,
    });
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [handleSelection]);

  if (!visible || !blame) return null;

  const otherCount = blame.contributors - 1;

  return (
    <div
      className="selection-blame-card"
      style={{ top: position.top, left: position.left }}
    >
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
      <span className="selection-blame-author">{blame.author}</span>
      {otherCount > 0 && (
        <span className="selection-blame-extra">+{otherCount}</span>
      )}
      <span className="selection-blame-sep" aria-hidden="true">
        ·
      </span>
      <time dateTime={blame.date.toISOString()}>{timeAgo(blame.date)}</time>
    </div>
  );
}
