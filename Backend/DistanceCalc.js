const earthRadius = 6378137;
const toRadius = (value) => (value * Math.PI) / 180;

const useDistance = ({ from, to }) => {
  const distance =
    Math.acos(
      Math.sin(toRadius(to?.latitude)) * Math.sin(toRadius(from?.latitude)) +
        Math.cos(toRadius(to?.latitude)) *
          Math.cos(toRadius(from?.latitude)) *
          Math.cos(toRadius(from?.longitude) - toRadius(to?.longitude))
    ) * earthRadius;

  //return Math.round(convertDistance(distance, 'km'));
  return convertDistance(distance, "km").toFixed(2);
};

// Convert to a different unit

const convertDistance = (meters, targetUnit = "m") => {
  return distanceConversion[targetUnit] * meters;
};

const distanceConversion = {
  m: 1,
  mi: 1 / 1609.344,
  km: 0.001,
  cm: 100,
  mm: 1000,
};

module.exports = useDistance;
