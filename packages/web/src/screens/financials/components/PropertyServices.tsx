import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Menu from '@homzhub/common/src/components/molecules/Menu';
import MenuListPopup from '@homzhub/web/src/components/molecules/MenuListPopup';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import TabCard from '@homzhub/common/src/components/molecules/TabCard';
import SocietyReminderList from '@homzhub/common/src/components/organisms/Society/SocietyReminderList';
import DueConfirmPopover from '@homzhub/web/src/screens/financials/components/DueConfirmPopover';
import { FinancialsActions, INavProps } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { IRoutes, PropertyPaymentRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
import { menu, MenuEnum } from '@homzhub/common/src/constants/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends INavProps {
  setFinancialsActionType: React.Dispatch<React.SetStateAction<FinancialsActions | null>>;
}

const PropertyServices: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { setFinancialsActionType, isFromSummary } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const dispatch = useDispatch();
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);
  const { societyReminders } = useSelector(PropertyPaymentSelector.getPropertyPaymentLoaders);
  const [isReminderView, setReminderView] = useState(false);
  const [isDeleteView, setDeleteView] = useState(false);

  useEffect(() => {
    dispatch(PropertyPaymentActions.clearPaymentData());
    dispatch(PropertyPaymentActions.getUserInvoiceSuccess(new InvoiceId()));
    // @ts-ignore
    if (isFromSummary) {
      setReminderView(false);
    } else if (isReminderView) {
      dispatch(PropertyPaymentActions.getSocietyReminders({ id: asset.id }));
    }
  }, []);

  const handleGoBack = (): void => {
    if (isReminderView) {
      setReminderView(false);
    } else {
      setFinancialsActionType(FinancialsActions.PropertyPayment_SelectProperties);
    }
  };

  const handleTabNavigation = (key: Tabs): void => {
    if (key === Tabs.SOCIETY_BILL) {
      dispatch(PropertyPaymentActions.getSocietyReminders({ id: asset.id, onCallback: handleCallback }));
    }
  };

  const handleCallback = (status: boolean, data?: number): void => {
    if (status) {
      if (data && data > 0) {
        setReminderView(true); // Society Reminder Flow
      } else {
        setFinancialsActionType(FinancialsActions.PropertyPayment_SocietyController);
      }
    }
  };

  const handlePayNow = (): void => {
    setFinancialsActionType(FinancialsActions.PropertyPayment_PayNow);
  };

  const handleMenuSelection = (value: string, id: number): void => {
    if (value === MenuEnum.EDIT) {
      dispatch(FinancialActions.setCurrentReminderId(id));
      setFinancialsActionType(FinancialsActions.EditReminder);
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

  useEffect(() => {
    if (isDeleteView) {
      onOpenConfirmModal();
    }
  }, [isDeleteView]);

  const popupRefConfirm = useRef<PopupActions>(null);
  const onOpenConfirmModal = (): void => {
    if (popupRefConfirm && popupRefConfirm.current) {
      popupRefConfirm.current.open();
    }
  };
  const onCloseConfirmModal = (): void => {
    if (popupRefConfirm && popupRefConfirm.current) {
      popupRefConfirm.current.close();
    }
  };

  const renderExtraNode = (id: number): React.ReactElement => {
    return (
      <DueConfirmPopover
        popupRef={popupRefConfirm}
        onCloseModal={onCloseConfirmModal}
        onPressDelete={(): void => onPressDelete(id)}
      />
    );
  };

  const renderMenuPopup = (menuList: React.ReactElement): React.ReactElement => {
    return (
      <MenuListPopup popupRef={popupRefMenuList} onOpenModal={onOpenMenuList} onCloseModal={onCloseMenuList}>
        {menuList}
      </MenuListPopup>
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
        renderMenuPopup={renderMenuPopup}
        onCloseMenuPopup={onCloseMenuList}
        onPressIcon={onOpenMenuList}
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

  const popupRefMenuList = useRef<PopupActions>(null);
  const onOpenMenuList = (): void => {
    if (popupRefMenuList && popupRefMenuList.current) {
      popupRefMenuList.current.open();
    }
  };
  const onCloseMenuList = (): void => {
    if (popupRefMenuList && popupRefMenuList.current) {
      popupRefMenuList.current.close();
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Loader visible={activeAssets || societyReminders} />
        <TouchableOpacity onPress={handleGoBack}>
          <View style={styles.backTextWithIcon}>
            <Icon name={icons.leftArrow} size={20} color={theme.colors.primaryColor} />
            <Typography variant="text" size="small" fontWeight="semiBold" style={styles.contentTitle}>
              {t('propertyPayment:paymentServices')}
            </Typography>
          </View>
        </TouchableOpacity>
        <Typography variant="text" size="small" fontWeight="semiBold">
          {t('propertyPayment:chooseService')}
        </Typography>
        <View style={styles.itemContainer}>
          <PropertyAddressCountry
            primaryAddress={asset.projectName}
            subAddress={asset.assetAddress}
            propertyType={asset.assetType.name}
            countryFlag={asset.country.flag}
            // @ts-ignore
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
    </View>
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
  contentTitle: {
    marginLeft: 12,
  },
  backTextWithIcon: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  listContainer: {
    marginVertical: 10,
  },
});
