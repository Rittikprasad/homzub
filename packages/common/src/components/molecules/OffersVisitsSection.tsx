import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { OffersVisitsType, OfferVisitData } from '@homzhub/common/src/constants/Offers';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  isDetailView?: boolean;
  propertyDetailTab?: boolean;
  onNav?: (from: OffersVisitsType) => void;
  values: {
    [OffersVisitsType.offers]: number[];
    [OffersVisitsType.visits]: number[];
  };
  renderImage?: (key: Tabs) => React.ReactElement;
}

const OffersVisitsSection = (props: IProps): React.ReactElement => {
  const { values, propertyDetailTab, onNav, renderImage } = props;
  const { t } = useTranslation();
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View
      style={[
        styles.container,
        propertyDetailTab
          ? PlatformUtils.isWeb() && isTablet && !isMobile && styles.container
          : PlatformUtils.isWeb() && isTablet && !isMobile && styles.containerTablet,
      ]}
    >
      {OfferVisitData.map((item) => {
        const onPress = (): void => onNav && onNav(item.type);
        return (
          <TouchableOpacity key={item.type} onPress={onPress}>
            <Divider containerStyles={styles.divider} />
            <View style={styles.contentContainer}>
              {renderImage ? renderImage(item.key) : <Icon name={item.icon} size={22} color={theme.colors.darkTint2} />}
              <View style={[styles.textContainer, isTablet && !propertyDetailTab && styles.textContainerTab]}>
                <View style={styles.header}>
                  <Label type="large" textType="regular" style={styles.title}>
                    {t(item.title)}
                  </Label>
                  {!PlatformUtils.isWeb() && (
                    <View style={styles.iconStyle}>
                      <Icon name={icons.rightArrow} color={theme.colors.active} size={20} />
                    </View>
                  )}
                </View>
                <View style={styles.subSectionContainer}>
                  {item.sections.map((section, index) => {
                    const titleStyle = item.colors ? { ...styles.title, color: item.colors[index] } : styles.title;
                    return (
                      <View key={section} style={styles.subSection}>
                        <Label type="small" textType="regular" style={styles.subSectionText}>
                          {t(`assetPortfolio:${section}`)}
                        </Label>
                        <Label type="large" textType="semiBold" style={titleStyle}>
                          {values[item.type][index]}
                        </Label>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const memoizedComponent = React.memo(OffersVisitsSection);
export { memoizedComponent as OffersVisitsSection };

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  divider: {
    borderWidth: 1,
    marginVertical: 12,
    borderColor: theme.colors.background,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    marginStart: 12,
  },
  textContainerTab: {
    width: 260,
  },
  subSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  subSection: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: theme.colors.darkTint2,
  },
  subSectionText: {
    color: theme.colors.darkTint3,
  },
  containerTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconStyle: {
    paddingHorizontal: 4,
  },
});
