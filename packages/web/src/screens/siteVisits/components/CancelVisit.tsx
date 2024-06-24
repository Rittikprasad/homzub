import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { IVisitActionParam } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  paramsVisitAction: IVisitActionParam;
  handleVisitActions: (param: IVisitActionParam) => void;
  onCloseModal: () => void;
}

const CancelVisit: React.FC<IProps> = (props: IProps) => {
  const { onCloseModal, handleVisitActions, paramsVisitAction } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.subTitle}>
        {t('property:wantCancelVisit')}
      </Typography>
      <View style={styles.buttonGrp}>
        <Button
          type="primary"
          title={t('common:yes')}
          onPress={(): void => handleVisitActions(paramsVisitAction)}
          containerStyle={[styles.button, styles.buttonAccept]}
        />
        <Button type="secondary" title={t('common:no')} onPress={onCloseModal} containerStyle={styles.button} />
      </View>
    </View>
  );
};

export default CancelVisit;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  button: {
    height: 45,
    width: 160,
  },
  buttonGrp: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  buttonAccept: {
    backgroundColor: theme.colors.error,
  },
  subTitle: {
    textAlign: 'center',
  },
});
