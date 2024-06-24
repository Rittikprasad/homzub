import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { PopupActions } from 'reactjs-popup/dist/types';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import AddRecordsForm from '@homzhub/web/src/screens/financials/AddRecords/AddRecordsForm';

const AddRecords = (): React.ReactElement => {
  const { t } = useTranslation();
  const popupRef = useRef<PopupActions>(null);
  return (
    <View style={styles.container}>
      <Popover
        forwardedRef={popupRef}
        content={<AddRecordsForm />}
        popupProps={{
          closeOnDocumentClick: true,
          children: undefined,
          modal: true,
          contentStyle: { width: '80%' },
        }}
      >
        <Button type="secondary" containerStyle={styles.button}>
          <Icon name={icons.plus} color={theme.colors.primaryColor} />
          <Typography variant="label" size="large">
            {t('addCamelCase')}
          </Typography>
        </Button>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 10,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AddRecords;
