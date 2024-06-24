import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import Refer from '@homzhub/common/src/assets/images/refer.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import ReferralShare from '@homzhub/mobile/src/components/molecules/ReferralShare';

const ReviewAndRefer = (): React.ReactElement => {
  const dispatch = useDispatch();
  const data = useSelector(CommonSelectors.getReviewReferData);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Rate App from store popup
    if (data && data.isReview && InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then()
        .catch((e) => {
          AlertHelper.error({ message: e.message });
        })
        .finally(() => {
          dispatch(CommonActions.setReviewReferData({ isReview: false }));
        });
    }
  }, [data?.isReview]);

  const onCloseSheet = (): void => {
    dispatch(CommonActions.setReviewReferData({ isSheetVisible: false, message: '' }));
  };

  const renderReferComponent = (): React.ReactElement => {
    return (
      <View style={styles.referContainer}>
        <Refer width={200} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.referText}>
          {I18nService.t('referFriends')}
        </Text>
        <Text type="regular" textType="semiBold" style={styles.referText}>
          {I18nService.t('earnRewards')}
        </Text>
        <Label type="large" style={styles.referSubHeading}>
          {I18nService.t('getCoins')}
        </Label>
        <Label type="large" textType="bold" style={styles.share}>
          {I18nService.t('shareNow')}
        </Label>
        <ReferralShare setLoading={setLoading} />
      </View>
    );
  };

  return (
    <BottomSheet
      visible={!!data && !!data.isSheetVisible}
      onCloseSheet={onCloseSheet}
      sheetHeight={500}
      sheetContainerStyle={styles.container}
    >
      <>
        <Loader visible={isLoading} />
        <Text textType="bold" style={[styles.textAlignment, styles.title]}>
          {I18nService.t('congratulations')}
        </Text>
        {!!data && (
          <Label type="large" style={styles.textAlignment}>
            {data.message}
          </Label>
        )}
        {renderReferComponent()}
      </>
    </BottomSheet>
  );
};

export default ReviewAndRefer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textAlignment: {
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  referContainer: {
    marginBottom: 20,
  },
  referText: {
    textAlign: 'center',
    color: theme.colors.primaryColor,
  },
  referSubHeading: {
    textAlign: 'center',
    marginVertical: 10,
  },
  share: {
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    color: theme.colors.green,
  },
});
