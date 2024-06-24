import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { LeaseProgress } from '@homzhub/mobile/src/components/molecules/LeaseProgress';
import { DataType } from '@homzhub/common/src/domain/models/Asset';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const LeasePropertyList = (): React.ReactElement | null => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = useSelector(PortfolioSelectors.getTenancies);

  if (data.length < 1) return null;
  const currentLease = data[currentIndex];
  const { assetStatusInfo, formattedProjectName, country, lastVisitedStep, listingInfo, id } = currentLease;

  const navigateToProperty = (): void => {
    const viewPayload = PropertyUtils.getAssetPayload(assetStatusInfo || listingInfo, id);
    dispatch(PortfolioActions.setCurrentAsset({ ...viewPayload, dataType: DataType.TENANCIES }));
    navigate(ScreensKeys.PropertyDetailScreen, { isFromTenancies: true, isFromDashboard: true });
  };

  const getProgress = (): number => {
    if (assetStatusInfo && lastVisitedStep) {
      const {
        leaseTransaction: { totalSpendPeriod },
      } = assetStatusInfo;
      const {
        assetCreation: { percentage },
      } = lastVisitedStep;
      return totalSpendPeriod >= 0 ? totalSpendPeriod : percentage / 100;
    }

    return 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Badge title={assetStatusInfo?.tag.label ?? ''} badgeColor={assetStatusInfo?.tag.color ?? ''} />
        {data.length > 1 && (
          <View style={styles.headingContent}>
            <TouchableOpacity
              style={styles.iconStyle}
              disabled={currentIndex === 0}
              onPress={(): void => setCurrentIndex(currentIndex - 1)}
            >
              <Icon
                name={icons.leftArrow}
                size={16}
                color={currentIndex === 0 ? theme.colors.darkTint4 : theme.colors.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconStyle}
              disabled={currentIndex === data.length - 1}
              onPress={(): void => setCurrentIndex(currentIndex + 1)}
            >
              <Icon
                name={icons.rightArrow}
                size={16}
                color={currentIndex === data.length - 1 ? theme.colors.darkTint4 : theme.colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {currentLease && (
        <TouchableOpacity style={styles.content} onPress={navigateToProperty}>
          <PropertyAddressCountry
            primaryAddress={formattedProjectName}
            showAddress={false}
            countryFlag={country.flag}
          />
          <Divider containerStyles={styles.divider} />
          {assetStatusInfo && (
            <LeaseProgress
              progress={getProgress()}
              fromDate={assetStatusInfo.leaseTransaction.leaseStartDate}
              toDate={assetStatusInfo.leaseTransaction.leaseEndDate}
              isPropertyVacant={false}
              assetCreation={lastVisitedStep.assetCreation}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LeasePropertyList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 12,
    paddingBottom: 16,
  },
  headingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 10,
  },
  headingContent: {
    flexDirection: 'row',
  },
  iconStyle: {
    width: 32,
    height: 28,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  content: {
    marginHorizontal: 16,
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
});
