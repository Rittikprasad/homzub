import React, { PureComponent } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { OrderTotalSummary } from '@homzhub/common/src/domain/models/OrderSummary';

interface IOwnProps {
  containerStyle?: ViewStyle;
  summaryList: OrderTotalSummary[];
  currency: Currency;
  amountPayableText: OrderTotalSummary;
  showOrderSummaryHeader?: boolean;
  hasDottedDivider?: boolean;
}

type Props = IOwnProps & WithTranslation;

export class OrderSummary extends PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, summaryList, amountPayableText, containerStyle, showOrderSummaryHeader = true } = this.props;
    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        {showOrderSummaryHeader && (
          <Text type="small" textType="semiBold" style={styles.heading}>
            {t('property:orderSummary')}
          </Text>
        )}
        <View style={[showOrderSummaryHeader && styles.listContainer]}>
          {summaryList?.map(this.renderList) ?? null}
        </View>
        {amountPayableText && this.renderTotalView(amountPayableText)}
      </View>
    );
  }

  private renderList = (item: OrderTotalSummary, index: number): React.ReactElement => {
    const { title, value, valueColor } = item;
    const { currency } = this.props;
    const amount =
      valueColor === theme.colors.green ? `- ${currency.currencySymbol}${value}` : `${currency.currencySymbol}${value}`;

    return (
      <View style={styles.listItem} key={`${item.title}-${index}`}>
        <Text type="small" textType="semiBold" style={styles.listKey}>
          {title}
        </Text>
        <Text type="small" textType="semiBold" style={[styles.listValue, { color: valueColor }]}>
          {amount}
        </Text>
      </View>
    );
  };

  private renderTotalView = (total: OrderTotalSummary): React.ReactElement => {
    const { currency, t, hasDottedDivider = false } = this.props;
    const { title, value } = total;

    return (
      <View style={styles.totalView}>
        <Divider containerStyles={[styles.divider, hasDottedDivider && styles.borderRadius]} />
        <View style={styles.totalContent}>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {title}
          </Text>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {`${currency.currencySymbol}${value}`}
          </Text>
        </View>
        <View style={styles.roundedOffContainer}>
          <Icon name={icons.roundFilled} color={theme.colors.darkTint3} size={7} style={styles.roundedOffText} />
          <Label type="regular" textType="semiBold" style={styles.totalText}>
            {t('common:roundedOff')}
          </Label>
        </View>
        <Divider containerStyles={[styles.divider, hasDottedDivider && styles.borderRadius]} />
      </View>
    );
  };
}

export default withTranslation()(OrderSummary);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  heading: {
    color: theme.colors.darkTint4,
  },
  listContainer: {
    marginVertical: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listKey: {
    color: theme.colors.darkTint5,
  },
  listValue: {
    color: theme.colors.darkTint3,
  },
  totalView: {
    marginBottom: 16,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  divider: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.darkTint7,
  },
  totalText: {
    color: theme.colors.darkTint2,
  },
  roundedOffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginTop: 1,
  },
  roundedOffText: {
    marginEnd: 5,
    marginTop: 2,
  },
  borderRadius: {
    borderRadius: 0.001,
  },
});
