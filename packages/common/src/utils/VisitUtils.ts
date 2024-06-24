import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IAssetVisitPayload, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { DateFilter, IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';
import { MISSED_COMPLETED_DATA, UPCOMING_DROPDOWN_DATA } from '@homzhub/common/src/constants/SiteVisit';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IVisitPayload {
  assetPayload: ISetAssetPayload;
  isFromProperty: boolean;
  visitType: Tabs;
  dropdownValue?: DateFilter;
  startDate?: string;
  endDate?: string;
  visitId?: number | null;
  selectedAssetId?: number;
  setVisitPayload?: (payload: IAssetVisitPayload) => void;
}

class VisitUtils {
  public getVisitPayload = (data: IVisitPayload): IAssetVisitPayload | null => {
    const { visitType, dropdownValue, isFromProperty, assetPayload, selectedAssetId, setVisitPayload } = data;
    const date = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    let dropdownData: IDropdownObject[] = [];
    let key = '';

    let start_date_lte;
    let start_date_gte;
    let lease_listing_id;
    let sale_listing_id;
    let start_date_lt;
    let status__in;

    switch (visitType) {
      case Tabs.UPCOMING:
        dropdownData = this.getDropdownData(Tabs.UPCOMING);
        key = Tabs.UPCOMING;
        start_date_gte = date;
        status__in = this.getStatus(Tabs.UPCOMING);
        break;
      case Tabs.MISSED:
        dropdownData = this.getDropdownData(Tabs.MISSED);
        key = Tabs.MISSED;
        start_date_lt = date; // TODO: Team - Reconfirm Logic
        status__in = this.getStatus(Tabs.MISSED);
        break;
      case Tabs.COMPLETED:
        dropdownData = this.getDropdownData(Tabs.COMPLETED);
        key = Tabs.COMPLETED;
        start_date_lte = date;
        status__in = this.getStatus(Tabs.COMPLETED);
        break;
      default:
    }

    const selectedData = dropdownData.find((item) => item.value === dropdownValue);

    if (selectedData) {
      start_date_gte =
        key === (Tabs.UPCOMING || Tabs.MISSED) && selectedData.startDate < date ? date : selectedData.startDate;
      start_date_lt = selectedData.endDate;
    }

    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date_lte && { start_date__lte: start_date_lte }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(start_date_lt && { start_date__lt: start_date_lt }),
        ...(status__in && { status__in }),
      });
    }

    if (isFromProperty && assetPayload && assetPayload.assetType) {
      if (assetPayload.lease_listing_id) {
        lease_listing_id = assetPayload.lease_listing_id;
      } else if (assetPayload.sale_listing_id) {
        sale_listing_id = assetPayload.sale_listing_id;
      } else {
        return null;
      }
    }

    return {
      ...(start_date_lte && { start_date__lte: start_date_lte }),
      ...(key === Tabs.MISSED && start_date_lt && { start_date__lt: start_date_lt }), // TODO: Team - Reconfirm Logic
      ...(start_date_gte && { start_date__gte: start_date_gte }),
      ...(isFromProperty && lease_listing_id && { lease_listing_id }),
      ...(isFromProperty && sale_listing_id && { sale_listing_id }),
      ...(selectedAssetId && selectedAssetId !== 0 && { asset_id: selectedAssetId }),
      ...(status__in && { status__in }),
    };
  };

  public onDropdownValueSelect = (data: IVisitPayload): IAssetVisitPayload | null => {
    const { isFromProperty, assetPayload, selectedAssetId, setVisitPayload, startDate, endDate, visitType } = data;
    const status__in = this.getStatus(visitType);
    const start_date__lte = endDate;
    const start_date__gte = startDate;
    let lease_listing_id;
    let sale_listing_id;

    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date__gte && { start_date__gte }),
        ...(start_date__lte && { start_date__lte }),
        ...(status__in && { status__in }),
      });
    }

    if (isFromProperty && assetPayload && assetPayload.assetType) {
      if (assetPayload.lease_listing_id) {
        lease_listing_id = assetPayload.lease_listing_id;
      } else if (assetPayload.sale_listing_id) {
        sale_listing_id = assetPayload.sale_listing_id;
      } else {
        return null;
      }
    }

    return {
      start_date__lte,
      start_date__gte,
      ...(status__in && { status__in }),
      ...(isFromProperty && lease_listing_id && { lease_listing_id }),
      ...(isFromProperty && sale_listing_id && { sale_listing_id }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
    };
  };

  public getStatus = (visitType: Tabs): string => {
    switch (visitType) {
      case Tabs.UPCOMING:
        return `${VisitStatus.ACCEPTED},${VisitStatus.PENDING}`;
      case Tabs.MISSED:
        return `${VisitStatus.PENDING},${VisitStatus.CANCELLED},${VisitStatus.REJECTED}`;
      case Tabs.COMPLETED:
        return VisitStatus.ACCEPTED;
      default:
        return '';
    }
  };

  public getDropdownData = (visitType: Tabs): IDropdownObject[] => {
    let results;
    switch (visitType) {
      case Tabs.UPCOMING:
        results = Object.values(UPCOMING_DROPDOWN_DATA);
        break;
      case Tabs.MISSED:
      case Tabs.COMPLETED:
        results = Object.values(MISSED_COMPLETED_DATA);
        break;
      default:
        results = Object.values(MISSED_COMPLETED_DATA);
    }

    return results.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: I18nService.t(currentData.label),
      };
    });
  };
}

const visitUtils = new VisitUtils();
export { visitUtils as VisitUtils };
