import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Quote } from '@homzhub/common/src/domain/models/Quote';
import { UserQuote } from '@homzhub/common/src/domain/models/UserQuote';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  detail: UserQuote[];
  selectedQuote: number;
  onSelectQuote: (id: number) => void;
  onOpenQuote: (url: string) => void;
  onRequestMore: () => void;
}

const QuotePreview = (props: IProps): React.ReactElement => {
  const { detail, selectedQuote, onSelectQuote, onOpenQuote, onRequestMore } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const handleQuoteSelect = (id: number): void => {
    onSelectQuote(id);
  };
  // HANDLERS

  const renderQuotes = (quote: Quote): React.ReactElement => {
    const {
      id,
      quoteNumber,
      currency: { currencySymbol },
      totalAmount,
      attachment: { link },
    } = quote;
    const isSelected = id === selectedQuote;
    return (
      <View style={styles.cardContent}>
        <TouchableOpacity style={styles.center} onPress={(): void => onOpenQuote(link)}>
          <Icon name={icons.docFilled} color={theme.colors.darkTint5} size={20} />
          <Label type="large" style={styles.title}>
            {t('quoteNumber', { number: quoteNumber })}
          </Label>
        </TouchableOpacity>
        <View style={styles.center}>
          <Label type="large" style={styles.subTTitle} textType={isSelected ? 'semiBold' : 'regular'}>
            {currencySymbol} {totalAmount}
          </Label>
          <TouchableOpacity onPress={(): void => handleQuoteSelect(id)}>
            <Icon
              name={isSelected ? icons.circleFilled : icons.circleOutline}
              color={isSelected ? theme.colors.primaryColor : theme.colors.disabled}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const quoteData = detail.length > 0 ? detail.filter((item) => item.quotes.length > 0) : [];
  return (
    <>
      <Divider containerStyles={styles.divider} />
      {quoteData.length > 0 ? (
        quoteData.map((item, index) => {
          const { role, name, quotes } = item;
          return (
            <View key={index} style={styles.container}>
              <Avatar fullName={name} designation={StringUtils.toTitleCase(role)} />
              <View style={styles.cardContainer}>
                {quotes.map((quote) => {
                  return renderQuotes(quote);
                })}
              </View>
              <TouchableOpacity onPress={onRequestMore}>
                <Label type="large" textType="semiBold" style={styles.moreText}>
                  {t('requestForMore')}
                </Label>
              </TouchableOpacity>
              {index !== quoteData.length - 1 && <Divider containerStyles={styles.separator} />}
            </View>
          );
        })
      ) : (
        <EmptyState title={t('noQuoteFound')} />
      )}
    </>
  );
};

export default QuotePreview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  separator: {
    marginVertical: 12,
    borderColor: theme.colors.darkTint10,
  },
  title: {
    marginLeft: 8,
  },
  cardContainer: {
    marginVertical: 18,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  subTTitle: {
    marginRight: 8,
  },
  moreText: {
    color: theme.colors.primaryColor,
  },
});
