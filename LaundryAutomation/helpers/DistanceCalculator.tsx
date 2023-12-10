type UseDistanceTypes = {
    from: { latitude: number; longitude: number };
    to: { latitude: number; longitude: number };
};

const earthRadius = 6378137;
const toRadius = (value: number): number => (value * Math.PI) / 180;

export const useDistance = ({ from, to }: UseDistanceTypes): number => {
    const distance =
        Math.acos(
            Math.sin(toRadius(to.latitude)) * Math.sin(toRadius(from.latitude)) +
            Math.cos(toRadius(to.latitude)) * Math.cos(toRadius(from.latitude)) * Math.cos(toRadius(from.longitude) - toRadius(to.longitude)),
        ) * earthRadius;

    //return Math.round(convertDistance(distance, 'km'));
    return convertDistance(distance, 'km').toFixed(2) as any;
};

// Convert to a different unit

const convertDistance = (meters: number, targetUnit: keyof typeof distanceConversion = 'm'): number => {
    return distanceConversion[targetUnit] * meters;
};

const distanceConversion = {
    m: 1,
    mi: 1 / 1609.344,
    km: 0.001,
    cm: 100,
    mm: 1000
};
