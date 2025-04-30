// src/Aetheron.jsx
import React from 'react';
import Sidebar from './components/Sidebar'; // ✅ Sidebar imported
import './aetheron.css'; // ✅ Updated CSS linked

const Aetheron = () => {
  return (
    <div className="aetheron-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="aetheron-content">
        <header className="header">
          <h1 className="title">Aetheron AI</h1>
          <p className="subtitle">Unlock the Power of Artificial Intelligence</p>
        </header>

        <main className="main">
          {/* Features Section */}
          <section className="features">
            <h2 className="section-title">Discover Aetheron's Features</h2>
            <div className="feature-cards">
              <div className="feature-card">
                <h3 className="feature-title">AI Chat</h3>
                <p className="feature-description">
                  Engage in conversations with Aetheron's advanced AI chatbot, designed to understand and respond intelligently.
                </p>
                <button className="feature-button">Try AI Chat</button>
              </div>

              <div className="feature-card">
                <h3 className="feature-title">NLP Chat</h3>
                <p className="feature-description">
                  Experience Natural Language Processing with Aetheron's smart NLP models that understand real-world context.
                </p>
                <button className="feature-button">Try NLP Chat</button>
              </div>

              <div className="feature-card">
                <h3 className="feature-title">Image Generation</h3>
                <p className="feature-description">
                  Create stunning visuals directly from your text prompts, powered by Aetheron's generative AI models.
                </p>
                <button className="feature-button">Try Image Generation</button>
              </div>
            </div>
          </section>

          {/* Demo Section */}
          <section className="demo">
            <h2 className="section-title">Live Demo</h2>
            <div className="demo-container">
              {/* AI Chat Demo */}
              <div className="demo-chat">
                <h3 className="demo-title">AI Chat Demo</h3>
                <input type="text" className="input-field" placeholder="Type your message..." />
                <button className="demo-button">Send</button>
                <div className="demo-conversation">
                  <p className="demo-message">👋 Hello! How can I assist you today?</p>
                </div>
              </div>

              {/* Image Generation Demo */}
              <div className="demo-image-generation">
                <h3 className="demo-title">Image Generation Demo</h3>
                <input type="text" className="input-field" placeholder="Describe an image..." />
                <button className="demo-button">Generate</button>
                <div className="demo-image-container">
                  <img src="https://via.placeholder.com/300" alt="Generated Visual" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p className="footer-text">&copy; 2024 Aetheron AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Aetheron;
