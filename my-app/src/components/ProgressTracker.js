// ProgressTracker.js
import React from 'react';
import './progress.css';

export default function ProgressTracker({ activeStep }) {
  const steps = ['Section A', 'Section B', 'Section C', 'Section D'];

  return (
    <div className="process-tracker" style={{ counterReset: 'step 0' }}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index === activeStep ? 'active' : ''}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}