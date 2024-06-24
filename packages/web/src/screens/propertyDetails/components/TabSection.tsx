/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import ReviewRatings from '@homzhub/web/src/components/organisms/ReviewRatings';
import Amenitites from '@homzhub/web/src/screens/propertyDetails/components/Amenities';
import Description from '@homzhub/web/src/screens/propertyDetails/components/Description';
import Neighbourhood from '@homzhub/web/src/screens/propertyDetails/components/Neighbourhood';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IRoutes, Tabs, PropertyDetailRoutes } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  assetDetails: Asset;
  propertyTermId: number;
}

const TabSection = (propsData: IProps): React.ReactElement => {
  const [currentIndex, setcurrentIndex] = useState(0);
  const {
    assetDetails: { description, features, leaseTerm, saleTerm, amenityGroup, highlights },
    propertyTermId,
  } = propsData;
  const renderTabScene = (route: IRoutes): React.ReactElement | null => {
    switch (route.key) {
      case Tabs.DESCRIPTION:
        return <Description description={description} features={features} leaseTerm={leaseTerm} saleTerm={saleTerm} />;
      case Tabs.AMENITIES:
        return <Amenitites amenityGroup={amenityGroup} assetHighlights={highlights} />;
      case Tabs.REVIEWS_RATING:
        return <ReviewRatings propertyTermId={propertyTermId} />;
      case Tabs.NEIGHBOURHOOD:
        return <Neighbourhood />;
      default:
        return null;
    }
  };

  const handleIndexChange = (index: number): void => {
    setcurrentIndex(index);
  };

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
                        name={route.icon}
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
          routes: PropertyDetailRoutes,
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
    width: 180,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTabBar: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue,
  },
  backgroundWhite: {
    backgroundColor: theme.colors.white,
    paddingTop: 20,
  },
});

export default TabSection;
