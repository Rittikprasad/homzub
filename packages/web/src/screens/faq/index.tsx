import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GraphQLRepository } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import SearchBarButton from '@homzhub/web/src/components/molecules/SearchBarButton';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import { FAQBanner } from '@homzhub/web/src/screens/faq/components/FaqBanner';
import QuestionCards from '@homzhub/web/src/screens/faq/components/questionCard';
import ContactUs from '@homzhub/web/src/screens/faq/components/contactUs';
import { IFAQCategory, IFAQs } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';

const FAQ: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const [categories, setCategories] = useState<IFAQCategory[] | []>([]);
  const [faqs, setFAQs] = useState<IFAQs[] | []>([]);
  const getCategories = async (): Promise<IFAQCategory[]> => {
    const response = await GraphQLRepository.getFAQAllCategories();
    setCategories(response);
    return response;
  };
  const getFAQs = async (): Promise<IFAQs[]> => {
    const response = await GraphQLRepository.getFAQAllQuestions();
    setFAQs(response);
    return response;
  };
  useEffect(() => {
    getCategories().then();
    getFAQs().then();
  }, []);
  const onPressCategory = async (id: string): Promise<IFAQs[]> => {
    const response = await GraphQLRepository.getFAQCategoryQuestions(id);
    setFAQs(response);
    return response;
  };

  const [isSearchActive, setSearchActive] = useState(false);

  const onSearchActive = (value: string): void => {
    if (value) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  };

  const HeaderSection = (): React.ReactElement => {
    return (
      <View style={styles.categoryContainer}>
        {categories.length &&
          (categories as IFAQCategory[]).map((el: IFAQCategory) => (
            <TouchableOpacity key={el.id} onPress={(): Promise<IFAQs[]> => onPressCategory(el.id)}>
              <View style={[styles.imageBox, isMobile && styles.imageBoxMobile]}>
                <Image
                  source={require('@homzhub/common/src/assets/images/gettingStarted.svg')}
                  style={[styles.imageContainer, isMobile && styles.imageContainerMobile]}
                />
                <Typography variant="label" size="large" fontWeight="semiBold" style={[styles.titleText]}>
                  {el.title}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  };
  const onSearchPress = async (value: string): Promise<void> => {
    const response = await GraphQLRepository.getFAQSearchQuestions(value);
    setFAQs(response);
  };
  return (
    <View style={styles.container}>
      <LandingNavBar />
      <FAQBanner />
      <View style={styles.upperBackground}>
        <SearchBarButton
          containerStyle={styles.searchBar}
          onSearchPress={onSearchPress}
          onSearchActive={onSearchActive}
        />
        <View style={styles.headerContainer}>{!isSearchActive && HeaderSection()}</View>
        <View style={[styles.faqCards, isTablet && styles.faqCardsMobile, isMobile && styles.faqCardsMobile]}>
          {faqs.length &&
            (faqs as IFAQs[]).map((item: IFAQs) => (
              <View
                style={[styles.cards, isTablet && styles.cardsTablet, isMobile && styles.cardsMobile]}
                key={item.question}
              >
                <QuestionCards
                  item={item}
                  contentStyle={styles.titleContent}
                  contentStyleTablet={styles.titleContentTablet}
                  contentStyleMobile={styles.titleContentMobile}
                />
              </View>
            ))}
        </View>
      </View>
      <View style={styles.contactUsSection}>
        <ContactUs />
      </View>
      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  upperBackground: {
    backgroundColor: theme.colors.background,
    marginBottom: 24,
  },
  headerContainer: {
    height: 'max-content',
  },
  cards: {
    width: '50%',
    marginBottom: 36,
  },
  faqCards: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  faqCardsMobile: {
    flexDirection: 'column',
  },
  cardsTablet: {
    marginLeft: 18,
    width: '94%',
  },
  cardsMobile: {
    width: '96%',
    margin: 'auto',
  },
  categoryContainer: {
    flex: 0.8,
    flexDirection: 'row',
    margin: 36,
    height: 100,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageBox: {
    height: 132,
    width: 256,
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.white}`,
    borderRadius: 8,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: 12,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 18,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageBoxMobile: {
    height: 140,
    width: '34vw',
  },
  imageContainer: {
    height: 40,
    width: 40,
  },
  imageContainerMobile: {
    height: 32,
    width: 32,
  },
  titleText: {
    marginTop: 18,
  },
  searchBar: {
    width: '50vw',
    alignSelf: 'center',
    marginTop: '54px',
  },
  contactUsSection: {
    height: 'max-content',
  },
  titleContent: {
    width: 500,
    color: theme.colors.darkTint2,
    padding: 12,
  },
  titleContentTablet: {
    width: 620,
  },
  titleContentMobile: {
    width: 300,
  },
});
