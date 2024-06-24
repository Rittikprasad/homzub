import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Check from '@homzhub/common/src/assets/images/check.svg';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import RequirementForm from '@homzhub/mobile/src/components/organisms/RequirementForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SearchRequirement = (): React.ReactElement => {
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const { navigate, goBack } = useNavigation();

  const navigateToLocalities = (): void => {
    navigate(ScreensKeys.LocalitiesSelection);
  };

  const onSubmitForm = (): void => setShowBottomSheet(true);

  const onBack = (): void => {
    dispatch(SearchActions.clearLocalities());
    setShowBottomSheet(false);
    // @ts-ignore
    if (params?.isFromAuth) {
      navigate(ScreensKeys.PropertySearchScreen);
    } else {
      goBack();
    }
  };

  const SuccessBottomSheet = (): React.ReactElement => {
    return (
      <BottomSheet visible={showBottomSheet} sheetHeight={400}>
        <>
          <View style={styles.bottomSheet}>
            <Text type="large" textType="semiBold">
              {t('propertySearch:requirementsSaved')}
            </Text>
            <Text type="small" textType="regular" style={styles.subHeader}>
              {t('propertySearch:requirementsText')}
            </Text>
            <Check width={80} height={80} />
          </View>
          <Button title={t('common:done')} type="primary" containerStyle={styles.doneButton} onPress={onBack} />
        </>
      </BottomSheet>
    );
  };

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        type: 'secondary',
        title: t('propertySearch:shareRequirement'),
        subTitle: t('propertySearch:shareRequirementsSubHeader'),
        icon: icons.close,
        onIconPress: onBack,
      }}
    >
      <RequirementForm onAddLocation={navigateToLocalities} onSubmit={onSubmitForm} />
      <SuccessBottomSheet />
    </Screen>
  );
};

export default React.memo(SearchRequirement);

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeader: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  doneButton: {
    marginHorizontal: 16,
    marginVertical: 25,
    flex: 1,
  },
});
