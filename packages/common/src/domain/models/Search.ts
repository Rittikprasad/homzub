import { IMediaAttributes } from '@homzhub/common/src/domain/models/Attachment';
import { ICarpetAreaUnit } from '@homzhub/common/src/domain/models/Asset';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';

export enum ContactActions {
  WHATSAPP = 'WHATSAPP',
  CALL = 'CALL',
  MAIL = 'MAIL',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
}

export interface ITransactionRange {
  min: number;
  max: number;
}

export interface ISpaces extends IUnit {
  count: number;
}

export interface IPropertyTerm {
  id: number;
  expected_price: string;
  currency_code: string;
}

export interface IImages {
  file_name: string;
  is_cover_image: boolean;
  link: string;
  media_type: string;
  media_attributes: IMediaAttributes;
}

export interface IAmenitiesIcons {
  icon: string;
  iconSize: number;
  iconColor: string;
  label: string;
}

export interface IFilter {
  search_latitude?: number;
  search_longitude?: number;
  asset_transaction_type?: number;
  asset_type?: number[];
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  area_unit?: number;
  furnishing_status?: string;
  room_count?: number[];
  bath_count?: number;
  asset_group?: number;
  search_address?: string;
  limit?: number;
  offset?: number;
  currency_code?: string;
  sort_by?: string;
  is_sorting?: boolean;
  user_location_latitude?: number;
  user_location_longitude?: number;
  miscellaneous?: {
    show_verified: boolean;
    agent_listed: boolean;
    search_radius: IUnit;
    date_added: IUnit;
    property_age: IUnit;
    rent_free_period: IUnit;
    expected_move_in_date: string;
    facing: string[];
    furnishing: FurnishingTypes[];
    propertyAmenity: number[];
    search_radius_unit: string;
  };
}

export interface IProperties {
  id: number;
  asset_group: IUnit;
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string;
  longitude: string;
  carpet_area: string;
  carpet_area_unit: ICarpetAreaUnit;
  floor_number: number;
  total_floors: number;
  asset_type: IUnit;
  spaces: ISpaces[];
  lease_term?: IPropertyTerm | null;
  sale_term?: IPropertyTerm | null;
  attachments: IImages[];
  is_favorite?: boolean;
}

export interface ISearchHistoryPayload {
  results_count: number;
  device_type: DeviceType;
  currency?: string;
  min_price?: number;
  max_price?: number;
  device_id?: string;
  ip_address?: string;
  bath_count?: number;
  asset_group?: number;
  browser_type?: string;
  asset_type?: number[];
  room_count?: number[];
  is_verified?: boolean;
  search_latitude?: number;
  search_longitude?: number;
  asset_transaction_type?: string;
  user_location_latitude?: number | null;
  user_location_longitude?: number | null;
  miscellaneous_search_criteria?: {
    property_age?: IUnit;
    search_radius?: IUnit;
    agent_listed?: boolean;
    expected_move_in_date?: string;
    property_amenities?: number[];
    date_added?: IUnit;
    facing?: string[];
    rent_free_period?: IUnit;
    furnishing_status?: FurnishingTypes[];
    search_radius_unit: string;
  };
}
