import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';
import { GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';

enum TabKeys {
  expenses = 1,
  cashFlow = 2,
}

interface IOwnState {
  currentTab: TabKeys;
}

interface IStateProps {
  financialYear: { startDate: string; endDate: string; startMonthIndex: number; endMonthIndex: number };
  selectedProperty: number;
  selectedCountry: number;
  selectedTimeRange: DateFilter;
  ledgerData: GeneralLedgers[];
}

interface IDispatchProps {
  setTimeRange: (range: number) => void;
  getLedgers: () => void;
}

type Props = IStateProps & IDispatchProps & WithTranslation;

export class FinanceOverview extends React.PureComponent<Props, IOwnState> {
  public state = {
    currentTab: TabKeys.cashFlow,
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { selectedCountry: oldCountry, selectedProperty: oldProperty, selectedTimeRange: prevTimeRange } = prevProps;
    const { selectedProperty, selectedCountry, selectedTimeRange } = this.props;
    if (selectedProperty !== oldProperty || selectedCountry !== oldCountry || selectedTimeRange !== prevTimeRange) {
      this.getLedgersData();
    }
  };

  public render = (): React.ReactNode => {
    const { t, financialYear, selectedTimeRange } = this.props;
    const { currentTab } = this.state;
    const { ledgerData } = this.props;
    return (
      <View style={styles.container}>
        <OnFocusCallback callback={this.getLedgersData} />
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('overallPerformance')}
        </Text>
        <SelectionPicker
          data={[
            { title: t('incomeText'), value: TabKeys.cashFlow },
            { title: t('expenses'), value: TabKeys.expenses },
          ]}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
          testID="financeSelection"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateSection}>
            <Icon name={icons.calendar} size={22} color={theme.colors.darkTint4} />
            <Label numberOfLines={1} style={styles.dateText} type="large" textType="semiBold">
              {FinanceUtils.renderCalenderLabel({ selectedTimeRange, financialYear })}
            </Label>
          </View>
          <Dropdown
            data={FinanceUtils.renderFilterOptions(t)}
            value={selectedTimeRange}
            // @ts-ignore
            onDonePress={this.onTimeRangeChange}
            listHeight={theme.viewport.height / 2}
            testID="drpTimeRange"
            isOutline
            containerStyle={styles.dropdownStyle}
            hasDynamicWidth
          />
        </View>
        {currentTab === TabKeys.expenses ? (
          <DonutGraph data={LedgerUtils.filterByType(LedgerTypes.debit, ledgerData)} />
        ) : (
          <DoubleBarGraph data={FinanceUtils.getBarGraphData({ selectedTimeRange, financialYear }, ledgerData)} />
        )}
      </View>
    );
  };

  private onTabChange = (tabId: TabKeys): void => {
    this.setState({ currentTab: tabId }, () => {
      this.getLedgersData();
    });
  };

  private onTimeRangeChange = (newTimeRange: number): void => {
    const { setTimeRange, selectedTimeRange } = this.props;
    if (newTimeRange === selectedTimeRange) return;
    setTimeRange(newTimeRange);
  };

  private getLedgersData = (): void => {
    const { getLedgers } = this.props;
    getLedgers();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserFinancialYear } = UserSelector;
  const { getSelectedCountry, getSelectedProperty, getSelectedTimeRange, getLedgerData } = FinancialSelectors;
  return {
    financialYear: getUserFinancialYear(state),
    selectedProperty: getSelectedProperty(state),
    selectedCountry: getSelectedCountry(state),
    selectedTimeRange: getSelectedTimeRange(state),
    ledgerData: getLedgerData(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setTimeRange, getLedgers } = FinancialActions;
  return bindActionCreators(
    {
      setTimeRange,
      getLedgers,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(FinanceOverview));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    backgroundColor: theme.colors.white,
  },
  dateRow: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSection: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    marginBottom: 16,
  },
  dateText: {
    flex: 1,
    marginStart: 8,
    color: theme.colors.darkTint4,
  },
  dropdownStyle: {
    width: 140,
  },
});
