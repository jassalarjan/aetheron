import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DocSection from './DocSection';
import CodeBlock from './CodeBlock';

const Document = ({ theme, setActiveSection }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <DocSection 
        id="overview" 
        title="Overview" 
        theme={theme}
      >
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            <a href="#getting-started" className="anchor-link"># </a>
            Getting Started
          </h2>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <p>
              Aetheron is an advanced AI platform that combines multiple cutting-edge AI capabilities into a single, user-friendly interface. Built on top of TogetherAI's powerful models, Aetheron provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Intelligent text chat powered by Llama-3.3-70B</li>
              <li>Stunning image generation using FLUX.1</li>
              <li>Voice interactions with Mixtral-8x7B</li>
              <li>Seamless user experience with modern UI/UX</li>
            </ul>
          </div>
        </section>
        
        <section id="key-features" className="mb-12">
          <h2 className="text-2xl font-semibold mb-8 group">
            <a href="#key-features" className="anchor-link">#</a>
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
              <h3 className="text-xl font-bold mb-3 gradient-heading">AI Chat</h3>
              <p className="text-gray-400">
                Powered by Llama-3.3-70B-Instruct-Turbo-Free, our chat system provides intelligent, context-aware conversations with advanced natural language understanding.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
              <h3 className="text-xl font-bold mb-3 gradient-heading">Image Generation</h3>
              <p className="text-gray-400">
                Create stunning visuals using FLUX.1-schnell-Free model, supporting high-resolution image generation with detailed prompts.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
              <h3 className="text-xl font-bold mb-3 gradient-heading">Voice Interactions</h3>
              <p className="text-gray-400">
                Experience natural voice conversations powered by Mixtral-8x7B-Instruct-v0.1, enabling speech-to-text and text-to-speech capabilities.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
              <h3 className="text-xl font-bold mb-3 gradient-heading">User Management</h3>
              <p className="text-gray-400">
                Secure authentication system with JWT tokens, user profiles, and activity tracking for a personalized experience.
              </p>
            </div>
          </div>
        </section>

        <section id="api-access" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            <a href="#api-access" className="anchor-link">#</a>
            API Integration through TogetherAI
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Aetheron connects seamlessly to TogetherAI models to power advanced chatbots, NLP tasks, and image generation. Here's a basic example of how to initiate a chat request:
            </p>
            <CodeBlock 
              language="javascript" 
              code={`// Example: Sending a chat message to TogetherAI via Aetheron's API
const response = await fetch('https://api.aetheron.arjansinghjassal.xyz/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: "How do I create a beautiful painting?" }
    ],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`}
            />
            <p className="mt-4 text-dark-300">
              To get started, sign up for an API key. For complete details about sending chat messages, generating images, or fine-tuning outputs, check out our 
              <a href="https://www.together.ai/" className="text-primary-400 hover:underline"> API Reference</a>.
            </p>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="ai-text-chat" 
        title="AI Text Chat" 
        theme={theme}
      >
        <section id="text-chat-introduction" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 gradient-heading group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Introduction
            <a href="#text-chat-introduction" className="anchor-link">#</a>
          </h2>

          <div className="glass-card rounded-2xl p-8 space-y-5 glow-effect">
            <p className="text-lg leading-relaxed text-dark-100">
              Our AI chat system is built on Llama-3.3-70B-Instruct-Turbo-Free, one of the most advanced language models available. The system maintains conversation context and provides intelligent, helpful responses.
            </p>
            <p className="text-dark-400 text-base leading-relaxed">
              Key features include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Context-aware conversations with chat history</li>
              <li>Support for multiple chat sessions</li>
              <li>Automatic chat management (empty chat cleanup)</li>
              <li>Real-time response streaming</li>
            </ul>
          </div>
        </section>

        <section id="text-chat-usage" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Usage Guide
            <a href="#text-chat-usage" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              The chat system is designed to be intuitive and user-friendly. Here's how it works:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Starting a Chat:</strong>
                <p className="text-dark-300 mt-2">Click on the "AI Chat" option from the homepage to start a new conversation.</p>
              </li>
              <li>
                <strong>Managing Chats:</strong>
                <p className="text-dark-300 mt-2">View your chat history, create new chats, or delete empty chats from the homepage.</p>
              </li>
              <li>
                <strong>Chat Features:</strong>
                <p className="text-dark-300 mt-2">The chat interface supports markdown formatting, code blocks, and maintains conversation context.</p>
              </li>
            </ol>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="image-generation" 
        title="Image Generation" 
        theme={theme}
      >
        <section id="image-gen-introduction" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Introduction
            <a href="#image-gen-introduction" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Our image generation system uses the FLUX.1-schnell-Free model to create high-quality images from text descriptions. The system supports:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>High-resolution image generation (1024x1024)</li>
              <li>Multiple image variations</li>
              <li>Image history tracking</li>
              <li>Integration with chat conversations</li>
            </ul>
          </div>
        </section>
        
        <section id="image-gen-usage" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Usage Guide
            <a href="#image-gen-usage" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              To generate images:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Access the Generator:</strong>
                <p className="text-dark-300 mt-2">Click on "Image Generator" from the homepage.</p>
              </li>
              <li>
                <strong>Enter a Prompt:</strong>
                <p className="text-dark-300 mt-2">Describe the image you want to generate in detail.</p>
              </li>
              <li>
                <strong>Generate and Save:</strong>
                <p className="text-dark-300 mt-2">Click generate to create your image. Generated images are automatically saved to your history.</p>
              </li>
            </ol>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="voice-interactions" 
        title="Voice Interactions" 
        theme={theme}
      >
        <section id="voice-introduction" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Introduction
            <a href="#voice-introduction" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              The voice interaction system uses Mixtral-8x7B-Instruct-v0.1 to provide natural voice conversations. Features include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Speech-to-text conversion</li>
              <li>Natural language understanding</li>
              <li>Voice command support</li>
              <li>Conversation history tracking</li>
            </ul>
          </div>
        </section>
        
        <section id="voice-usage" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Usage Guide
            <a href="#voice-usage" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              To use voice interactions:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Access Voice Chat:</strong>
                <p className="text-dark-300 mt-2">Click on "Voice Chat" from the homepage.</p>
              </li>
              <li>
                <strong>Start Recording:</strong>
                <p className="text-dark-300 mt-2">Click the microphone button to start recording your voice.</p>
              </li>
              <li>
                <strong>Interact:</strong>
                <p className="text-dark-300 mt-2">Speak naturally and receive AI responses in real-time.</p>
              </li>
            </ol>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="technical-details" 
        title="Technical Details" 
        theme={theme}
      >
        <section id="architecture" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            System Architecture
            <a href="#architecture" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Aetheron is built using modern technologies and best practices:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Frontend:</strong> React with Vite, TailwindCSS, and Framer Motion</li>
              <li><strong>Backend:</strong> Cloudflare Workers with Hono framework</li>
              <li><strong>Database:</strong> Cloudflare D1 for data persistence</li>
              <li><strong>Authentication:</strong> JWT-based authentication system</li>
              <li><strong>AI Models:</strong> TogetherAI integration for advanced AI capabilities</li>
            </ul>
          </div>
        </section>
        
        <section id="security" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Security
            <a href="#security" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Security measures implemented in Aetheron:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>JWT-based authentication with secure token storage</li>
              <li>CORS protection for API endpoints</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Secure password handling</li>
              <li>Protected API routes with authentication middleware</li>
            </ul>
          </div>
        </section>
      </DocSection>
    </div>
  );
};

export default Document;