import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  onCloseModal: () => void;
}

const CloseTicket: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { onCloseModal } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClosePopup = (): void => {
    onCloseModal();
  };

  const onCloseTicket = (): void => {
    dispatch(TicketActions.closeTicket());
    onCloseModal();
  };

  const buttonTitles = [t('common:cancel'), t('common:close')];
  return (
    <View>
      <Text type="small" style={styles.message}>
        {t('serviceTickets:payLaterConfirmation')}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          type="secondary"
          title={buttonTitles[0]}
          onPress={onClosePopup}
          titleStyle={styles.buttonTitle}
          containerStyle={[styles.buttonGenric, styles.cancelButton]}
        />
        <Button
          type="primary"
          title={buttonTitles[1]}
          titleStyle={styles.buttonTitle}
          onPress={onCloseTicket}
          // @ts-ignoreComment
          containerStyle={[styles.buttonGenric, styles.primaryButtonStyle]}
        />
      </View>
    </View>
  );
};

export default CloseTicket;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  cancelButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  primaryButtonStyle: {
    flexDirection: 'row-reverse',
    height: 50,
    backgroundColor: theme.colors.primaryColor,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  message: {
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonGenric: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
