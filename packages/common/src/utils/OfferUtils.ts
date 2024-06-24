import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IOfferValue, Offer, OfferAction, Status } from '@homzhub/common/src/domain/models/Offer';
import { MadeSort, OfferFilter, OfferSort } from '@homzhub/common/src/constants/Offers';
import {
  IExistingProposalsLease,
  IExistingProposalsSale,
  IFormattedDetails,
  IOfferCompare,
} from '@homzhub/common/src/modules/offers/interfaces';

interface IActionStyle {
  title: string;
  icon?: string;
  iconColor?: string;
  container: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  onAction?: () => void;
}

interface IActionPayload {
  item: string;
  initialButtonStyle: ViewStyle;
  initialTextStyle: TextStyle;
  onAction?: (action: OfferAction) => void;
}

class OfferUtils {
  public getOfferValues = (
    offer: Offer,
    compareData: IOfferCompare,
    currency: string,
    isCountered?: boolean
  ): IOfferValue[] => {
    const {
      annualRentIncrementPercentage: percentage,
      securityDeposit,
      moveInDate,
      price,
      bookingAmount,
      counterOffersCount,
    } = offer;
    const data = this.getOfferHeader(offer, compareData, currency);

    const annualRent = {
      key: I18nService.t('property:annualIncrementSuffix'),
      value: percentage ? `${currency} ${percentage}` : '',
      icon: this.offerComparison(percentage ?? 0, compareData.incrementPercentage).icon,
      iconColor: this.offerComparison(percentage ?? 0, compareData.incrementPercentage).color,
    };

    if (price > 0) {
      return [
        ...(isCountered && counterOffersCount ? [data] : []),
        {
          key: I18nService.t('property:bookingAmount'),
          value: `${currency} ${bookingAmount}`,
          icon: this.offerComparison(bookingAmount, compareData.bookingAmount).icon,
          iconColor: this.offerComparison(bookingAmount, compareData.bookingAmount).color,
        },
      ];
    }

    return [
      ...(isCountered && counterOffersCount ? [data] : []),
      ...(percentage ? [annualRent] : []),
      {
        key: I18nService.t('property:securityDeposit'),
        value: `${currency} ${securityDeposit}`,
        icon: this.offerComparison(securityDeposit, compareData.deposit).icon,
        iconColor: this.offerComparison(securityDeposit, compareData.deposit).color,
      },
      {
        key: I18nService.t('property:moveInDate'),
        value: DateUtils.getUtcFormatted(moveInDate, DateFormats.YYYYMMDD, 'DD MMM, YYYY'),
      },
    ];
  };

  public getOfferHeader = (offer: Offer, compareData: IOfferCompare, currency: string): IOfferValue => {
    const { rent, price } = offer;

    if (rent >= 0) {
      return {
        key: I18nService.t('property:rent'),
        value: `${currency} ${rent}`,
        icon: this.offerComparison(rent, compareData.rent).icon,
        iconColor: this.offerComparison(rent, compareData.rent).color,
      };
    }

    return {
      key: I18nService.t('property:sellingPrice'),
      value: `${currency} ${price}`,
      icon: this.offerComparison(price, compareData.price).icon,
      iconColor: this.offerComparison(price, compareData.price).color,
    };
  };

  public getActionData = (payload: IActionPayload): IActionStyle => {
    const { item, onAction, initialButtonStyle, initialTextStyle } = payload;
    switch (item) {
      case OfferAction.ACCEPT:
        return {
          title: StringUtils.toTitleCase(item),
          icon: icons.circularCheckFilled,
          iconColor: theme.colors.green,
          onAction: (): void => (onAction ? onAction(OfferAction.ACCEPT) : FunctionUtils.noop()),
          container: {
            ...initialButtonStyle,
            backgroundColor: theme.colors.reviewCardOpacity,
          },
          textStyle: {
            ...initialTextStyle,
            color: theme.colors.green,
          },
        };
      case OfferAction.REJECT:
        return {
          title: StringUtils.toTitleCase(item),
          icon: icons.circularCrossFilled,
          iconColor: theme.colors.red,
          onAction: (): void => (onAction ? onAction(OfferAction.REJECT) : FunctionUtils.noop()),
          container: {
            ...initialButtonStyle,
            backgroundColor: theme.colors.redOpacity,
          },
          textStyle: {
            ...initialTextStyle,
            color: theme.colors.red,
          },
        };
      case OfferAction.CANCEL:
        return {
          title: I18nService.t('offers:cancelOffer'),
          onAction: (): void => (onAction ? onAction(OfferAction.CANCEL) : FunctionUtils.noop()),
          container: {
            backgroundColor: theme.colors.transparent,
          },
          textStyle: {
            color: theme.colors.red,
          },
        };
      default:
        return {
          title: I18nService.t('offers:cancelOffer'),
          container: {
            backgroundColor: theme.colors.transparent,
          },
          textStyle: {
            color: theme.colors.red,
          },
        };
    }
  };

  public getButtonStatus = (status?: Status): IActionStyle => {
    const handleNegativeStatuses = (title: string): IActionStyle => ({
      title,
      icon: icons.circularCrossFilled,
      iconColor: theme.colors.error,
      container: {
        backgroundColor: theme.colors.redOpacity,
        flexDirection: 'row-reverse',
        flex: !PlatformUtils.isWeb() ? 0 : undefined,
      },
      textStyle: {
        color: theme.colors.error,
        marginHorizontal: 8,
      },
    });

    if (!status) return handleNegativeStatuses(I18nService.t('offers:offerExpired'));

    switch (status) {
      case Status.ACCEPTED:
        return {
          title: I18nService.t('offers:offerAccepted'),
          icon: icons.circularCheckFilled,
          iconColor: theme.colors.green,
          container: {
            backgroundColor: theme.colors.greenOpacity,
            flexDirection: 'row-reverse',
            flex: 0,
          },
          textStyle: {
            color: theme.colors.green,
            marginHorizontal: 8,
          },
        };
      case Status.REJECTED:
        return handleNegativeStatuses(I18nService.t('offers:offerRejected'));
      case Status.CANCELLED:
        return handleNegativeStatuses(I18nService.t('offers:offerCancelled'));
      case Status.PENDING:
      default:
        return {
          title: I18nService.t('property:awaiting'),
          icon: icons.wait,
          iconColor: theme.colors.darkTint5,
          container: {
            backgroundColor: theme.colors.grayOpacity,
            flexDirection: 'row-reverse',
            flex: !PlatformUtils.isWeb() ? 0 : undefined,
          },
          textStyle: {
            color: theme.colors.darkTint3,
            marginHorizontal: 8,
          },
        };
    }
  };

  public offerComparison = (value: number, compareValue = 0): { icon: string; color: string } => {
    if (value > compareValue) {
      return {
        icon: icons.arrowUp,
        color: theme.colors.green,
      };
    }
    if (value < compareValue) {
      return {
        icon: icons.arrowDown,
        color: theme.colors.error,
      };
    }

    return {
      icon: '',
      color: '',
    };
  };

  // Filter By logic for Offer Detail Section
  public getFilteredOffer = (key: string, data: Offer[]): Offer[] => {
    switch (key) {
      case OfferFilter.PENDING_ACTION:
        return data.filter((item) => item.actions.length === 2);
      case OfferFilter.WAITING_PROSPECT:
        return data.filter((item) => item.actions.length === 1);
      case OfferFilter.ACCEPTED:
        return data.filter((item) => item.status === Status.ACCEPTED);
      case OfferFilter.REJECTED:
      case OfferFilter.REJECTED_PROSPECT:
        return data.filter((item) => item.status === Status.REJECTED);
      case OfferFilter.EXPIRING:
        return data.filter((item) => DateUtils.getTimeElapsedInDays(item.expiresAt, 'hours') > -13);
      default:
        return data;
    }
  };

  // Sort By logic for Offer Detail Section
  public getSortedOffer = (key: string, data: Offer[]): Offer[] => {
    switch (key) {
      case OfferSort.OLDEST:
        return data.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case OfferSort.NEWEST:
        return data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case OfferSort.BEST:
        return data.slice().sort((a, b) => (b.rent || b.price) - (a.rent || a.price));
      default:
        return data;
    }
  };

  // Sort By logic for Offer Made Section
  public getSortedOfferMade = (key: string, data: Asset[]): Asset[] => {
    switch (key) {
      case MadeSort.NEWEST:
        return data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.leaseNegotiation?.createdAt || b.saleNegotiation?.createdAt || '').getTime() -
              new Date(a.leaseNegotiation?.createdAt || a.saleNegotiation?.createdAt || '').getTime()
          );
      case MadeSort.HIGH_LOW:
        return data
          .slice()
          .sort(
            (a, b) =>
              (b.leaseNegotiation?.rent || b.saleNegotiation?.price || 0) -
              (a.leaseNegotiation?.rent || a.saleNegotiation?.price || 0)
          );
      case MadeSort.LOW_HIGH:
        return data
          .slice()
          .sort(
            (a, b) =>
              (a.leaseNegotiation?.rent || a.saleNegotiation?.price || 0) -
              (b.leaseNegotiation?.rent || b.saleNegotiation?.price || 0)
          );
      default:
        return data;
    }
  };

  // Used in OfferDetailsCard
  public getFormattedOfferDetails = (
    isRentFlow: boolean,
    isCounterOfferFlow: boolean,
    listing: Asset | null,
    previousOfferDetailsRent: IExistingProposalsLease | null,
    previousOfferDetailsSale: IExistingProposalsSale | null
  ): IFormattedDetails[] => {
    const { t } = I18nService;

    if (listing) {
      const currency = listing.currencyData;
      const { currencySymbol, currencyCode } = currency;

      if (isRentFlow && previousOfferDetailsRent && Number(previousOfferDetailsRent.expectedPrice) !== -1) {
        const {
          expectedPrice,
          minimumLeasePeriod,
          maximumLeasePeriod,
          maintenancePaidBy,
          utilityPaidBy,
          securityDeposit,
          annualRentIncrementPercentage,
          availableFromDate,
        } = previousOfferDetailsRent;
        const formattedRent = [
          {
            type: t('property:rent'),
            value: `${currencySymbol} ${CurrencyUtils.getCurrency(currencyCode, Number(expectedPrice))}`,
          },
          {
            type: t('property:securityDeposit'),
            value: `${currencySymbol} ${CurrencyUtils.getCurrency(currencyCode, Number(securityDeposit))}`,
          },
          {
            type: t('offers:lockInPeriod'),
            value: `${minimumLeasePeriod} ${t('common:months')}`,
          },
          {
            type: t('offers:maxLeasePeriod'),
            value: `${maximumLeasePeriod} ${t('common:months')}`,
          },
          {
            type: t('property:maintenanceBy'),
            value: `${StringUtils.toTitleCase(maintenancePaidBy)}`,
          },
          {
            type: t('property:utilityBy'),
            value: `${StringUtils.toTitleCase(utilityPaidBy)}`,
          },
        ];
        if (annualRentIncrementPercentage) {
          formattedRent.splice(4, 0, {
            type: t('property:annualIncrementSuffix'),
            value: `${annualRentIncrementPercentage}%`,
          });
        }

        if (isCounterOfferFlow) {
          formattedRent.splice(5, 0, {
            type: t('property:moveInDate'),
            value: `${DateUtils.getDisplayDate(availableFromDate, DateFormats.DDMMMYYYY)}`,
          });
        }
        return formattedRent;
      }

      if (!isRentFlow && previousOfferDetailsSale && Number(previousOfferDetailsSale.expectedPrice) !== -1) {
        const { expectedBookingAmount, expectedPrice } = previousOfferDetailsSale;
        const formattedSale = [
          {
            type: t('offers:sellPrice'),
            value: `${currencySymbol} ${CurrencyUtils.getCurrency(currencyCode, Number(expectedPrice))}`,
          },
          {
            type: t('property:bookingAmount'),
            value: `${currencySymbol} ${CurrencyUtils.getCurrency(currencyCode, Number(expectedBookingAmount))}`,
          },
        ];
        return formattedSale;
      }
    }
    return [];
  };
}

const offerUtils = new OfferUtils();
export { offerUtils as OfferUtils };
