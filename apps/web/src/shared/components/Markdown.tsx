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
    <div className={`prose prose-sm max-w-none dark:prose-invert break-words overflow-x-hidden ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className="relative group my-4 overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-[#f9fafb]">
                <SyntaxHighlighter
                  {...rest}
                  style={oneLight as any}
                  language={match[1]}
                  PreTag="div"
                  className="text-[11px] md:text-[13px]"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    lineHeight: '1.5',
                    background: 'transparent',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'inherit',
                    }
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code 
                {...rest}
                className={`${className || ''} px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded-md font-mono text-[0.85em] break-all`}
              >
                {children}
              </code>
            );
          },
          // 优化表格的移动端滚动体验
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm custom-scrollbar">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50/50">{children}</thead>,
          th: ({ children }) => <th className="border-b border-gray-100 px-4 py-3 font-bold text-gray-900">{children}</th>,
          td: ({ children }) => <td className="border-b border-gray-100 px-4 py-3 text-gray-600">{children}</td>,
          // 优化其他 markdown 元素的样式
          p: ({ node, children, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-700" {...props}>{children}</p>,
          ul: ({ node, children, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700" {...props}>{children}</ul>,
          ol: ({ node, children, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-700" {...props}>{children}</ol>,
          li: ({ node, children, ...props }) => <li className="marker:text-blue-400 pl-1" {...props}>{children}</li>,
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="border-l-4 border-blue-200 pl-4 py-2 italic bg-blue-50/30 rounded-r-xl my-6 text-gray-600" {...props}>
              {children}
            </blockquote>
          ),
          h1: ({ node, children, ...props }) => <h1 className="text-xl md:text-2xl font-black mb-6 mt-8 text-gray-900 border-b border-gray-50 pb-3" {...props}>{children}</h1>,
          h2: ({ node, children, ...props }) => <h2 className="text-lg md:text-xl font-bold mb-4 mt-6 text-gray-800" {...props}>{children}</h2>,
          h3: ({ node, children, ...props }) => <h3 className="text-base md:text-lg font-bold mb-3 mt-5 text-gray-800" {...props}>{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
