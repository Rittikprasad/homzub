import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

interface IProps {
  isVisible: boolean;
  isCheckboxSelected: boolean;
  onCloseSheet: () => void;
  handleCheckBox: () => void;
  onProceed: () => void;
}

const VerificationSheet = (props: IProps): React.ReactElement => {
  const { isVisible, onCloseSheet, handleCheckBox, onProceed, isCheckboxSelected } = props;
  const { t } = useTranslation();

  return (
    <BottomSheet visible={isVisible} onCloseSheet={onCloseSheet}>
      <View style={styles.sheetContainer}>
        <RNCheckbox
          selected={isCheckboxSelected}
          label={t('propertyPayment:verificationMsg')}
          onToggle={handleCheckBox}
        />
        <Button
          type="primary"
          title={t('common:proceed')}
          onPress={onProceed}
          disabled={!isCheckboxSelected}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </BottomSheet>
  );
};

export default VerificationSheet;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
    height: 50,
    marginVertical: 20,
  },
  buttonTitle: {
    marginVertical: 4,
  },
  sheetContainer: {
    marginHorizontal: 24,
  },
});
