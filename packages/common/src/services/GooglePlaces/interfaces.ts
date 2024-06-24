/* eslint-disable @typescript-eslint/interface-name-prefix */

export type PlaceType =
  | 'administrative_area_level_1'
  | 'administrative_area_level_2'
  | 'administrative_area_level_3'
  | 'administrative_area_level_4'
  | 'administrative_area_level_5'
  | 'colloquial_area'
  | 'country'
  | 'establishment'
  | 'finance'
  | 'floor'
  | 'food'
  | 'general_contractor'
  | 'geocode'
  | 'health'
  | 'intersection'
  | 'locality'
  | 'natural_feature'
  | 'neighborhood'
  | 'place_of_worship'
  | 'political'
  | 'point_of_interest'
  | 'post_box'
  | 'postal_code'
  | 'postal_code_prefix'
  | 'postal_code_suffix'
  | 'postal_town'
  | 'premise'
  | 'room'
  | 'route'
  | 'street_address'
  | 'street_number'
  | 'sublocality'
  | 'sublocality_level_4'
  | 'sublocality_level_5'
  | 'sublocality_level_3'
  | 'sublocality_level_2'
  | 'sublocality_level_1'
  | 'subpremise';

interface Term {
  offset: number;
  value: string;
}

interface MatchedSubString {
  length: number;
  offset: number;
}

interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: Record<string, any>[][];
  secondary_text: string;
  secondary_text_matched_substrings: Record<string, any>[][];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: PlaceType[];
}

export interface Point {
  lat: number;
  lng: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Geometry {
  location: Point;
  location_type: string;
  viewport: {
    northeast: Point;
    southwest: Point;
  };
}

export interface GooglePlaceData {
  description: string;
  id: string;
  matched_substrings: MatchedSubString[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: PlaceType[];
}

export interface GooglePlaceDetail {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  reference: string;
  scope: 'GOOGLE';
  types: PlaceType;
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface GoogleGeocodeData {
  address_components: AddressComponent[];
  geometry: Geometry;
  place_id: string;
  types: PlaceType[];
  formatted_address: string;
}

export interface PointOfInterest {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceFromOrigin: number;
}
