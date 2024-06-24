import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import InfiniteScrollView from '@homzhub/web/src/components/hoc/InfiniteScroll';
import PropertyCard from '@homzhub/web/src/screens/searchProperty/components/PropertyCard';
import SearchMapView from '@homzhub/web/src/screens/searchProperty/components/SearchMapView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// TODO : shagun - fix mobile and tab view
interface IProps {
  isListView: boolean;
  property: AssetSearch;
  fetchData: (value: number) => void;
  hasMore: boolean;
  limit: number;
  transaction_type: number;
  loader: boolean;
}

const noStyles = {};

const PropertiesView: FC<IProps> = (props: IProps) => {
  const { isListView, property, fetchData, hasMore, limit, transaction_type, loader } = props;
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTab = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const [containerWidth, setContainerWidth] = useState<string | number>('100%');
  const onLayout = (): void => {
    if (property.results.length >= 3) {
      setContainerWidth('32%');
    } else if (property.results.length === 2) {
      setContainerWidth('64%');
    }
  };

  return (
    <View style={styles.container}>
      {isListView && isDesktop && <SearchMapView />}
      <View style={[styles.containerGrid, isListView && isMobile ? styles.containerListMobile : styles.containerList]}>
        <View style={styles.subContainerGrid}>
          <InfiniteScrollView
            data={property.results.length}
            fetchMoreData={fetchData}
            height={isDesktop && isListView ? '1200px' : '150vh'}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              justifyContent: isTab ? 'space-between' : 'flex-start',
            }}
            hasMore={hasMore}
            limit={limit}
            loader={loader}
          >
            {property.results.map((item: Asset, index: number) => (
              <View
                key={item.id}
                style={[
                  isListView ? styles.cardList : [styles.cardGrid, { width: containerWidth }],
                  !isListView ? ((index + 1) % 3 === 0 ? noStyles : !isTab && styles.cardAlignment) : noStyles,
                  isMobile && isListView && styles.cardListMobile,
                  isTab && !isListView && styles.cardGridTab,
                  isMobile && !isListView && styles.cardGridMobile,
                  isTab && isListView && styles.listViewTablet,
                ]}
                onLayout={onLayout}
              >
                <PropertyCard
                  key={item.id}
                  investmentData={item}
                  containerStyle={[styles.propertyCard, isListView && !isMobile ? styles.listView : styles.cardView]}
                  cardImageCarouselStyle={
                    isListView ? styles.cardImageCarouselStyleList : styles.cardImageCarouselStyleGrid
                  }
                  cardImageStyle={isListView ? styles.cardImageStyleList : styles.cardImageStyleGrid}
                  priceUnit={transaction_type === 0 ? 'mo' : ''}
                  propertyTypeAndBadgesStyle={
                    !isListView ? styles.propertyTypeAndBadges : styles.propertyTypeAndBadgesList
                  }
                  priceAndAmenitiesStyle={isListView ? styles.priceAndAmenitiesList : styles.priceAndAmenitiesGrid}
                  propertyAmenitiesStyle={!isListView ? styles.propertyAmenities : styles.propertyAmenitiesList}
                  addressStyle={[styles.address, !isListView ? styles.addressGridView : styles.addressListView]}
                  detailsStyle={[
                    styles.details,
                    isListView && isDesktop ? styles.detailsListView : noStyles,
                    isListView && isTab ? styles.detailsListTabView : noStyles,
                    isListView && isMobile ? styles.detailsListMobileView : noStyles,
                  ]}
                  iconStyle={isListView ? styles.iconStyle : noStyles}
                  detailContainerStyle={
                    isListView
                      ? !isMobile
                        ? isTab
                          ? styles.detailContainerStyleTab
                          : styles.detailContainerStyle
                        : styles.detailContainerStyleMobile
                      : noStyles
                  }
                  isListView={isListView}
                />
              </View>
            ))}
          </InfiniteScrollView>
        </View>
      </View>
    </View>
  );
};

export default PropertiesView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  containerList: {
    width: '75%',
    flexDirection: 'column',
  },
  containerListMobile: {
    width: '100%',
  },
  containerGrid: {
    flex: 1,
    flexDirection: 'row',
  },
  subContainerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  cardList: {
    width: '100%',
    alignItems: 'stretch',
    paddingLeft: 16,
  },
  cardListMobile: {
    width: '85vw',
  },
  cardGrid: {
    alignItems: 'stretch',
    alignSelf: 'flex-start',
  },
  cardAlignment: {
    marginEnd: '2%',
  },
  cardGridTab: {
    width: '48.5%',
  },
  cardGridMobile: {
    width: '100%',
  },
  cardImageCarouselStyleList: {
    height: 230,
    width: 260,
  },
  cardImageStyleList: {
    height: 230,
    width: 260,
  },
  cardImageCarouselStyleGrid: {
    height: 210,
    width: '100%',
    marginHorizontal: 'auto',
  },
  cardImageStyleGrid: {
    height: 210,
    width: '100%',
  },
  listView: {
    flexDirection: 'row',
  },
  cardView: {
    flexDirection: 'column',
  },

  propertyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
  },
  priceAndAmenitiesList: {
    justifyContent: 'space-between',
  },
  priceAndAmenitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  propertyAmenities: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  propertyAmenitiesList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 8,
    width: '70%',
  },
  propertyTypeAndBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  propertyTypeAndBadgesList: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address: {
    marginTop: 5,
  },
  addressGridView: {
    minHeight: 106,
    marginBottom: 16,
  },
  addressListView: {
    minHeight: 106,
  },
  details: {
    left: 2,
  },
  detailsListTabView: {
    paddingLeft: 24,
    paddingRight: 12,
    width: '50vw',
  },
  detailsListView: {
    width: '100%',
    left: 10,
    right: 10,
  },
  detailContainerStyle: {
    width: '55%',
  },
  detailContainerStyleMobile: {
    width: '95%',
  },
  detailContainerStyleTab: {
    width: '55%',
  },
  detailsListMobileView: {
    width: '90vw',
  },
  listViewTablet: {
    width: '100%',
  },
  iconStyle: {
    marginHorizontal: 0,
  },
});
