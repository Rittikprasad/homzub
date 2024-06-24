import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Plan from '@homzhub/common/src/assets/images/plan.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onApiFailure: (err: IApiClientError) => void;
}

const UserSubscriptionPlan: FC<IProps> = ({ onApiFailure }: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useDown(deviceBreakpoint.LAPTOP);
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const [data, setData] = React.useState({} as UserSubscription);
  const [isMoreToggled, setIsMoreToggled] = React.useState(false);

  const getUserSubscription = async (): Promise<void> => {
    try {
      const response: UserSubscription = await UserRepository.getUserSubscription();
      setData(response);
    } catch (err) {
      onApiFailure(err.details);
    }
  };

  React.useEffect(() => {
    getUserSubscription();
  }, [onApiFailure]);

  if (ObjectUtils.isEmpty(data)) {
    return null;
  }

  const currentPlan = `${t('common:homzhub')} ${data.userServicePlan?.label}`;
  const recommendedPlanData = `${t('common:homzhub')} ${data.recommendedPlan?.label}`;
  const onUpgrade = (): void => {};
  const toggleMore = (): void => {
    setIsMoreToggled(!isMoreToggled);
  };

  return (
    <View style={styles.container}>
      <View style={styles.currentSubscription}>
        <View>
          <Text type="small" textType="regular" style={styles.planName}>
            {t('subscribedFor')}
          </Text>
          <Text type="regular" textType="bold" style={styles.planName}>
            {currentPlan}
          </Text>
        </View>
        <Plan />
      </View>
      <Divider />
      <Text type="small" textType="semiBold" style={styles.subscriptionHelper}>
        {`${t('subscriptionHelper')} `}
        <Text type="small" textType="bold" style={styles.planName}>
          {recommendedPlanData}
        </Text>
        {` ${t('subscriptionHelperServices')}`}
      </Text>
      {renderFeatures(data, isMoreToggled, isLaptop, isMobile)}
      {isMobile && data?.recommendedPlan?.serviceBundleItems.length > 5 && (
        <Text type="small" textType="semiBold" style={styles.more} onPress={toggleMore}>
          {isMoreToggled ? t('common:less') : t('common:more')}
        </Text>
      )}
      <Button title={t('upgrade')} type="secondary" onPress={onUpgrade} testID="btnUpgrade" />
    </View>
  );
};

const renderFeatures = (
  data: UserSubscription,
  isMoreToggled: boolean,
  isLaptop: boolean,
  isMobile: boolean
): React.ReactNode => {
  const { recommendedPlan } = data;
  const serviceItems = recommendedPlan?.serviceBundleItems ?? [];
  const displayServiceItems = serviceItems.length > 6 ? serviceItems.slice(0, 6) : serviceItems;
  const bundleItems = isMoreToggled ? displayServiceItems : serviceItems.slice(0, 3);
  const upgradeFeatures = isMobile ? bundleItems : isLaptop ? serviceItems.slice(0, 3) : displayServiceItems;

  return (
    <View style={[styles.featuresDataContainer, !isLaptop && styles.maxFeaturesDataHeight]}>
      {upgradeFeatures.map((item) => (
        <View style={[styles.featuresData, !isLaptop && styles.featuresDataWidth]} key={`${item.id}`}>
          <Icon name={icons.checkFilled} color={theme.colors.green} size={25} />
          <Text type="small" textType="regular" style={styles.featureName}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: PlatformUtils.isWeb() ? 24 : 16,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  currentSubscription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  featuresDataContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  maxFeaturesDataHeight: {
    maxHeight: 200,
  },
  featuresData: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  featuresDataWidth: {
    width: '50%',
    marginBottom: 20,
  },
  planName: {
    color: theme.colors.darkTint3,
  },
  featureName: {
    marginStart: 16,
  },
  subscriptionHelper: {
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  more: {
    color: theme.colors.primaryColor,
    alignSelf: 'flex-end',
  },
});

export default UserSubscriptionPlan;
