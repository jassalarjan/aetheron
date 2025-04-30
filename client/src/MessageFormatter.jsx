import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Typing speed setup
const TYPING_SPEED = 1000; // characters per second
const delayPerCharacter = 1000 / TYPING_SPEED; // milliseconds per character

const MessageFormatter = ({ message, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(isLatest ? "" : message);
  const [index, setIndex] = useState(0);
  const [showTypingDots, setShowTypingDots] = useState(false);
  const messageEndRef = useRef(null);

  // Typing animation effect
  useEffect(() => {
    if (!isLatest) return;

    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + message.charAt(index));
        setIndex((prev) => prev + 1);
      }, delayPerCharacter);
      return () => clearTimeout(timeout);
    } else {
      setShowTypingDots(false); // typing done
    }
  }, [index, message, isLatest]);

  // Show typing dots while typing
  useEffect(() => {
    if (isLatest && index < message.length) {
      setShowTypingDots(true);
    }
  }, [index, isLatest, message.length]);

  // Auto-scroll to the bottom while typing
  useEffect(() => {
    if (isLatest && messageEndRef.current) {
      const scrollTimeout = setTimeout(() => {
        messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 30);
      return () => clearTimeout(scrollTimeout);
    }
  }, [index, isLatest]);

  return (
    <div className="w-full">
      <ReactMarkdown
        className="prose prose-base sm:prose-lg dark:prose-invert max-w-none leading-relaxed"
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <div className="my-6 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-md">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                      padding: "0.5rem",
                      fontSize: "0.9rem",
                      background: "#1e1e1e",
                      borderRadius: "8px",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          h1: (props) => (
            <h1 className="text-3xl font-bold my-4 text-indigo-700 dark:text-indigo-300" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-2xl font-semibold my-3 text-indigo-600 dark:text-indigo-300" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-medium my-2 text-indigo-500 dark:text-indigo-200" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc pl-6 my-2 text-gray-800 dark:text-gray-200" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-6 my-2 text-gray-800 dark:text-gray-200" {...props} />
          ),
          li: (props) => (
            <li className="mb-2 text-gray-700 dark:text-gray-300" {...props} />
          ),
          p: (props) => (
            <p className="my-4 text-gray-800 dark:text-gray-300 leading-relaxed" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="border-l-4 border-indigo-400 pl-4 pr-2 py-2 italic text-gray-700 dark:text-gray-300 my-5 bg-indigo-50 dark:bg-gray-800 rounded-lg shadow-sm">
              {props.children}
            </blockquote>
          ),
        }}
      >
        {displayedText}
      </ReactMarkdown>

      {/* Typing Dots Animation */}
      {showTypingDots && (
        <div className="mt-2 ml-1 flex space-x-1">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></span>
        </div>
      )}

      {/* Scroll Anchor */}
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
};

export default MessageFormatter;
