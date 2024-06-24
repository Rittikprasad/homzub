/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import DetailsTab from '@homzhub/web/src/screens/propertyDetailOwner/Components/DetailsTab';
import FinancialsTab from '@homzhub/web/src/screens/propertyDetailOwner/Components/FinancialsTab';
import OfferView from '@homzhub/web/src/screens/offers/components/OfferView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OfferSort } from '@homzhub/common/src/constants/Offers';
import { IRoutes, Tabs, PropertyDetailOwner } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  assetDetails: Asset;
  propertyTermId: number;
}

const TabSection = (propsData: IProps): React.ReactElement => {
  const [currentIndex, setcurrentIndex] = useState(0);
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const {
    assetDetails: {
      description,
      features,
      leaseTerm,
      saleTerm,
      amenityGroup,
      highlights,
      assetStatusInfo,
      id: assetId,
    },
  } = propsData;
  const selectedFilters = { filter_by: '', sort_by: OfferSort.NEWEST };
  const renderTabScene = (route: IRoutes): React.ReactElement | null => {
    switch (route.key) {
      case Tabs.DETAILS:
        return (
          <DetailsTab
            description={description}
            features={features}
            leaseTerm={leaseTerm}
            saleTerm={saleTerm}
            amenityGroup={amenityGroup}
            assetHighlights={highlights}
          />
        );
      case Tabs.OFFERS:
        return <OfferView selectedFilters={selectedFilters} />;
      case Tabs.FINANCIALS:
        return <FinancialsTab assetId={assetId} />;
      default:
        return (
          <View style={styles.comingSoonContent}>
            <Text type="large">{t('comingSoonText')}</Text>
          </View>
        );
    }
  };

  const handleIndexChange = (index: number): void => {
    setcurrentIndex(index);
  };

  const dynamicRoutes = (): IRoutes[] => {
    for (let index = 0; index < PropertyDetailOwner.length; index++) {
      const item = PropertyDetailOwner[index];
      if (item.key === Tabs.OFFERS) {
        PropertyDetailOwner.splice(index, 1);
      }
    }

    return PropertyDetailOwner;
  };

  const TabRoutes = assetStatusInfo?.tag.code === Filters.OCCUPIED ? dynamicRoutes() : PropertyDetailOwner;
  return (
    <View style={styles.container}>
      <TabView
        lazy
        swipeEnabled
        renderScene={({ route }): React.ReactElement | null => renderTabScene(route)}
        onIndexChange={handleIndexChange}
        renderTabBar={(props): React.ReactElement => {
          const {
            // eslint-disable-next-line no-unused-vars
            // eslint-disable-next-line react/prop-types
            navigationState: { index, routes },
          } = props;
          const currentRoute = routes[index];
          return (
            <TabBar
              {...props}
              style={styles.backgroundWhite}
              indicatorStyle={styles.backgroundWhite}
              renderTabBarItem={({ route, onPress }): React.ReactElement => {
                const isSelected = currentRoute.key === route.key;
                return (
                  <TouchableOpacity onPress={onPress}>
                    <View style={[styles.tabBar, isSelected && styles.selectedTabBar]}>
                      <Icon
                        name={route?.icon ?? icons.portfolio}
                        color={isSelected ? theme.colors.blue : theme.colors.darkTint3}
                        size={22}
                      />
                      <Text
                        type="small"
                        style={[
                          styles.label,
                          isSelected && {
                            color: theme.colors.blue,
                          },
                        ]}
                      >
                        {route.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          );
        }}
        navigationState={{
          index: currentIndex,
          routes: TabRoutes,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  label: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  tabBar: {
    width: 140,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTabBar: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue,
  },
  backgroundWhite: {
    backgroundColor: theme.colors.white,
    paddingTop: 10,
  },
  comingSoonContent: {
    alignItems: 'center',
    minHeight: 350,
    height: 'auto',
    paddingVertical: 150,
    backgroundColor: theme.colors.white,
    marginBottom: 24,
  },
});

export default TabSection;
