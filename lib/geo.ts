export const LOCATION_RADIUS_METERS = 500

export function haversineDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface LocationEligibility {
  granted: boolean
  distanceMeters: number | null
  inRange: boolean
  userLat: number | null
  userLng: number | null
  error?: string
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  })
}

export async function checkLocationEligibility(targetLat: number, targetLng: number): Promise<LocationEligibility> {
  try {
    const position = await getCurrentPosition()
    const userLat = position.coords.latitude
    const userLng = position.coords.longitude
    const distanceMeters = haversineDistanceMeters(userLat, userLng, targetLat, targetLng)
    return {
      granted: true,
      distanceMeters,
      inRange: distanceMeters <= LOCATION_RADIUS_METERS,
      userLat,
      userLng,
    }
  } catch (error: any) {
    return {
      granted: false,
      distanceMeters: null,
      inRange: false,
      userLat: null,
      userLng: null,
      error: error?.message || "Location permission denied",
    }
  }
}
