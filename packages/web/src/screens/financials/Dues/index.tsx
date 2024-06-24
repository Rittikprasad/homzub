import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SvgProps } from 'react-native-svg';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Accounting from '@homzhub/common/src/assets/images/accounting.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import DueCard from '@homzhub/common/src/components/molecules/DueCard';
import PrevNextPagination from '@homzhub/web/src/components/hoc/PrevNextPagination';
import CrossActionsPopover, { ISheetData } from '@homzhub/web/src/screens/financials/components/CrossActionsPopover';
import DueConfirmPopover from '@homzhub/web/src/screens/financials/components/DueConfirmPopover';
import DuesOrderSummary from '@homzhub/web/src/screens/financials/components/DuesOrderSummary';
import { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';

interface IProps {
  onPressDueActions: (actionType: FinancialsActions) => void;
}

const DueList: React.FC<IProps> = (props: IProps) => {
  const { onPressDueActions } = props;
  // HOOKS START
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentDue = useSelector(FinancialSelectors.getCurrentDue);
  const dues = useSelector(FinancialSelectors.getDueItems);
  const TOTAL_DUE_AMOUNT = useSelector(FinancialSelectors.getTotalDueAmount);
  const { dues: dueLoading, deleteDue } = useSelector(FinancialSelectors.getFinancialLoaders);
  const {
    amount,
    currency: { currencySymbol },
  } = TOTAL_DUE_AMOUNT;

  useEffect(() => {
    fetchMoreData();
  }, []);
  useEffect(() => {
    setDuesArray(dues.slice(0, limit));
  }, [dues]);

  const [offset, setOffset] = useState(0);
  const limit = 3;
  const [duesArray, setDuesArray] = useState<DueItem[] | []>([]);
  const hasMore = !(duesArray.length >= dues.length);

  // HOOKS END

  const handleAlreadyPaid = (): void => {
    dispatch(AssetActions.getActiveAssets());
    // isFromDues: true
    onPressDueActions(FinancialsActions.AddRecord);
  };

  const onSetReminder = (): void => {
    if (currentDue && currentDue.canAddReminder) {
      // isFromDues: true
      onPressDueActions(FinancialsActions.AddReminder);
      return;
    }
    AlertHelper.error({ message: t('assetFinancial:reminderAlreadySetForDue') });
    onCloseCrossActionsModal();
  };

  const getSheetData = (): ISheetData[] => {
    const iconSize = 40;
    const ImageHOC = (Image: React.FC<SvgProps>): React.ReactElement => <Image width={iconSize} height={iconSize} />;
    const IconHOC = (name: string): React.ReactElement => (
      <Icon name={name} size={iconSize + 3} color={theme.colors.error} />
    );
    return [
      {
        icon: ImageHOC(Accounting),
        label: t('assetFinancial:alreadyPaid'),
        onPress: handleAlreadyPaid,
      },
      {
        icon: IconHOC(icons.reminder),
        label: t('assetFinancial:setReminders'),
        onPress: onSetReminder,
      },
    ];
  };

  const keyExtractor = (item: DueItem): string => item.id.toString();

  const renderItem = ({ item }: { item: DueItem }): React.ReactElement | null => {
    const onPressClose = (dueId?: number): void => {
      if (dueId) {
        dispatch(FinancialActions.setCurrentDueId(dueId));
      }
      if (item.canDelete) {
        onOpenConfirmModal();
      } else {
        onOpenCrossActionsModal();
      }
    };

    const onPressPayNow = (): void => {
      onOpenOrderModal(); // Open Order Popover
    };

    return <DueCard due={item} onPressClose={onPressClose} onPayNav={onPressPayNow} />;
  };

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  const handleCallback = (status: boolean): void => {
    if (status) {
      AlertHelper.success({ message: t('assetFinancial:dueDeleteSuccess') });
      dispatch(FinancialActions.setCurrentDueId(-1));
      fetchMoreData();
    }
  };

  const onDeleteDue = (): void => {
    dispatch(FinancialActions.deleteDue({ onCallback: handleCallback }));
    onCloseConfirmModal();
  };

  const fetchMoreData = (): void => {
    dispatch(FinancialActions.getDues());
    setDuesArray(dues.slice(0, limit));
  };

  const onPressPrev = (): void => {
    if (!offset) {
      return;
    }
    if (offset - limit < 0) {
      setDuesArray(dues.slice(0, limit));
      setOffset(0);
    } else {
      setDuesArray(dues.slice(offset - limit, offset));
      setOffset(offset - limit);
    }
  };
  const onPressNext = (): void => {
    if (offset === dues.length) {
      return;
    }
    if (offset + limit > dues.length) {
      setDuesArray(dues.slice(offset, dues.length));
      setOffset(dues.length);
    } else {
      setDuesArray(dues.slice(offset, offset + limit));
      setOffset(offset + limit);
    }
  };

  const popupRefCrossActions = useRef<PopupActions>(null);
  const onOpenCrossActionsModal = (): void => {
    if (popupRefCrossActions && popupRefCrossActions.current) {
      popupRefCrossActions.current.open();
    }
  };
  const onCloseCrossActionsModal = (): void => {
    onCloseConfirmModal(); // Close Confirmation Due Modal
    if (popupRefCrossActions && popupRefCrossActions.current) {
      popupRefCrossActions.current.close();
    }
  };

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

  const popupRefOrder = useRef<PopupActions>(null);
  const onOpenOrderModal = (): void => {
    if (popupRefOrder && popupRefOrder.current) {
      popupRefOrder.current.open();
    }
  };
  const onCloseOrderModal = (): void => {
    if (popupRefOrder && popupRefOrder.current) {
      popupRefOrder.current.close();
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={dueLoading || deleteDue} />
      <View style={styles.header}>
        <View style={styles.leftChild}>
          <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('assetDashboard:dues')}
          </Text>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {currencySymbol} {amount}
        </Text>
      </View>
      <PrevNextPagination
        onPressPrevBtn={onPressPrev}
        onPressNextBtn={onPressNext}
        isPrevDisabled={offset === 0}
        isNextDisabled={offset === dues.length}
        hasMore={hasMore}
        limit={limit}
        loader={dueLoading || deleteDue}
      >
        <FlatList
          data={duesArray}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={itemSeparator}
          ListEmptyComponent={EmptyState}
        />
      </PrevNextPagination>
      <CrossActionsPopover
        popupRef={popupRefCrossActions}
        onCloseModal={onCloseCrossActionsModal}
        data={getSheetData()}
      />
      <DueConfirmPopover popupRef={popupRefConfirm} onCloseModal={onCloseConfirmModal} onPressDelete={onDeleteDue} />
      <DuesOrderSummary popupRef={popupRefOrder} onCloseModal={onCloseOrderModal} />
    </View>
  );
};

export default DueList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginVertical: 24,
    padding: 16,
    borderRadius: 4,
  },
  divider: {
    marginVertical: 8,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    paddingBottom: 16,
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
});
