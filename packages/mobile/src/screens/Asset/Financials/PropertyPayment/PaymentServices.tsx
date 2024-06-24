import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import Menu from '@homzhub/common/src/components/molecules/Menu';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import TabCard from '@homzhub/common/src/components/molecules/TabCard';
import SocietyReminderList from '@homzhub/common/src/components/organisms/Society/SocietyReminderList';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IRoutes, PropertyPaymentRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
import { menu, MenuEnum } from '@homzhub/common/src/constants/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const PropertyServices = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);
  const { societyReminders } = useSelector(PropertyPaymentSelector.getPropertyPaymentLoaders);
  const [isReminderView, setReminderView] = useState(false);
  const [isDeleteView, setDeleteView] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(PropertyPaymentActions.clearPaymentData());
      dispatch(PropertyPaymentActions.getUserInvoiceSuccess(new InvoiceId()));
      // @ts-ignore
      if (params && params.isFromSummary) {
        setReminderView(false);
      } else if (isReminderView) {
        dispatch(PropertyPaymentActions.getSocietyReminders({ id: asset.id }));
      }
    }, [])
  );

  const handleGoBack = (): void => {
    if (isReminderView) {
      setReminderView(false);
    } else {
      goBack();
    }
  };

  const handleTabNavigation = (key: Tabs): void => {
    if (key === Tabs.SOCIETY_BILL) {
      dispatch(PropertyPaymentActions.getSocietyReminders({ id: asset.id, onCallback: handleCallback }));
    } else {
      navigate(ScreensKeys.ComingSoonScreen, {
        title: key as string,
        tabHeader: t('propertyPayment'),
        ...(key === Tabs.RENT_PAYMENT && {
          message: t('property:rentPayment'),
        }),
      });
    }
  };

  const handleCallback = (status: boolean, data?: number): void => {
    if (status) {
      if (data && data > 0) {
        setReminderView(true);
      } else {
        navigate(ScreensKeys.SocietyController);
      }
    }
  };

  const handlePayNow = (): void => {
    navigate(ScreensKeys.SocietyOrderSummary);
  };

  const handleMenuSelection = (value: string, id: number): void => {
    if (value === MenuEnum.EDIT) {
      dispatch(FinancialActions.setCurrentReminderId(id));
      navigate(ScreensKeys.AddReminderScreen, { isEdit: true });
    } else {
      setDeleteView(true);
    }
  };

  const onDeleteCallback = (status: boolean, data?: number): void => {
    if (status && !data) {
      setReminderView(false);
    }
  };

  const onPressDelete = (id: number): void => {
    LedgerRepository.deleteReminderById(id)
      .then(() => {
        dispatch(PropertyPaymentActions.getSocietyReminders({ id: asset.id, onCallback: onDeleteCallback }));
        AlertHelper.success({ message: t('propertyPayment:billDeleted') });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      })
      .finally(() => {
        setDeleteView(false);
      });
  };

  const renderExtraNode = (id: number): React.ReactElement => {
    return (
      <ConfirmationSheet
        isVisible={isDeleteView}
        onCloseSheet={(): void => setDeleteView(false)}
        onPressDelete={(): void => onPressDelete(id)}
      />
    );
  };

  const renderMenu = (id: number): React.ReactElement => {
    return (
      <Menu
        optionTitle={t('propertyPayment:modifySocietyBill')}
        data={menu}
        isShadowView
        isExtraNode={isDeleteView}
        onSelect={(value): void => handleMenuSelection(value, id)}
        iconStyle={styles.icon}
        extraNode={renderExtraNode(id)}
      />
    );
  };

  const renderItem = ({ item }: { item: IRoutes }): React.ReactElement => {
    return (
      <TabCard
        title={item.title}
        icon={item.icon}
        iconColor={item.color}
        onPressCard={(): void => handleTabNavigation(item.key)}
        containerStyle={styles.item}
      />
    );
  };

  const keyExtractor = (item: IRoutes): string => item.key.toString();

  return (
    <UserScreen
      title={t('propertyPayment')}
      pageTitle={t('paymentServices')}
      isGradient
      isBackgroundRequired
      onBackPress={handleGoBack}
      loading={activeAssets || societyReminders}
      backgroundColor={theme.colors.background}
      headerStyle={styles.header}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('chooseService')}
        </Text>
        <View style={styles.itemContainer}>
          <PropertyAddressCountry
            primaryAddress={asset.projectName}
            subAddress={asset.assetAddress}
            propertyType={asset.assetType.name}
            countryFlag={asset.country.flag}
            // eslint-disable-next-line react-native/no-inline-styles
            primaryAddressTextStyles={{
              size: 'small',
            }}
          />
        </View>
      </View>
      {isReminderView ? (
        <SocietyReminderList renderMenu={renderMenu} handlePayNow={handlePayNow} />
      ) : (
        <View style={styles.tabView}>
          <FlatList data={PropertyPaymentRoutes} keyExtractor={keyExtractor} numColumns={3} renderItem={renderItem} />
        </View>
      )}
    </UserScreen>
  );
};

export default PropertyServices;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  tabView: {
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    padding: 16,
    marginVertical: 16,
  },
  item: {
    marginVertical: 30,
    marginHorizontal: 6,
  },
  header: {
    backgroundColor: theme.colors.white,
  },
  icon: {
    alignSelf: 'flex-start',
  },
});
