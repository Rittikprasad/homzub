import axios from 'axios';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { MetricSystems } from '@homzhub/common/src/domain/models/UserPreferences';
import {
  Coordinate,
  GoogleGeocodeData,
  GooglePlaceData,
  GooglePlaceDetail,
  Point,
  PointOfInterest,
} from '@homzhub/common/src/services/GooglePlaces/interfaces';

const ENDPOINTS = {
  autoComplete: (): string => 'place/autocomplete/json',
  getPlaceDetail: (): string => 'place/details/json',
  getNearbyPlaces: (): string => 'place/nearbysearch/json',
  getLocationData: (): string => 'geocode/json',
};
const NEARBY_RADIUS = 5000;
const ZERO_RESULTS = 'ZERO_RESULTS';

class GooglePlacesService {
  private axiosInstance = axios.create({
    baseURL: ConfigHelper.getPlacesBaseUrl(),
  });

  private apiKey: string = ConfigHelper.getPlacesApiKey();

  public autoComplete = async (input: string): Promise<GooglePlaceData[]> => {
    const response = await this.axiosInstance.get(ENDPOINTS.autoComplete(), {
      params: {
        key: this.apiKey,
        input,
        inputtype: 'textquery',
      },
    });

    this.checkError(response.data);

    return response.data.predictions;
  };

  public getPlaceDetail = async (placeId: string): Promise<GooglePlaceDetail> => {
    const response = await this.axiosInstance.get(ENDPOINTS.getPlaceDetail(), {
      params: {
        key: this.apiKey,
        place_id: placeId,
      },
    });

    this.checkError(response.data);
    return response.data.result;
  };

  public getLocationData = async (point?: Point, address?: string): Promise<GoogleGeocodeData> => {
    const response = await this.axiosInstance.get(ENDPOINTS.getLocationData(), {
      params: {
        key: this.apiKey,
        latlng: `${point?.lat},${point?.lng}`,
        address,
      },
    });

    this.checkError(response.data);

    return response.data.results[0];
  };

  public getPOIs = async (
    point: Coordinate,
    type: string,
    radius = NEARBY_RADIUS,
    metricSystem = MetricSystems.KILOMETERS
  ): Promise<PointOfInterest[]> => {
    const response = await this.axiosInstance.get(ENDPOINTS.getNearbyPlaces(), {
      params: {
        key: this.apiKey,
        location: `${point.latitude},${point.longitude}`,
        radius,
        type,
      },
    });

    this.checkError(response.data);
    if (response.data.status === ZERO_RESULTS) return [];
    return ResponseHelper.transformPOIs(response.data.results, point, metricSystem);
  };

  public getSplitAddress = (address: string): { primaryAddress: string; secondaryAddress: string } => {
    const secondIndex = address.indexOf(',', address.indexOf(',') + 1);

    if (secondIndex === -1) {
      return { primaryAddress: address, secondaryAddress: '' };
    }

    return {
      primaryAddress: address.substr(0, secondIndex),
      secondaryAddress: address.substr(secondIndex + 1).trimStart(),
    };
  };

  private checkError = (object: Record<string, any>): void => {
    if (object.hasOwnProperty('error_message')) {
      throw new Error(object.error_message);
    }

    if (object.hasOwnProperty('status') && object.status === ZERO_RESULTS) {
      throw new Error('No Results Found');
    }
  };
}

const gps = new GooglePlacesService();
export { gps as GooglePlacesService };
