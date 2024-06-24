import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ServiceOrderSummary from '@homzhub/common/src/components/organisms/ServiceOrderSummary';
import { FinancialsActions, INavProps } from '@homzhub/web/src/screens/financials/FinancialsPopover';

interface IProps {
  setFinancialsActionType: React.Dispatch<React.SetStateAction<FinancialsActions | null>>;
  setPropsPropertyServices: React.Dispatch<React.SetStateAction<INavProps>>;
}

const SocietyOrderSummary: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { setFinancialsActionType, setPropsPropertyServices } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dueOrderSummary, payment } = useSelector(FinancialSelectors.getFinancialLoaders);

  const onSuccess = (): void => {
    //  isFromSummary: true
    setPropsPropertyServices((prevState) => {
      return {
        ...prevState,
        isFromSummary: true,
      };
    });
    setFinancialsActionType(FinancialsActions.PropertyPayment_PropertyServices);
  };

  const onGoBack = (): void => {
    dispatch(FinancialActions.clearOrderSummary());
    setFinancialsActionType(FinancialsActions.PropertyPayment_SocietyController);
  };

  return (
    <View>
      <Loader visible={dueOrderSummary || payment} />
      <TouchableOpacity onPress={onGoBack}>
        <View style={styles.backTextWithIcon}>
          <Icon name={icons.leftArrow} size={20} color={theme.colors.primaryColor} />
          <Typography variant="text" size="small" fontWeight="semiBold" style={styles.contentTitle}>
            {t('propertyPayment:paymentServices')}
          </Typography>
        </View>
      </TouchableOpacity>
      <ServiceOrderSummary onSuccess={onSuccess} />
    </View>
  );
};

export default SocietyOrderSummary;

const styles = StyleSheet.create({
  contentTitle: {
    marginLeft: 12,
  },
  backTextWithIcon: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});
