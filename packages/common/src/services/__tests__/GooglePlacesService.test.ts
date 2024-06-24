import mockAxios from 'axios';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import {
  AutocompleteMock,
  GoogleError,
  placeDetails,
  reverseGeocode,
} from '@homzhub/common/src/mocks/GooglePlacesMocks';

jest.mock('axios');

describe('GooglePlaces API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Test for error', async () => {
    // @ts-ignore
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: GoogleError }));
    try {
      await GooglePlacesService.autoComplete('TestLocation');
    } catch (e) {
      expect(e).toMatchSnapshot();
      expect(e).toBeTruthy();
    }
  });

  it('should fetch the list of autocomplete items as per input', async () => {
    // @ts-ignore
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: AutocompleteMock }));
    const response = await GooglePlacesService.autoComplete('TestLocation');
    expect(response).toMatchSnapshot();
  });

  it('should fetch the details of a location', async () => {
    // @ts-ignore
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: placeDetails }));
    const response = await GooglePlacesService.getPlaceDetail('testPlaceId');
    expect(response).toMatchSnapshot();
  });

  it('should fetch the details of a lat lng as per reverse geocoding', async () => {
    // @ts-ignore
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: reverseGeocode }));
    const response = await GooglePlacesService.getLocationData({ lat: 1, lng: 1 });
    expect(response).toMatchSnapshot();
  });

  it('should get split address for a formatted address', () => {
    const response = GooglePlacesService.getSplitAddress('Main Address, Tumkur, Karnataka, India');
    expect(response).toMatchSnapshot();
  });
});
