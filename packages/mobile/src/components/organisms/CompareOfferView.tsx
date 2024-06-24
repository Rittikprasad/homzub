import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { OfferHelper } from '@homzhub/mobile/src/utils/OfferHelper';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import OfferCompareTable from '@homzhub/mobile/src/components/organisms/OfferCompareTable';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import OfferProspectTable from '@homzhub/mobile/src/components/organisms/OfferProspectTable';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  selectedIds: number[];
  isLeaseFlow?: boolean;
  handleCompare: (isVisible?: boolean) => void;
}

const CompareOfferView = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { selectedIds, isLeaseFlow = true, handleCompare } = props;
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [selectedNegotiationId, setSelectedNegotiationId] = useState(-1);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [routes] = useState([
    { key: 'offer', title: t('offers:compareOffer') },
    { key: 'prospect', title: t('offers:compareProspect') },
  ]);

  const selectedNegotiation = useSelector(OfferSelectors.getNegotiations).filter(
    (item) => item.id === selectedNegotiationId
  )[0];

  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const isBottomSheetVisible = selectedNegotiationId !== -1 && showBottomSheet;

  const onPressRow = (id: number): void => {
    setSelectedNegotiationId(id);
    setShowBottomSheet(true);
  };

  const closeBothBottomSheets = (): void => {
    setShowBottomSheet(false);
    handleCompare(false);
  };

  const handleAction = (action: OfferAction): void => {
    dispatch(OfferActions.setCurrentOffer(selectedNegotiation));
    closeBothBottomSheets();
    OfferHelper.handleOfferActions(action);
  };

  const closeOfferDetailSheet = (): void => setShowBottomSheet(false);

  const onPressMessageIcon = (): void => {
    if (listingDetail) {
      const { leaseTerm, saleTerm } = listingDetail;
      dispatch(
        OfferActions.setCurrentOfferPayload({
          type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
          listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
          threadId: selectedNegotiation.threadId,
        })
      );
      closeBothBottomSheets();
      navigate(ScreensKeys.ChatScreen, { isFromOffers: true });
    }
  };

  const renderBottomSheet = (): React.ReactElement => {
    const sheetHeight = isLeaseFlow ? 600 : 525;
    return (
      <>
        {listingDetail && (
          <BottomSheet visible={isBottomSheetVisible} sheetHeight={sheetHeight} onCloseSheet={closeOfferDetailSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <OfferCard
                key={selectedNegotiationId}
                offer={selectedNegotiation}
                isDetailView
                isOfferDashboard
                asset={listingDetail}
                compareData={compareData}
                onPressAction={handleAction}
                onPressMessages={onPressMessageIcon}
              />
            </ScrollView>
          </BottomSheet>
        )}
      </>
    );
  };

  const renderTabView = (): React.ReactElement => {
    const renderScene = SceneMap({
      offer: renderOffer,
      prospect: renderProspect,
    });

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: theme.viewport.width }}
        renderTabBar={(barProps): React.ReactElement => {
          const {
            navigationState: { index: stateIndex, routes: barRoutes },
          } = barProps;
          const currentRoute = barRoutes[stateIndex];

          return (
            <>
              <TabBar
                {...barProps}
                style={{ backgroundColor: theme.colors.white }}
                indicatorStyle={{ backgroundColor: theme.colors.blue }}
                renderLabel={({ route }): React.ReactElement => {
                  const isSelected = currentRoute.key === route.key;
                  return (
                    <Text
                      type="small"
                      style={[
                        { color: theme.colors.darkTint3 },
                        isSelected && {
                          color: theme.colors.blue,
                        },
                      ]}
                    >
                      {route.title}
                    </Text>
                  );
                }}
              />

              {renderBottomSheet()}
            </>
          );
        }}
      />
    );
  };

  const renderOffer = (): React.ReactElement => (
    <OfferCompareTable selectedOfferIds={selectedIds} onPressOffer={onPressRow} />
  );
  const renderProspect = (): React.ReactElement => (
    <OfferProspectTable selectedOfferIds={selectedIds} onPressOffer={onPressRow} />
  );

  const renderContentForSaleFlow = (): React.ReactElement => (
    <>
      <OfferCompareTable selectedOfferIds={selectedIds} onPressOffer={onPressRow} />
      {renderBottomSheet()}
    </>
  );

  return isLeaseFlow ? renderTabView() : renderContentForSaleFlow();
};

export default CompareOfferView;
