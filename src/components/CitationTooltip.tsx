"use client";

import { useEffect, useState, useCallback } from "react";

interface ClaimSource {
  id: string;
  source: string;
  claims: string[];
  links: { label: string; url: string }[];
  verified: boolean;
}

interface Props {
  claims: Record<string, ClaimSource>;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function CitationTooltip({ claims }: Props) {
  const [claim, setClaim] = useState<ClaimSource | null>(null);

  const close = useCallback(() => setClaim(null), []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest?.(
        ".cite-ref",
      ) as HTMLElement | null;
      if (!target) return;

      e.preventDefault();
      const claimId = target.dataset.claim;
      if (claimId && claims[claimId]) {
        setClaim(claims[claimId]);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [claims, close]);

  if (!claim) return null;

  return (
    <div
      className="cite-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`cite-modal ${claim.verified ? "" : "cite-modal-unverified"}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Source: ${claim.source}`}
      >
        <button
          className="cite-modal-close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        {!claim.verified && (
          <div className="cite-modal-warning">
            <span className="cite-modal-warning-icon" aria-hidden="true">
              ⚠
            </span>
            Unverified source
          </div>
        )}

        <div className="cite-modal-source">{claim.source}</div>

        {claim.claims.length > 0 && (
          <>
            <div className="cite-modal-label">Claims from this source</div>
            <ul className="cite-modal-claims">
              {claim.claims.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}

        {claim.links.length > 0 && (
          <>
            <div className="cite-modal-label">Sources</div>
            <div className="cite-modal-links">
              {claim.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.label}</span>
                  <span className="cite-link-url">
                    {extractDomain(link.url)}
                  </span>
                  <span className="cite-link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </>
        )}

        {claim.links.length === 0 && !claim.verified && (
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-on-surface-variant)",
              marginTop: "1rem",
              lineHeight: 1.5,
            }}
          >
            This source could not be independently verified via web search.
            It may be behind a paywall, an internal report, or from a
            smaller publisher.
          </p>
        )}
      </div>
    </div>
  );
}
