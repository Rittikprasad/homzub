import { cloneDeep, groupBy, remove } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IFormData, LeaseFormKeys } from '@homzhub/common/src/components/molecules/LeaseTermForm';
import { IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { DeviceType, IFilter, ISearchHistoryPayload } from '@homzhub/common/src/domain/models/Search';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';
import { IPropertySearchPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';

// CONSTANTS
const DEFAULT_SEARCH_RADIUS = 3;
const DATE_ADDED = [
  null,
  DateUtils.getDate(1),
  DateUtils.getDate(3),
  DateUtils.getDate(7),
  DateUtils.getDate(14),
  DateUtils.getDate(28),
];

class AssetService {
  public constructAssetSearchPayload = (filter: IFilter): IPropertySearchPayload => {
    const {
      search_latitude,
      search_longitude,
      asset_type,
      min_price,
      max_price,
      room_count,
      bath_count,
      asset_group,
      limit,
      offset,
      min_area,
      max_area,
      area_unit,
      currency_code,
      sort_by,
      miscellaneous,
    } = filter;
    let miscellaneousData;
    if (miscellaneous) {
      const {
        show_verified,
        agent_listed,
        search_radius,
        date_added,
        // property_age,
        rent_free_period,
        // expected_move_in_date,
        facing,
        furnishing,
        propertyAmenity,
        search_radius_unit,
      } = miscellaneous;

      miscellaneousData = {
        // move_in_date__gte: expected_move_in_date,
        ...(furnishing.length > 0 ? { furnishing__in: furnishing.toString() } : {}),
        ...(facing.length > 0 ? { facing__in: facing.toString() } : {}),
        ...(propertyAmenity.length > 0 ? { amenities__in: propertyAmenity.toString() } : {}),
        ...(rent_free_period.id !== -1 ? { rent_free_period: rent_free_period.id } : {}),
        ...(show_verified ? { is_verified: show_verified } : {}),
        ...(agent_listed ? { agent_listed } : {}),
        // ...{property_age.id !== -1 && { age__gte: PROPERTY_AGE[property_age.id - 1] } },
        ...(search_radius.id === -1 ? { search_radius: DEFAULT_SEARCH_RADIUS } : { search_radius: search_radius.id }),
        ...(date_added.id !== -1 ? { date_added__gte: DATE_ADDED[date_added.id - 1] } : {}),
        ...(search_radius_unit ? { search_radius_unit } : { search_radius_unit: 'km' }),
      };
    }
    const bedroomCount = cloneDeep(room_count);

    if (bedroomCount) {
      remove(bedroomCount, (count: number) => count === -1);
    }
    const searchCords = GeolocationService.getFormattedCords(search_latitude ?? 0, search_longitude ?? 0);
    const finalPayload = {
      asset_group,
      price__gte: min_price,
      price__lte: max_price,
      latitude: searchCords.latValue,
      longitude: searchCords.lngValue,
      limit,
      offset,
      currency_code,
      ...(sort_by && { sort_by }),
      bathroom__gte: bath_count,
      ...miscellaneousData,
    };
    if (asset_type && asset_type.length > 0) {
      Object.assign(finalPayload, { asset_type__in: asset_type.toString() });
    }
    if (bedroomCount && bedroomCount.includes(5)) {
      Object.assign(finalPayload, { bedroom__gte: 5 });
      remove(bedroomCount, (count: number) => count === 5);
    }
    if (bedroomCount && bedroomCount.length > 0) {
      Object.assign(finalPayload, { bedroom__in: bedroomCount.toString() });
    }
    if (asset_group === 2) {
      // Apply only for Commercial Properties
      Object.assign(finalPayload, {
        carpet_area__lte: Number(max_area),
        carpet_area__gte: Number(min_area),
        carpet_area_unit: area_unit,
      });
    }
    return finalPayload;
  };

  public extractLeaseParams = (values: IFormData, assetGroupType: AssetGroupTypes): any => {
    const params: any = {
      expected_monthly_rent: parseInt(values[LeaseFormKeys.monthlyRent], 10),
      security_deposit: parseFloat(values[LeaseFormKeys.securityDeposit]),
      annual_rent_increment_percentage: parseFloat(values[LeaseFormKeys.annualIncrement]),
      available_from_date: values[LeaseFormKeys.availableFrom],
      minimum_lease_period: values[LeaseFormKeys.minimumLeasePeriod],
      maximum_lease_period: values[LeaseFormKeys.maximumLeasePeriod],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      maintenance_amount: parseInt(values[LeaseFormKeys.maintenanceAmount], 10),
      maintenance_payment_schedule: values[LeaseFormKeys.maintenanceSchedule],
      maintenance_unit: values[LeaseFormKeys.maintenanceUnit],
      ...(values[LeaseFormKeys.description] && { description: values[LeaseFormKeys.description] }),
      rent_free_period: parseInt(values[LeaseFormKeys.rentFreePeriod], 10) || null,
    };

    if (!values[LeaseFormKeys.showMore]) {
      params.annual_rent_increment_percentage = null;
    }

    if (values[LeaseFormKeys.maintenanceBy] === PaidByTypes.OWNER) {
      params.maintenance_amount = null;
      params.maintenance_payment_schedule = null;
      params.maintenance_unit = null;
    } else if (assetGroupType === AssetGroupTypes.COM) {
      params.maintenance_payment_schedule = null;
    } else if (assetGroupType === AssetGroupTypes.RES) {
      params.maintenance_unit = null;
    }

    return params;
  };

  public getVisitAssetByCountry = async (): Promise<IVisitByKey[]> => {
    try {
      const response = await AssetRepository.getAllVisitAsset();
      const groupData = groupBy(response, (results) => {
        return results.country.iso2Code;
      });

      return Object.keys(groupData).map((code) => {
        const results: VisitAssetDetail[] = groupData[code];
        return {
          key: code,
          results,
        };
      });
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      return [];
    }
  };

  public getSearchHistoryPayload = (filter: IFilter, count: number): ISearchHistoryPayload => {
    const {
      asset_group,
      asset_transaction_type,
      max_price,
      min_price,
      currency_code,
      search_latitude,
      search_longitude,
      asset_type,
      bath_count,
      room_count,
      miscellaneous,
      user_location_longitude,
      user_location_latitude,
    } = filter;
    let miscellaneous_search_criteria;

    if (miscellaneous) {
      const {
        property_age,
        date_added,
        search_radius,
        rent_free_period,
        agent_listed,
        expected_move_in_date,
        facing,
        furnishing,
        search_radius_unit,
      } = miscellaneous;
      miscellaneous_search_criteria = {
        ...(property_age && property_age.id > 0 && { property_age }),
        ...(date_added && date_added.id > 0 && { date_added }),
        ...(search_radius && search_radius.id > 0 && { search_radius }),
        ...(rent_free_period && rent_free_period.id > 0 && { rent_free_period }),
        ...(facing.length > 0 && { facing }),
        ...(furnishing.length > 0 && { furnishing_status: furnishing }),
        agent_listed,
        expected_move_in_date,
        search_radius_unit,
      };
    }
    const { latValue, lngValue } = GeolocationService.getFormattedCords(
      user_location_latitude ?? 0,
      user_location_longitude ?? 0
    );
    const searchCords = GeolocationService.getFormattedCords(search_latitude ?? 0, search_longitude ?? 0);

    return {
      device_id: DeviceUtils.getDeviceId(),
      device_type: DeviceType.MOBILE,
      results_count: count,
      currency: currency_code,
      asset_group,
      search_latitude: searchCords.latValue,
      search_longitude: searchCords.lngValue,
      min_price,
      max_price,
      ...(bath_count && bath_count > 0 && { bath_count }),
      ...(room_count && room_count.length > 0 && room_count[0] > 0 && { room_count }),
      asset_type,
      user_location_latitude: latValue || null,
      user_location_longitude: lngValue || null,
      asset_transaction_type: asset_transaction_type === 0 ? 'RENT' : 'BUY',
      miscellaneous_search_criteria,
    };
  };
}

const assetService = new AssetService();
export { assetService as AssetService };
