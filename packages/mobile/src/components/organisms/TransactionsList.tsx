import React, { ReactElement } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import TransactionCard from '@homzhub/mobile/src/components/molecules/TransactionCard';
import withNavigation, { IWithNavigationProps } from '@homzhub/mobile/src/components/HOC/withNavigation';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IOwnProps extends WithTranslation, IWithNavigationProps {
  transactionsList: FinancialRecords[];
  toggleLoading: (loader: boolean) => void;
}

interface IReduxState {
  transactionsCount: number;
  selectedProperty: number;
  selectedCountry: number;
}

interface IDispatchProps {
  getTransactions: (payload: ITransactionParams) => void;
  getLedgerMetrics: () => void;
  getLedgers: () => void;
}

type Props = IOwnProps & IReduxState & IDispatchProps;

interface IOwnState {
  expandedItem: number;
  showBottomSheet: boolean;
  currentTransactionId: number;
}

const PAGE_LIMIT = 10;

class TransactionsList extends React.PureComponent<Props, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();

  public state = {
    expandedItem: -1,
    showBottomSheet: false,
    currentTransactionId: -1,
  };

  public render(): ReactElement {
    const { transactionsList } = this.props;

    if (!transactionsList.length) return <EmptyState />;

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={this.scrollRef}
          onScroll={this.onScroll}
          scrollEventThrottle={1500}
        >
          {transactionsList.map(this.renderTransactionCard)}
        </ScrollView>
        {this.renderBottomSheet()}
      </>
    );
  }

  private renderBottomSheet = (): React.ReactElement => {
    const { showBottomSheet } = this.state;
    const { t } = this.props;
    const onPressDelete = (): Promise<void> => this.onConfirmDelete().then();
    return (
      <ConfirmationSheet
        isVisible={showBottomSheet}
        message={t('assetFinancial:deleteRecordConfirmation')}
        onCloseSheet={this.closeBottomSheet}
        onPressDelete={onPressDelete}
      />
    );
  };

  private renderTransactionCard = (item: FinancialRecords, index: number): React.ReactElement => {
    const { expandedItem } = this.state;
    const onCardPress = (height: number): void => this.onCardPress(index, height);

    const handleEdit = (): void => {
      this.onPressEdit(item.id);
    };

    const handleDelete = (): void => {
      this.openBottomSheet(item.id);
    };

    return (
      <TransactionCard
        key={`${item.id}-${index}`}
        isExpanded={expandedItem === index}
        transaction={item}
        onCardPress={onCardPress}
        handleDownload={this.onDownloadDocument}
        onPressEdit={handleEdit}
        onPressDelete={handleDelete}
      />
    );
  };

  private onConfirmDelete = async (): Promise<void> => {
    const { toggleLoading, t, getLedgerMetrics, getLedgers } = this.props;
    const { currentTransactionId } = this.state;
    if (currentTransactionId > -1) {
      try {
        toggleLoading(true);
        await LedgerRepository.deleteLedger(currentTransactionId);
        this.getGeneralLedgers(true);
        this.setState({ expandedItem: -1 });
        toggleLoading(false);
        getLedgerMetrics();
        getLedgers();
        this.closeBottomSheet();
        AlertHelper.success({ message: t('assetFinancial:deletedSuccessfullyMessage') });
      } catch (e) {
        toggleLoading(false);
        this.closeBottomSheet();
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  private onPressEdit = (id: number): void => {
    const { navigation } = this.props;
    if (navigation) {
      navigation.navigate(ScreensKeys.AddRecordScreen, { isEditFlow: true, transactionId: id });
    }
  };

  private onCardPress = (expandedItem: number, height: number): void => {
    const { expandedItem: prev } = this.state;
    const { transactionsList } = this.props;

    if (prev === expandedItem) {
      this.setState({ expandedItem: -1 });
      if (expandedItem > transactionsList.length - 5) {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd();
        }, 0);
      }
      return;
    }

    this.setState({ expandedItem }, () => {
      if (expandedItem > transactionsList.length - 5 && !transactionsList[expandedItem].attachmentDetails.length) {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd();
        }, 0);
      }
      this.scrollRef.current?.scrollTo({ y: expandedItem * height, animated: true });
    });
  };

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const paddingToBottom = 40;
    const {
      nativeEvent: { layoutMeasurement, contentOffset, contentSize },
    } = event;

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      this.onEndReachedHandler();
    }
  };

  private onDownloadDocument = async (key: string, fileName: string): Promise<void> => {
    await AttachmentService.downloadAttachment(key, fileName);
  };

  private onEndReachedHandler = (): void => {
    const { transactionsList, transactionsCount } = this.props;
    if (transactionsCount === transactionsList.length) return;
    this.getGeneralLedgers();
  };

  private openBottomSheet = (id: number): void => {
    this.setState({ showBottomSheet: true, currentTransactionId: id });
  };

  private closeBottomSheet = (): void => {
    this.setState({ showBottomSheet: false, currentTransactionId: -1 });
  };

  private getGeneralLedgers = (reset = false): void => {
    const { selectedCountry, selectedProperty, getTransactions, transactionsList } = this.props;
    getTransactions({
      offset: reset ? 0 : transactionsList.length,
      limit: PAGE_LIMIT,
      asset_id: selectedProperty || undefined,
      country_id: selectedCountry || undefined,
    });
  };
}

const mapStateToProps = (state: IState): IReduxState => {
  const { getTransactionsCount, getSelectedCountry, getSelectedProperty } = FinancialSelectors;
  return {
    transactionsCount: getTransactionsCount(state),
    selectedCountry: getSelectedCountry(state),
    selectedProperty: getSelectedProperty(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTransactions, getLedgerMetrics, getLedgers } = FinancialActions;
  return bindActionCreators({ getTransactions, getLedgerMetrics, getLedgers }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetFinancial)(withNavigation(TransactionsList)));
