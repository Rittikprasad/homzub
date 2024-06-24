import { MetricSystems } from '@homzhub/common/src/domain/models/UserPreferences';
import { Coordinate, PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';

// Constants
const RADIUS_OF_EARTH_IN_KM = 6371.071;
const KM_TO_MILES_RATE = 1.60934;
const KM_TO_METERS_RATE = 1000;
const LIMIT = 10;
const LocationKeysToMatch = {
  country: 'country',
  state: 'administrative_area_level_1',
  area: 'administrative_area_level_2',
  city: 'locality',
  pincode: 'postal_code',
};

class ResponseHelper {
  public transformPOIs = (
    pointsOfInterest: any,
    originPoint: Coordinate,
    metricSystem: MetricSystems
  ): PointOfInterest[] => {
    return pointsOfInterest.slice(0, LIMIT).map((POI: any) => {
      const {
        place_id,
        name,
        geometry: {
          location: { lat: latitude, lng: longitude },
        },
      } = POI;
      return {
        name,
        placeId: place_id,
        latitude,
        longitude,
        distanceFromOrigin: this.haversineDistance(originPoint, { latitude, longitude }, metricSystem),
      } as PointOfInterest;
    });
  };

  public transformPOIsWeb = (
    pointsOfInterest: any,
    originPoint: Coordinate,
    metricSystem: MetricSystems
  ): PointOfInterest[] => {
    return pointsOfInterest.slice(0, LIMIT).map((POI: any) => {
      const {
        place_id,
        name,
        geometry: { location },
      } = POI;
      const latitude = location.lat();
      const longitude = location.lng();
      return {
        name,
        placeId: place_id,
        latitude,
        longitude,
        distanceFromOrigin: this.haversineDistance(originPoint, { latitude, longitude }, metricSystem),
      } as PointOfInterest;
    });
  };

  private haversineDistance = (coordOrigin: Coordinate, coordDest: Coordinate, metricSystem: MetricSystems): number => {
    const { latitude: origLat, longitude: origLng } = coordOrigin;
    const { latitude: destLat, longitude: destLng } = coordDest;

    const latDistance = this.calculateDistance(destLat, origLat);
    const lngDistance = this.calculateDistance(destLng, origLng);

    const origLatInRad = this.toRadian(origLat);
    const destLatInRad = this.toRadian(destLat);

    // Haversine Formula

    const a =
      Math.sin(latDistance / 2) ** 2 + Math.sin(lngDistance / 2) ** 2 * Math.cos(origLatInRad) * Math.cos(destLatInRad);
    const c = 2 * Math.asin(Math.sqrt(a));

    // Final Distance
    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;
    if (metricSystem === MetricSystems.MILES) {
      finalDistance /= KM_TO_MILES_RATE;
    } else if (metricSystem === MetricSystems.METERS) {
      finalDistance *= KM_TO_METERS_RATE;
    }

    return finalDistance;
  };

  public getLocationDetails = (placeData: any): Record<string, string> => {
    const locationData = {} as Record<string, string>;
    const { address_components: addressComponents } = placeData;

    addressComponents.forEach((component: any): void => {
      Object.keys(LocationKeysToMatch).forEach((key: string) => {
        // @ts-ignore
        if (component.types[0] === LocationKeysToMatch[key]) {
          locationData[key] = component.long_name;
          if (component.types[0] === LocationKeysToMatch.country) {
            locationData.countryIsoCode = component.short_name;
          }
        }
      });
    });
    return locationData;
  };

  private toRadian = (angle: number): number => (Math.PI / 180) * angle;
  private calculateDistance = (orig: number, dest: number): number => (Math.PI / 180) * (orig - dest);
}

const RH = new ResponseHelper();
export { RH as ResponseHelper };
