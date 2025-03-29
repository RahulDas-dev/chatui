import React from 'react';

interface Source {
  title: string;
  url?: string;
  content: string;
}

interface SourceCitationProps {
  sources: Source[];
}

const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-500 mb-1">Sources:</p>
      <div className="space-y-1">
        {sources.map((source, i) => (
          <a 
            key={i}
            href={source.url} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline block truncate"
          >
            {source.title || 'Document source'}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceCitation;