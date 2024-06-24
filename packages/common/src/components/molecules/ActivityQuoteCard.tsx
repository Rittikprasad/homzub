import React from 'react';
import { FlatList, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Quote } from '@homzhub/common/src/domain/models/Quote';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { TicketActivityQuote } from '@homzhub/common/src/domain/models/TicketActivityQuote';
import { User } from '@homzhub/common/src/domain/models/User';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  quoteData: QuoteCategory[];
  onQuotePress?: (url: string) => Promise<void> | void;
}

interface IQuoteDataItem {
  id: number;
  title: string;
  data: Quote[];
}

interface IQuotesApproved {
  quoteData: TicketActivityQuote[];
  description: string;
}

interface IApprovedQuoteItem {
  id: number;
  title: string;
  price: string;
  user: User;
  role: string;
}

const QuotesSubmitted = (props: IProps): React.ReactElement => {
  const { quoteData, onQuotePress = FunctionUtils.noop } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const formatQuotes = (): IQuoteDataItem[] => {
    return quoteData.map((quoteDataItem) => ({
      id: quoteDataItem.id,
      title: quoteDataItem.name,
      data: quoteDataItem.quotes,
    }));
  };

  const allQuotes = formatQuotes();

  const renderItem = ({ item }: { item: Quote }): React.ReactElement => {
    const {
      id,
      currency: { currencySymbol },
      attachment: { link },
      totalAmount,
      quoteNumber,
    } = item;

    const onPress = async (): Promise<void> => await onQuotePress(link);

    return (
      <TouchableOpacity key={id} style={styles.quoteItem} onPress={onPress}>
        <View style={styles.quoteStart}>
          <Icon name={icons.docFilled} size={20} style={styles.fileIcon} />
          <Label textType="regular" type="large">
            {t('quoteNumber', { number: quoteNumber })}
          </Label>
        </View>
        <Label textType="regular" type="large">{`${currencySymbol}${totalAmount}`}</Label>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: IQuoteDataItem }): React.ReactElement => {
    const { title } = section;
    const showDivider = allQuotes.indexOf(section) !== 0;
    return (
      <View style={styles.sectionHeader}>
        {showDivider && <Divider containerStyles={styles.divider} />}
        <Label textType="semiBold" type="large">
          {t('quoteCategory', { title })}
        </Label>
      </View>
    );
  };

  const renderItemSeparator = (): React.ReactElement => <View style={styles.itemSeparator} />;

  const keyExtractor = (item: Quote, index: number): string => `${item.id} [${index}]`;

  return (
    <>
      <View style={styles.container}>
        <SectionList
          sections={allQuotes}
          keyExtractor={keyExtractor}
          // @ts-ignore
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerStyle={styles.sectionList}
          ItemSeparatorComponent={renderItemSeparator}
        />
      </View>
      <Badge
        badgeColor={theme.colors.gray11}
        title={t('serviceTickets:awaitingApprovalAndPayment')}
        badgeStyle={styles.activityBadge}
        titleStyle={styles.activityBadgeText}
      />
    </>
  );
};

const QuotesApproved = (props: IQuotesApproved): React.ReactElement => {
  const { quoteData, description } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const formatApprovedQuotes = (): IApprovedQuoteItem[] => {
    return quoteData.map((quote) => {
      const {
        id,
        quoteRequestCategory: { name },
        totalAmount,
        currency: { currencySymbol },
        user,
        role,
      } = quote;
      return {
        id,
        title: name,
        price: `${currencySymbol}${totalAmount}`,
        user,
        role,
      };
    });
  };

  const approvedQuotes = formatApprovedQuotes();

  const keyExtractor = (item: IApprovedQuoteItem): string => `${item.id}:[${item.price}]`;

  const renderItem = ({ item }: { item: IApprovedQuoteItem }): React.ReactElement => {
    const { title, price, role, user } = item;
    const { profilePicture, name } = user;
    return (
      <>
        <Avatar
          image={profilePicture}
          fullName={name}
          designation={StringUtils.toTitleCase(role) || t('property:owner')}
        />
        <View style={styles.approvedQuote}>
          <Label type="large" textType="regular">
            {t('quoteCategory', { title })}
          </Label>
          <Label type="large" textType="semiBold">
            {price}
          </Label>
        </View>
      </>
    );
  };

  const renderItemSeparator = (): React.ReactElement => <Divider containerStyles={styles.approvedDivider} />;

  return (
    <>
      <View style={styles.approvedHeader}>
        <Label textType="semiBold" type="large" style={styles.approvedComment}>
          {t('approvedQuotes')}
        </Label>
        {!!description && (
          <Label textType="regular" type="regular">
            {description}
          </Label>
        )}
      </View>
      <Divider containerStyles={styles.approvedSeparator} />
      <View style={styles.approvedContainer}>
        <FlatList
          data={approvedQuotes}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderItemSeparator}
          contentContainerStyle={styles.approvedFlatlist}
        />
      </View>
      <Badge
        badgeColor={theme.colors.gray11}
        title={t('awaitingWorkInitiation')}
        badgeStyle={styles.activityBadge}
        titleStyle={styles.activityBadgeText}
      />
    </>
  );
};

const ActivityQuotesSubmitted = React.memo(QuotesSubmitted);
const ActivityQuotesApproved = React.memo(QuotesApproved);

export { ActivityQuotesSubmitted, ActivityQuotesApproved };

const styles = StyleSheet.create({
  sectionList: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  fileIcon: {
    marginEnd: 10,
  },
  divider: {
    marginVertical: 20,
  },
  quoteItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  container: {
    backgroundColor: theme.colors.gray8,
    marginEnd: 16,
    marginTop: 16,
  },
  itemSeparator: {
    marginTop: 20,
  },
  activityBadge: {
    marginTop: 16,
    minHeight: 26,
    justifyContent: 'center',
    borderRadius: 6,
    marginEnd: 16,
  },
  activityBadgeText: {
    color: theme.colors.darkTint4,
  },
  approvedQuote: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  approvedDivider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  approvedContainer: {
    backgroundColor: theme.colors.gray8,
    paddingVertical: 10,
    marginEnd: 16,
    paddingHorizontal: 16,
  },
  approvedHeader: {
    backgroundColor: theme.colors.gray8,
    marginTop: 20,
    marginEnd: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  approvedComment: {
    marginTop: 15,
    marginBottom: 6,
  },
  approvedSeparator: {
    marginEnd: 16,
    borderColor: theme.colors.darkTint10,
  },
  approvedFlatlist: {
    marginVertical: 7,
  },
});
