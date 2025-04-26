// utils/distanceCalculator.js
const axios = require('axios');

/**
 * Lookup driving distance & duration between two addresses via Google Maps
 * @param {string} origin
 * @param {string} destination
 * @returns {Promise<{ distanceMeters: number, distanceText: string, durationSecs: number, durationText: string }>}
 */
async function getDistance(origin, destination) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY not set');
  }

  const resp = await axios.get(
    'https://maps.googleapis.com/maps/api/distancematrix/json',
    {
      params: {
        origins: origin,
        destinations: destination,
        key: process.env.GOOGLE_API_KEY
      }
    }
  );

  if (resp.data.status !== 'OK') {
    throw new Error('Distance Matrix error: ' + resp.data.status);
  }
  const element = resp.data.rows[0].elements[0];
  if (element.status !== 'OK') {
    throw new Error('Route not found: ' + element.status);
  }
  return {
    distanceMeters: element.distance.value,
    distanceText: element.distance.text,
    durationSecs: element.duration.value,
    durationText: element.duration.text
  };
}

module.exports = { getDistance };
