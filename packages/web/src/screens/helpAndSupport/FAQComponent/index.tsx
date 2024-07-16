/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GraphQLRepository } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import QuestionCards from '@homzhub/web/src/screens/faq/components/questionCard';
import HaveAnyQuestionsForm from '@homzhub/web/src/screens/helpAndSupport/HaveAnyQuestionsForm';
import { IFAQs } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IOrderedFAQS {
  [key: string]: IFAQs[];
}

const FAQComponent = (): React.ReactElement => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = FAQComponentStyle(isMobile, isTablet);
  const getOrderedCategories = (response: IFAQs[]): IOrderedFAQS => {
    const orderedCategories: IOrderedFAQS = {};
    for (let i = 0; i < response.length; i++) {
      const item: IFAQs = response[i];
      if (!orderedCategories[item.category.title]) {
        orderedCategories[item.category.title] = [item];
      } else if (orderedCategories[item.category.title]) {
        orderedCategories[item.category.title] = [...orderedCategories[item.category.title], item];
      }
    }
    return orderedCategories;
  };
  const [faqs, setFAQs] = useState<IOrderedFAQS>({});
  const getFAQs = async (): Promise<void> => {
    try {
      const response = await GraphQLRepository.getFAQAllQuestions();
      setFAQs(getOrderedCategories(response));
    } catch (e: any) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
  const getSearchFAQs = async (searchParam: string): Promise<void> => {
    try {
      const response = await GraphQLRepository.getFAQSearchQuestions(searchParam);
      setFAQs(getOrderedCategories(response));
    } catch (e: any) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
  useEffect(() => {
    getFAQs().then();
  }, []);

  const onChange = (text: string): void => {
    setSearchText(text);
    if (text.length >= 3) {
      debounceOnChange(text);
    } else if (text.length === 0) {
      getSearchFAQs('');
    }
  };
  const debounceOnChange = React.useCallback(
    debounce((text) => getSearchFAQs(text), 300),
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.child1}>
        <View style={styles.header}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle}>
            {t('helpAndSupport:FAQ')}
          </Text>
          <SearchField
            placeholder={t('common:search')}
            value={searchText}
            updateValue={onChange}
            containerStyle={styles.searchBar}
          />
        </View>
        {Object.keys(faqs).length ? (
          <View>
            {Object.keys(faqs).map((item, key = 0) => {
              return (
                <View key={key}>
                  <View style={styles.title} key={key}>
                    <Text type="small" textType="semiBold" style={styles.text}>
                      {item}
                    </Text>
                  </View>

                  {faqs[item].map((datum) => {
                    return (
                      <View
                        style={[styles.cards, isTablet && styles.cardsTablet, isMobile && styles.cardsMobile]}
                        key={datum.question}
                      >
                        <QuestionCards
                          item={datum}
                          contentStyle={styles.titleContent}
                          contentStyleTablet={styles.titleContentTablet}
                          contentStyleMobile={styles.titleContentMobile}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState isIconRequired={false} />
        )}
      </View>
      <View style={styles.child2}>
        <HaveAnyQuestionsForm />
      </View>
    </View>
  );
};

interface IFAQComponentStyle {
  container: ViewStyle;
  child1: ViewStyle;
  child2: ViewStyle;
  title: ViewStyle;
  searchBar: ViewStyle;
  header: ViewStyle;
  text: ViewStyle;
  headerTitle: ViewStyle;
  cards: ViewStyle;
  cardsTablet: ViewStyle;
  cardsMobile: ViewStyle;
  titleContent: ViewStyle;
  titleContentTablet: ViewStyle;
  titleContentMobile: ViewStyle;
}

const FAQComponentStyle = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IFAQComponentStyle> =>
  StyleSheet.create<IFAQComponentStyle>({
    container: {
      flexDirection: isTablet ? 'column' : 'row',
    },
    child1: {
      borderRadius: 4,
      backgroundColor: theme.colors.white,
      padding: 12,
      flex: 2,
    },
    child2: {
      flex: 1,
    },
    title: {
      flexDirection: 'row',
      margin: 8,
      marginLeft: 20,
      marginTop: 16,
    },
    searchBar: {
      height: 32,
      marginTop: isMobile ? 12 : 0,
    },
    header: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 28,
    },
    text: {
      color: theme.colors.blueTint6,
    },
    headerTitle: {
      color: theme.colors.darkTint1,
    },
    cards: {
      width: '100%',
      marginTop: 8,
      marginBottom: 8,
    },
    cardsTablet: {
      marginLeft: 18,
      width: '94%',
    },
    cardsMobile: {
      width: '96%',
      margin: 'auto',
    },
    titleContent: {
      width: 680,
      color: theme.colors.darkTint2,
      padding: 12,
    },
    titleContentTablet: {
      width: 520,
    },
    titleContentMobile: {
      width: 232,
    },
  });
export default FAQComponent;
