import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { OfferHelper } from '@homzhub/mobile/src/utils/OfferHelper';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import CompareSelection from '@homzhub/mobile/src/components/molecules/CompareSelection';
import PropertyOffers from '@homzhub/common/src/components/molecules/PropertyOffers';
import CompareOfferView from '@homzhub/mobile/src/components/organisms/CompareOfferView';
import OfferView from '@homzhub/common/src/components/organisms/OfferView';
import { ICommonNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const OfferDetail = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute();
  const [selectedOffer, setSelectedOffer] = useState<number[]>([]);
  const [isCompare, setCompareVisibility] = useState(false);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const loaders = useSelector(OfferSelectors.getOfferLoaders);
  const dispatch = useDispatch();
  const param = params as ICommonNavProps;

  useFocusEffect(
    useCallback(() => {
      if (offerPayload) {
        dispatch(OfferActions.getListingDetail(offerPayload));
      }
      setSelectedOffer([]);
    }, [])
  );

  const handleBack = (): void => {
    dispatch(OfferActions.clearState());
    goBack();
  };

  const onPressMessages = (): void => {
    navigate(ScreensKeys.ChatScreen, {
      isFromOffers: true,
      isFromPortfolio: param?.isFromPortfolio,
    });
  };

  const handleCreateLease = (): void => {
    navigate(ScreensKeys.CreateLease);
  };

  const handleOfferSelection = (id: number): void => {
    const updatedArray = [...selectedOffer];

    if (selectedOffer.includes(id)) {
      const index = updatedArray.map((item) => item).indexOf(id);
      updatedArray.splice(index, 1);
    } else {
      if (updatedArray.length === 3) {
        AlertHelper.error({ message: t('offers:maxOffer') });
        return;
      }
      updatedArray.push(id);
    }

    setSelectedOffer(updatedArray);
  };

  const handleSelectionClear = (): void => {
    setSelectedOffer([]);
  };

  const handleCompare = (isVisible?: boolean): void => {
    setCompareVisibility(isVisible ?? true);
    if (!isVisible) {
      handleSelectionClear();
    }
  };

  const getTitle = (): string => {
    if (!param) return t('offers');

    return param.isFromPortfolio ? param?.screenTitle ?? '' : t('offers');
  };

  const isListingLoader = !listingDetail && !(param && param.isFromPortfolio);

  return (
    <>
      <UserScreen
        title={getTitle()}
        backgroundColor={theme.colors.background}
        pageTitle={param && param.isFromPortfolio ? t('offers') : t('offers:offerDetails')}
        onBackPress={handleBack}
        headerStyle={styles.headerStyle}
        loading={loaders.negotiations || isListingLoader}
      >
        {!(param && param.isFromPortfolio) && listingDetail && (
          <PropertyOffers propertyOffer={listingDetail} isCardExpanded isDetailView />
        )}
        <OfferView
          onPressAction={OfferHelper.handleOfferActions}
          isDetailView={!param?.isFromPortfolio}
          onCreateLease={handleCreateLease}
          onSelectOffer={handleOfferSelection}
          selectedOffers={selectedOffer}
          onPressMessages={onPressMessages}
        />
      </UserScreen>
      {selectedOffer.length > 0 && (
        <CompareSelection selected={selectedOffer.length} onClear={handleSelectionClear} onCompare={handleCompare} />
      )}
      <BottomSheet
        visible={isCompare}
        sheetHeight={500}
        headerTitle={t('offers:compareOffer')}
        onCloseSheet={(): void => handleCompare(false)}
      >
        <CompareOfferView
          handleCompare={handleCompare}
          selectedIds={selectedOffer}
          isLeaseFlow={!!(listingDetail && listingDetail.leaseTerm)}
        />
      </BottomSheet>
    </>
  );
};

export default OfferDetail;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: theme.colors.white,
  },
});
