import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  DetailType,
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { acceptOffer } from '@homzhub/common/src/constants/ProspectProfile';

interface IStateToProps {
  offer: Offer | null;
  listing: Asset | null;
  compareData: IOfferCompare;
}

interface IDispatchProps {
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

interface IScreenState {
  isBottomSheetVisible: boolean;
  isLoading: boolean;
}

interface IOwner {
  text: string;
}

type LibProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.AcceptOffer>;
type Props = LibProps & IStateToProps & IDispatchProps;

class AcceptOffer extends Component<Props, IScreenState> {
  public state = {
    isBottomSheetVisible: false,
    isLoading: false,
  };

  public render(): React.ReactNode {
    const { t, navigation } = this.props;
    const { isLoading } = this.state;
    return (
      <UserScreen
        isOuterScrollEnabled
        title={t('offers')}
        pageTitle={t('offers:acceptOffer')}
        onBackPress={navigation.goBack}
        loading={isLoading}
      >
        {this.renderAcceptOffer()}
      </UserScreen>
    );
  }

  private renderAcceptOffer = (): React.ReactElement => {
    const { t, offer, listing, compareData } = this.props;

    if (!offer || !listing) {
      return <EmptyState />;
    }

    return (
      <View style={styles.container}>
        <OfferCard offer={offer} asset={listing} isFromAccept compareData={compareData} />
        <Button
          type="primary"
          iconSize={20}
          icon={icons.circularCheckFilled}
          iconColor={theme.colors.green}
          title={t('common:accept')}
          onPress={this.onOpenBottomSheet}
          containerStyle={styles.acceptButton}
          titleStyle={styles.acceptText}
        />
        {this.renderBottomSheet()}
      </View>
    );
  };

  public renderBottomSheet = (): React.ReactNode => {
    const { isBottomSheetVisible, isLoading } = this.state;
    const { t, offer, listing } = this.props;

    const info = offer && offer.isAssetOwner ? acceptOffer.owner : acceptOffer.tenant;
    const isLease = listing && listing.leaseTerm;

    return (
      <BottomSheet
        visible={isBottomSheetVisible}
        sheetHeight={theme.viewport.height * 0.7}
        onCloseSheet={this.onCloseBottomSheet}
      >
        <ScrollView>
          <View style={styles.bottomSheetContainer}>
            <Text textType="semiBold" type="large">
              {t('common:congratulations')}
            </Text>
            <Text textType="regular" type="small" style={styles.marginVertical}>
              {t('offers:aboutToRent')}
            </Text>
            <View style={styles.icon}>
              <Icon name={icons.doubleCheck} size={60} color={theme.colors.completed} />
            </View>

            <Label type="large" textType="semiBold" style={styles.marginVertical}>
              {t('offers:keepInMind')}
            </Label>
            <View style={styles.textView}>
              {info.map((item: IOwner, index: number) => (
                <Label key={index} type="large" textType="regular" style={styles.text} textBreakStrategy="simple">
                  {item.text}
                </Label>
              ))}
            </View>
          </View>
          <Button
            type="primary"
            title={isLease ? t('offers:acceptAndLease') : t('offers:acceptOffer')}
            containerStyle={[styles.button, styles.marginVertical]}
            onPress={this.handleAcceptOffer}
            disabled={isLoading}
          />
        </ScrollView>
      </BottomSheet>
    );
  };

  public onOpenBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: true });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  public toggleLoading = (): void => {
    this.setState((prevState) => ({ isLoading: !prevState.isLoading }));
  };

  public handleAcceptOffer = async (): Promise<void> => {
    const { t, listing, offer, navigation, setCurrentAsset } = this.props;
    if (!listing || !offer) return;
    const { saleTerm, leaseTerm } = listing;
    const payload: INegotiationPayload = {
      param: {
        listingType: saleTerm ? ListingType.SALE_LISTING : ListingType.LEASE_LISTING,
        listingId: saleTerm ? saleTerm.id : leaseTerm?.id ?? 0,
        negotiationType: saleTerm ? NegotiationType.SALE_NEGOTIATIONS : NegotiationType.LEASE_NEGOTIATIONS,
        negotiationId: offer.id,
      },
      data: {
        action: NegotiationAction.ACCEPT,
        payload: {},
      },
    };
    try {
      this.toggleLoading();
      await OffersRepository.updateNegotiation(payload);
      this.onCloseBottomSheet();
      this.toggleLoading();

      if (leaseTerm) {
        if (offer.isAssetOwner) {
          navigation.navigate(ScreensKeys.CreateLease);
        } else {
          navigation.goBack();
        }
      } else {
        setCurrentAsset({
          asset_id: listing.id,
          listing_id: listing.saleTerm ? listing.saleTerm.id : 0,
          assetType: DetailType.SALE_LISTING,
        });

        navigation.navigate(ScreensKeys.PropertyDetailScreen);
      }

      AlertHelper.success({ message: t('offers:offerAcceptedSuccess') });
    } catch (e) {
      this.onCloseBottomSheet();
      this.toggleLoading();
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  const { getCurrentOffer, getListingDetail, getOfferCompareData } = OfferSelectors;
  return {
    offer: getCurrentOffer(state),
    listing: getListingDetail(state),
    compareData: getOfferCompareData(state),
  };
};
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentAsset } = PortfolioActions;
  return bindActionCreators(
    {
      setCurrentAsset,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AcceptOffer));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  acceptButton: {
    marginHorizontal: 16,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.greenOpacity,
    marginVertical: 60,
  },
  acceptText: {
    marginHorizontal: 8,
    color: theme.colors.green,
  },
  text: {
    color: theme.colors.darkTint4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    textAlign: 'center',
  },
  bottomSheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginVertical: {
    marginVertical: 16,
  },
  textView: {
    paddingHorizontal: 24,
  },
  button: {
    marginHorizontal: 16,
  },
  icon: {
    borderWidth: 10,
    borderRadius: 120 / 2,
    backgroundColor: theme.colors.greenOpacity,
    borderColor: theme.colors.greenOpacity,
  },
});
