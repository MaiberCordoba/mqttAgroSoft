// utils/mapUtils.ts
export const metersToDegrees = (meters: number, lat: number, isLongitude: boolean = false): number => {
    const R = 6378137; // Radio de la Tierra en metros
    if (isLongitude) {
      return (meters / (R * Math.cos(lat * (Math.PI / 180))) * (180 / Math.PI));
    }
    return (meters / R) * (180 / Math.PI);
  };