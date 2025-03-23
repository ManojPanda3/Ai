import { Chat } from "../utile/types";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';

interface MessageBoxProps {
  chat: Chat;
  startTime?: Date; // Add startTime as a prop
  replyTime?: number;
}

function MessageBox({ chat, startTime, replyTime }: MessageBoxProps) {
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);

  // Memoize the processed content to avoid unnecessary recalculations
  const processedContent = useMemo(() => {
    let content = chat.content;

    // Fix unclosed code blocks efficiently
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (!match[0].endsWith("```")) {
        const [fullMatch, language, code] = match;
        const replacement = `\`\`\`${language}\n${code}\`\`\``;
        content = content.substring(0, match.index!) + replacement + content.substring(match.index! + fullMatch.length);
        codeBlockRegex.lastIndex = match.index! + replacement.length; //  Important: Adjust lastIndex after replacement to avoid infinite loops or incorrect replacements
      }
    }
    return content;
  }, [chat.content]);


  // Memoize thinkContent extraction
  const { thinkContent, responseContent, hasThinkContent } = useMemo(() => {
    const thinkMatch = processedContent.match(/<think>([\s\S]*?)<\/think>/);
    const hasThinkContent = !!thinkMatch;
    const thinkContent = thinkMatch?.[1]?.trim() || '';
    const responseContent = hasThinkContent ? processedContent.slice(thinkMatch[0].length) : processedContent;
    return { thinkContent, responseContent, hasThinkContent };
  }, [processedContent]);


  // useCallback for handleCopy to prevent unnecessary re-renders of CodeBlock
  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    // Consider using a custom hook or library for managing short-lived state like this
    setTimeout(() => { }, 2000); // Removed setCopied state to reduce component state update
  }, []);


  // Optimized CodeBlock component
  const CodeBlock = useCallback(({ language, value }: { language: string, value: string }) => {
    const [copied, setCopied] = useState(false);  // copied state

    const handleCopyLocal = () => { // local handleCopy function
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);  // Reset copied state
    };

    return (
      <div className="relative group">
        <button
          onClick={handleCopyLocal} // Call the function
          className="absolute right-2 top-2 bg-gray-800 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-300" />}
        </button>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ paddingRight: "2.5rem" }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }, [handleCopy]);


  // Common Markdown components
  const markdownComponents = useMemo(() => ({
    code(props: any) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <CodeBlock language={match[1]} value={String(children)} />
      ) : (
        <code className={`${className} bg-zinc-800 px-1 py-0.5 rounded text-white`} {...rest}>
          {children}
        </code>
      );
    },
    pre({ children, ...props }: any) {
      return <pre className="overflow-auto my-4 rounded-lg" {...props}>{children}</pre>;
    },
    h1(props: any) {
      return <h1 className="text-2xl font-bold mt-6 mb-4 pb-1 border-b border-gray-700" {...props} />;
    },
    h2(props: any) {
      return <h2 className="text-xl font-bold mt-6 mb-3 pb-1 border-b border-gray-700" {...props} />;
    },
    h3(props: any) {
      return <h3 className="text-lg font-bold mt-5 mb-3" {...props} />;
    },
    h4(props: any) {
      return <h4 className="text-base font-bold mt-4 mb-2" {...props} />;
    },
    p(props: any) {
      return <p className="my-4 leading-relaxed" {...props} />;
    },
    ul(props: any) {
      return <ul className="list-disc pl-6 my-4 space-y-2" {...props} />;
    },
    ol(props: any) {
      return <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />;
    },
    li(props: any) {
      return <li className="my-1" {...props} />;
    },
    blockquote(props: any) {
      return <blockquote className="border-l-4 border-gray-500 pl-4 my-4 italic text-gray-300" {...props} />;
    },
    a(props: any) {
      return <a className="text-blue-400 hover:underline" {...props} />;
    },
    hr(props: any) {
      return <hr className="my-8 border-gray-700" {...props} />;
    },
    table(props: any) {
      return <table className="border-collapse table-auto w-full my-6" {...props} />;
    },
    th(props: any) {
      return <th className="border-b border-gray-600 p-2 text-left font-semibold" {...props} />;
    },
    td(props: any) {
      return <td className="border-b border-gray-700 p-2" {...props} />;
    },
  }), [CodeBlock]);

  if (chat.role === "user") {
    return (
      <div className="w-full flex justify-end text-pretty overflow-hidden px-2">
        <div className="bg-zinc-700 rounded-l-lg rounded-br-lg px-3 self-end max-w-3/4 text-right break-words overflow-hidden">
          {chat.content.startsWith("data:") ? (
            <img src={chat.content} loading="lazy" />
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {processedContent}
            </Markdown>
          )}
        </div>
      </div>
    );
  } else if (chat.role === "assistant") {
    return (
      <div className="w-full h-auto flex justify-start text-pretty overflow-hidden py-2">
        <div className="prose prose-invert w-full">
          {replyTime && (
            <div className="text-sm text-gray-400">
              Replied in {replyTime.toFixed(2)} s
            </div>
          )}
          {hasThinkContent && (
            <div className="mb-4 border-b border-gray-700 pb-4">
              <button
                onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isThinkingExpanded ? 'rotate-180' : ''}`} />
                {isThinkingExpanded ? 'Hide Reasoning' : 'Show Reasoning'}
              </button>

              {isThinkingExpanded && (
                <div className="mt-4 pl-4 border-l-2 border-gray-600 text-gray-400">
                  <Markdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={markdownComponents}
                  >
                    {thinkContent}
                  </Markdown>
                </div>
              )}
            </div>
          )}

          <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {responseContent}
          </Markdown>
        </div>
      </div>
    );
  }

  return null; // Or some default fallback UI
}

export default MessageBox;
