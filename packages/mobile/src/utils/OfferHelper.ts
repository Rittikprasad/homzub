import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { OffersVisitsType } from '@homzhub/common/src/constants/Offers';
import { ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IVisitAction {
  type: OffersVisitsType;
  name: string;
  id: number;
  leaseListingId: number | null;
  saleListingId: number | null;
}

class OfferHelper {
  public handleOfferActions = (action: OfferAction): void => {
    const {
      navigation: { navigate },
    } = NavigationService;
    switch (action) {
      case OfferAction.ACCEPT:
        navigate(ScreensKeys.AcceptOffer);
        break;
      case OfferAction.REJECT:
        navigate(ScreensKeys.RejectOffer);
        break;
      case OfferAction.COUNTER:
        navigate(ScreensKeys.SubmitOffer);
        break;
      case OfferAction.CANCEL:
        navigate(ScreensKeys.CancelOffer);
        break;
      default:
        FunctionUtils.noop();
    }
  };

  public handleOfferVisitAction = (props: IVisitAction): void => {
    const store = StoreProviderService.getStore();
    const {
      navigation: { navigate },
    } = NavigationService;

    const { type, name, id, leaseListingId, saleListingId } = props;

    store.dispatch(
      OfferActions.setCurrentOfferPayload({
        type: leaseListingId ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
        listingId: leaseListingId || saleListingId || 0,
      })
    );

    const param = {
      isFromPortfolio: true,
      isFromTenancies: false,
      screenTitle: name,
      propertyId: id,
    };

    switch (type) {
      case OffersVisitsType.offers:
        navigate(ScreensKeys.OfferDetail, param);
        break;
      case OffersVisitsType.visits:
        navigate(ScreensKeys.PropertyVisits, param);
        break;
      default:
        FunctionUtils.noop();
    }
  };
}

const offerHelperUtils = new OfferHelper();
export { offerHelperUtils as OfferHelper };
