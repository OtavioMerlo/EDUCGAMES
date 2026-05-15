import React from 'react';

export function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>;

  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);

  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return <span>{text}</span>;

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return (
    <span>
      {before}
      <span className="text-purple-400 font-bold bg-purple-500/10 px-0.5 rounded">{match}</span>
      {after}
    </span>
  );
}
