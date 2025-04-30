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
  Aetheron provides cutting-edge AI solutions for text generation, image creation, and voice interactions.
  Our powerful API allows you to integrate these capabilities into your applications with just a few lines of code.
</p>

            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a 
                href='/home' 
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                Explore Aetheron
              </a>
              <a 
                href="/documentation" 
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-dark-700 hover:border-primary-500 hover:text-primary-400 font-medium transition-colors"
              >
                View Documentation
              </a>
            </div>
          </div>
        </section>
        
        <section id="key-features" className="mb-12">
  <h2 className="text-2xl font-semibold mb-8 group">
    <a href="#key-features" className="anchor-link">#</a>
    Key Features
  </h2>
  
  <div className="grid md:grid-cols-2 gap-6">
    
    {/* Feature 1 - Intelligent Conversations */}
    <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
      <h3 className="text-xl font-bold mb-3 gradient-heading">Intelligent Conversations</h3>
      <p className="text-gray-400">
        Aetheron delivers highly accurate and context-aware chat responses powered by state-of-the-art NLP models, perfect for any chatbot, assistant, or support system.
      </p>
    </div>

    {/* Feature 2 - Image Generation */}
    <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
      <h3 className="text-xl font-bold mb-3 gradient-heading">Stunning Image Generation</h3>
      <p className="text-gray-400">
        Transform your ideas into visuals with our AI image generation capabilities — create artwork, concepts, and visuals with simple prompts.
      </p>
    </div>

    {/* Feature 3 - Seamless API Integration */}
    <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
    <h3 className="text-xl font-bold mb-3 gradient-heading">Seamless UI</h3>
<p className="text-gray-400">
  Deliver smooth and responsive AI-powered experiences with Aetheron's beautifully designed UI components, optimized for fast interaction, live chat, and real-time image generation.
</p>

    </div>

    {/* Feature 4 - Voice Interaction (Optional) */}
    <div className="glass-card rounded-xl p-6 glow-effect transition-transform hover:scale-105">
      <h3 className="text-xl font-bold mb-3 gradient-heading">Voice and Audio Support</h3>
      <p className="text-gray-400">
        Enable natural voice interactions with Aetheron's speech-to-text and text-to-speech functionalities, bringing your apps closer to human communication.
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
      Aetheron's advanced text chat system empowers you to build rich, dynamic conversational experiences. Powered by cutting-edge NLP models, your applications can now interact, assist, and entertain users with remarkable fluency.
    </p>
    <p className="text-dark-400 text-base leading-relaxed">
      From generating creative content and answering complex questions to translating languages and understanding context — Aetheron brings intelligent conversation to life with ease and scalability.
    </p>
  </div>
</section>

<section id="text-chat-features" className="mb-12">
  <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 gradient-heading group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
    </svg>
    Features
    <a href="#text-chat-features" className="anchor-link">#</a>
  </h2>

  <div className="glass-card rounded-2xl p-8 space-y-6 glow-effect">
    <ul className="space-y-4">
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
        </svg>
        Context-aware conversations that maintain dialogue history
      </li>
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12l6 6 6-6" />
        </svg>
        Content generation for various formats (stories, essays, code, etc.)
      </li>
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h3l-3 3m0 0l-3-3m3 3V3" />
        </svg>
        Question answering with factual knowledge
      </li>
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6H2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
        </svg>
        Multi-language support with translation capabilities
      </li>
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Customizable response parameters (creativity, length, etc.)
      </li>
      <li className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7" />
        </svg>
        Moderation tools to ensure appropriate content
      </li>
    </ul>
    <p className="text-dark-300">
      Our text models leverage the latest advancements in natural language processing to provide human-like interactions, ensuring a seamless experience for your users.
    </p>
  </div>
</section>

        
        <section id="text-chat-setup" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Setting Up
            <a href="#text-chat-setup" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              To get started with our Text Chat API, you'll need to initialize a conversation and then exchange messages:
            </p>
            <CodeBlock 
              language="javascript" 
              code={`// Initialize a conversation
const conversation = await fetch('https://api.Aetheron.com/v1/conversations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: "nexus-chat-v2",
    system_message: "You are a helpful assistant."
  })
});

const { conversation_id } = await conversation.json();

// Send a message to the conversation
const response = await fetch('https://api.Aetheron.com/v1/conversations/' + conversation_id + '/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    content: "Hello, can you explain how quantum computing works?"
  })
});

const message = await response.json();
console.log(message.content);`} 
            />
          </div>
        </section>
        
        <section id="text-chat-examples" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Examples
            <a href="#text-chat-examples" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-2 gradient-heading">Example Chat Interface</h3>
            <div className="border border-dark-700 rounded-lg p-4 bg-dark-900/50 mb-6">
              <div className="flex mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-xs font-medium">AI</span>
                </div>
                <div className="bg-dark-800/70 rounded-lg p-3 rounded-tl-none">
                  <p>How can I help you today?</p>
                </div>
              </div>
              <div className="flex mb-4 justify-end">
                <div className="bg-primary-900/50 rounded-lg p-3 rounded-tr-none">
                  <p>Can you explain how machine learning works in simple terms?</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent-700 flex items-center justify-center ml-3 flex-shrink-0">
                  <span className="text-xs font-medium">You</span>
                </div>
              </div>
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-xs font-medium">AI</span>
                </div>
                <div className="bg-dark-800/70 rounded-lg p-3 rounded-tl-none">
                  <p>
                    Think of machine learning like teaching a child. First, you show the child many examples 
                    (that's the data). The child learns patterns from these examples (training). 
                    Eventually, when shown something new, the child can make educated guesses based on what 
                    they've learned before (prediction). Machine learning works similarly—we feed computers 
                    lots of data, they learn patterns, and then they can make predictions or decisions on new data.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-dark-300">
              This example shows a simple chat interface powered by our Text Chat API. You can customize the appearance and behavior to fit your application needs.
            </p>
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
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 md:pr-6">
                <p className="mb-4">
                  Aetheron's Image Generation API converts text descriptions into vivid, detailed images using state-of-the-art diffusion models.
                </p>
                <p className="text-dark-300">
                  Our system can generate a wide variety of images from simple descriptions, making it perfect for creative projects, design mockups, or content creation.
                </p>
              </div>
              <div className="md:w-1/3 mt-6 md:mt-0">
                <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg p-1">
                  <div className="aspect-square bg-dark-800 rounded flex items-center justify-center">
                    <span className="text-dark-400 text-sm">Example Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="image-gen-models" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Available Models
            <a href="#image-gen-models" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-700">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">Model Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">Resolution</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-dark-300 uppercase tracking-wider">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  <tr>
                    <td className="py-3 px-4 text-dark-200">nexus-image-standard</td>
                    <td className="py-3 px-4 text-dark-300">1024×1024</td>
                    <td className="py-3 px-4 text-dark-300">General purpose image generation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-dark-200">nexus-image-hd</td>
                    <td className="py-3 px-4 text-dark-300">2048×2048</td>
                    <td className="py-3 px-4 text-dark-300">High-definition with enhanced details</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-dark-200">nexus-image-creative</td>
                    <td className="py-3 px-4 text-dark-300">1024×1024</td>
                    <td className="py-3 px-4 text-dark-300">Artistic styles and creative compositions</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-dark-200">nexus-image-portrait</td>
                    <td className="py-3 px-4 text-dark-300">768×1024</td>
                    <td className="py-3 px-4 text-dark-300">Specialized for human portraits and faces</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section id="image-gen-usage" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Usage Guide
            <a href="#image-gen-usage" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Generating images with our API is straightforward. Here's an example of how to generate an image:
            </p>
            <CodeBlock 
              language="javascript" 
              code={`// Request to generate an image
const response = await fetch('https://api.Aetheron.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: "nexus-image-standard",
    prompt: "A futuristic city with flying cars and neon lights at night",
    n: 1,
    size: "1024x1024",
    response_format: "url"
  })
});

const data = await response.json();
const imageUrl = data.data[0].url;
console.log(imageUrl);`} 
            />
            <p className="mt-4 text-dark-300">
              For best results, provide detailed prompts that describe the desired image clearly. You can also use negative prompts to specify what you don't want in the image.
            </p>
          </div>
        </section>
        
        <section id="image-gen-examples" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Examples
            <a href="#image-gen-examples" className="anchor-link">#</a>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6">
              <div className="mb-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg p-1">
                <div className="aspect-video bg-dark-800 rounded flex items-center justify-center">
                  <span className="text-dark-400 text-sm">Example Image 1</span>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">Nature Landscape</h3>
              <p className="text-dark-300 text-sm">
                <span className="text-primary-400">Prompt:</span> "A majestic mountain range at sunset with a crystal clear lake reflecting the colorful sky"
              </p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="mb-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg p-1">
                <div className="aspect-video bg-dark-800 rounded flex items-center justify-center">
                  <span className="text-dark-400 text-sm">Example Image 2</span>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">Sci-Fi Concept</h3>
              <p className="text-dark-300 text-sm">
                <span className="text-primary-400">Prompt:</span> "A futuristic space station orbiting Jupiter, with detailed architecture and solar panels"
              </p>
            </div>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="nlp-voice-chat" 
        title="NLP Voice Chat" 
        theme={theme}
      >
        <section id="voice-chat-introduction" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Introduction
            <a href="#voice-chat-introduction" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              Aetheron's Voice Chat API combines speech recognition, natural language processing, and text-to-speech capabilities to enable voice-based interactions with our AI.
            </p>
            <p className="text-dark-300">
              This powerful combination allows you to create voice assistants, interactive voice response systems, or voice-based interfaces for your applications.
            </p>
          </div>
        </section>
        
        <section id="voice-chat-integration" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Integration
            <a href="#voice-chat-integration" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <p className="mb-4">
              The Voice Chat API works in three main steps:
            </p>
            <ol className="space-y-3 list-decimal pl-5 mb-6 text-dark-300">
              <li>
                <strong className="text-dark-100">Speech-to-Text:</strong> Convert audio input into text
              </li>
              <li>
                <strong className="text-dark-100">NLP Processing:</strong> Process the text with our language models
              </li>
              <li>
                <strong className="text-dark-100">Text-to-Speech:</strong> Convert the AI's response back to speech
              </li>
            </ol>
            <p className="mb-4">
              Here's an example of how to use our Voice Chat API with the Web Speech API:
            </p>
            <CodeBlock 
              language="javascript" 
              code={`// Basic example using browser's Web Speech API for input
// and our API for processing and output

// Initialize speech recognition
const recognition = new window.SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

// Start listening when the user clicks a button
document.getElementById('startButton').addEventListener('click', () => {
  recognition.start();
});

// Process the speech input
recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('User said:', transcript);
  
  // Send to Aetheron for processing
  const response = await fetch('https://api.Aetheron.com/v1/voice/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      input: transcript,
      voice_id: "clara", // Choose from available voice options
      response_format: "mp3"
    })
  });
  
  // Play the audio response
  const audioData = await response.arrayBuffer();
  const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  audio.play();
};`} 
            />
          </div>
        </section>
        
        <section id="voice-chat-samples" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Samples
            <a href="#voice-chat-samples" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-4 gradient-heading">Available Voices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-800/70 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3">
                  <span className="text-xs">♪</span>
                </div>
                <div>
                  <p className="font-medium">Clara</p>
                  <p className="text-sm text-dark-400">Professional female voice</p>
                </div>
                <button className="ml-auto p-2 rounded-full hover:bg-dark-700/70" aria-label="Play sample">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </button>
              </div>
              <div className="bg-dark-800/70 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3">
                  <span className="text-xs">♪</span>
                </div>
                <div>
                  <p className="font-medium">Marcus</p>
                  <p className="text-sm text-dark-400">Deep male voice</p>
                </div>
                <button className="ml-auto p-2 rounded-full hover:bg-dark-700/70" aria-label="Play sample">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </button>
              </div>
              <div className="bg-dark-800/70 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3">
                  <span className="text-xs">♪</span>
                </div>
                <div>
                  <p className="font-medium">Ellie</p>
                  <p className="text-sm text-dark-400">Young female voice</p>
                </div>
                <button className="ml-auto p-2 rounded-full hover:bg-dark-700/70" aria-label="Play sample">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </button>
              </div>
              <div className="bg-dark-800/70 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center mr-3">
                  <span className="text-xs">♪</span>
                </div>
                <div>
                  <p className="font-medium">Nova</p>
                  <p className="text-sm text-dark-400">Synthetic assistant voice</p>
                </div>
                <button className="ml-auto p-2 rounded-full hover:bg-dark-700/70" aria-label="Play sample">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-dark-300">
              These voice samples demonstrate the variety of voices available through our Voice Chat API. You can select the voice that best fits your application's personality and user experience requirements.
            </p>
          </div>
        </section>
      </DocSection>
      
      <DocSection 
        id="faq" 
        title="FAQ" 
        theme={theme}
      >
        <section id="general-questions" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            General Questions
            <a href="#general-questions" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">What is Aetheron?</h3>
              <p className="text-dark-300">
                Aetheron is a comprehensive artificial intelligence platform that provides advanced capabilities for text generation, image creation, and voice interactions through easy-to-use APIs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How do I get started with Aetheron?</h3>
              <p className="text-dark-300">
                Sign up for an account on our website, get your API key, and start integrating our APIs into your applications following our documentation guides.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What programming languages do you support?</h3>
              <p className="text-dark-300">
                Our API is language-agnostic and can be used with any programming language that can make HTTP requests. We also provide official SDKs for JavaScript, Python, Ruby, and Java.
              </p>
            </div>
          </div>
        </section>
        
        <section id="technical-support" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Technical Support
            <a href="#technical-support" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do I handle rate limits?</h3>
              <p className="text-dark-300">
                Our API implements rate limiting to ensure fair usage. You should implement retry logic with exponential backoff in your applications. Rate limits vary by subscription tier.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What are the response formats available?</h3>
              <p className="text-dark-300">
                Depending on the API, responses are available in JSON, raw text, URL (for images), or audio formats like MP3 and WAV for voice responses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How do I report issues with the API?</h3>
              <p className="text-dark-300">
                You can report issues through our support portal or by emailing support@Aetheron.com. Please include your API request details, error messages, and steps to reproduce the issue.
              </p>
            </div>
          </div>
        </section>
        
        <section id="billing" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 group">
            Billing & Plans
            <a href="#billing" className="anchor-link">#</a>
          </h2>
          <div className="glass-card rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="border border-dark-700 rounded-lg p-5 bg-dark-900/50 text-center">
                <h3 className="text-xl font-medium mb-2">Starter</h3>
                <p className="text-3xl font-bold mb-1">$29<span className="text-sm font-normal text-dark-400">/month</span></p>
                <p className="text-dark-400 text-sm mb-4">Perfect for small projects</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    100K API calls/month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Standard models
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Email support
                  </li>
                </ul>
                <a href="#" className="inline-block w-full py-2 px-4 bg-dark-800 hover:bg-dark-700 rounded-lg font-medium transition-colors">
                  Choose Plan
                </a>
              </div>
              <div className="border border-primary-600 rounded-lg p-5 bg-dark-900/50 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                  POPULAR
                </div>
                <h3 className="text-xl font-medium mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal text-dark-400">/month</span></p>
                <p className="text-dark-400 text-sm mb-4">For growing businesses</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    500K API calls/month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced models
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <a href="#" className="inline-block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  Choose Plan
                </a>
              </div>
              <div className="border border-dark-700 rounded-lg p-5 bg-dark-900/50 text-center">
                <h3 className="text-xl font-medium mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-1">Custom</p>
                <p className="text-dark-400 text-sm mb-4">For large organizations</p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Unlimited API calls
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All models + customization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Dedicated account manager
                  </li>
                </ul>
                <a href="#" className="inline-block w-full py-2 px-4 bg-dark-800 hover:bg-dark-700 rounded-lg font-medium transition-colors">
                  Contact Sales
                </a>
              </div>
            </div>
            <p className="text-center text-dark-300">
              All plans include access to our API, documentation, and developer tools. For custom requirements or volume discounts, please <a href="#" className="text-primary-400 hover:underline">contact our sales team</a>.
            </p>
          </div>
        </section>
      </DocSection>
    </div>
  );
};

export default Document;