// client/src/components/FareCalculator.js
import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiDollarSign, FiMapPin, FiNavigation } from 'react-icons/fi';

export default function FareCalculator() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicles] = useState([
    'Chevrolet Suburban 2023',
    'Kia Sedona 2020',
  ]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/fares/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLocation: pickup,
          dropoffLocation: dropoff,
          vehicleType: vehicle
        })
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to get estimate');
      setEstimate(body);
    } catch (err) {
      setError(err.message);
      setEstimate(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        <FiDollarSign className="inline-block mr-2 text-blue-600" />
        Fare Calculator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="pickup"
                type="text"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                placeholder="Enter pickup address"
                required
                minLength="5"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-2">
              Dropoff Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="dropoff"
                type="text"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                placeholder="Enter dropoff address"
                required
                minLength="5"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <div className="relative">
              <FiNavigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="vehicle"
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
              >
                <option value="">Select vehicle type</option>
                {vehicles.map((v, index) => (
                  <option key={index} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 shadow-md transition flex items-center justify-center gap-2 w-full md:w-auto mx-auto"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              'Get Fare Estimate'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 bg-red-50 p-4 rounded-xl text-red-700 border border-red-200 flex items-center gap-3">
          <FiAlertCircle className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {estimate && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Estimated Trip Details</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white p-4 rounded-lg shadow-sm min-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">Distance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(estimate.distance * 0.621371).toFixed(1)} miles
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm min-w-[200px]">
                <p className="text-sm text-gray-600 mb-1">Estimated Fare</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(estimate.fare)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>* This estimate includes base fare, distance, and time calculations</p>
            <p>* Final fare may vary based on traffic and other factors</p>
          </div>
        </div>
      )}
    </div>
  );
}