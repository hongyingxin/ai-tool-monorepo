import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                style={oneLight as any}
                language={match[1]}
                PreTag="div"
                className="rounded-xl border border-gray-100 shadow-sm !my-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                {...rest}
                className={`${className || ''} px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded-md font-mono text-[0.85em]`}
              >
                {children}
              </code>
            );
          },
          // 优化其他 markdown 元素的样式
          p: ({ node, children, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props}>{children}</p>,
          ul: ({ node, children, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props}>{children}</ul>,
          ol: ({ node, children, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props}>{children}</ol>,
          li: ({ node, children, ...props }) => <li className="marker:text-blue-400" {...props}>{children}</li>,
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic bg-blue-50/30 rounded-r-lg my-3" {...props}>
              {children}
            </blockquote>
          ),
          h1: ({ node, children, ...props }) => <h1 className="text-xl font-black mb-4 mt-6 text-gray-900 border-b pb-2" {...props}>{children}</h1>,
          h2: ({ node, children, ...props }) => <h2 className="text-lg font-bold mb-3 mt-5 text-gray-800" {...props}>{children}</h2>,
          h3: ({ node, children, ...props }) => <h3 className="text-base font-bold mb-2 mt-4 text-gray-800" {...props}>{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
