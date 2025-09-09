import React, { useState, useEffect } from 'react';
import './HeroSection.css';


// Hero section component
export default function HeroSection() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>permission to perform other remunerative work</h1>
          <p>The form is divided into several sections based on the role of the person completing it</p>
          <div className="hero-actions">
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
      </section>

      
    </>
  );
}