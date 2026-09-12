import React from 'react';

interface Options {
  /** Wrap numbers, times, distances and ids in mono so they read as data. */
  monoNumbers?: boolean;
}

const NUMBER = /(\b\d[\d.:,\-T]*\s?(?:km|kn|min|h|%|UTC)?\b)/g;

function inlineNodes(line: string, monoNumbers: boolean): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <span key={i} className="font-medium text-white">{p.slice(2, -2)}</span>;
    }
    if (!monoNumbers) return <React.Fragment key={i}>{p}</React.Fragment>;
    return (
      <React.Fragment key={i}>
        {p.split(NUMBER).map((seg, j) => (/^\d/.test(seg)
          ? <span key={j} className="os-mono text-white">{seg}</span>
          : <React.Fragment key={j}>{seg}</React.Fragment>))}
      </React.Fragment>
    );
  });
}

/** Renders the small markdown subset agents produce: **bold**, `#` headings, bullets, numbered lists, blank lines. */
export function renderMarkdownLite(text: string, options: Options = {}): React.ReactNode {
  const mono = options.monoNumbers ?? false;
  return text.split(/\r?\n/).map((raw, i) => {
    const line = raw.trimEnd();
    if (!line.trim()) return <div key={i} className="h-2" />;
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) return <div key={i} className="font-medium text-white mt-1">{inlineNodes(heading[1], mono)}</div>;
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) return <div key={i} className="pl-4 relative before:content-['·'] before:absolute before:left-1">{inlineNodes(bullet[1], mono)}</div>;
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      return (
        <div key={i} className="pl-5 relative">
          <span className="os-mono absolute left-0 text-os-slate">{numbered[1]}.</span>{inlineNodes(numbered[2], mono)}
        </div>
      );
    }
    return <div key={i}>{inlineNodes(line, mono)}</div>;
  });
}
