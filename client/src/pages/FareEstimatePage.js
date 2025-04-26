// client/src/pages/FareEstimatePage.js
import React from 'react';
import FareCalculator from '../components/FareCalculator';

export default function FareEstimatePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Get Your Fare Estimate</h1>
          <p className="text-gray-600 text-lg">
            Enter your pickup and drop-off locations to calculate the estimated fare.
          </p>
        </div>
        <FareCalculator />
      </div>
    </div>
  );
}
