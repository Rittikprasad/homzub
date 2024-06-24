import axios from 'axios';
import { IFAQCategory, IFAQs } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  HOMZHUB: 'https://api-ap-northeast-1.graphcms.com/v2/ckiqymr7djhfb01z1di6m4fjs/master',
  FAQ: 'https://api-ap-northeast-1.graphcms.com/v2/ckmbpffvbztly01xw7dsudj1u/master',
};

export interface IFeaturedProperties {
  address: string;
  category: string;
  coverImage: { url: string };
  developer: { name: string };
  featured: boolean;
  id: string;
  images: { url: string }[];
  possessionDate: string;
  priceRange: string;
  projectName: string;
  slug: string;
  stage: string;
  typesAvailable: string;
}

const getQuery = (queryKey: string, param?: string): string => {
  switch (queryKey) {
    case 'featuredProperties':
      return `query {
        properties(orderBy: updatedAt_ASC) {
            id
            address
            possessionDate
            category
            priceRange
            typesAvailable
            coverImage {
                url
            }
            developer {
                name
            }
            projectName
            slug
            stage
            featured
            images {
                url
            }
        }
    }`;
    case 'faqAllCategories':
      return `query MyQuery {
      categories {
        activeIcon {
          url
        }  
        inActiveIcon {
          url
        }
        id
        title
      }
    }`;
    case 'faqAllQuestions':
      return `query MyQuery {
      faqs() {
        question
        answerRichText{html}
        category{id title}
      }
    }`;
    case 'faqSearchQuestions':
      return `query MyQuery {
      faqs(where: {question_contains: "${param}"}) {
        question
        answerRichText{html}
        category{id title}
      }
    }`;
    case 'faqCategoryQuestions':
      return `query MyQuery {
    faqs(where: {category: {AND: {id: "${param}"}}}) {
      question
      answerRichText{html}
      category{id title}
    }
  }`;
    default:
      return '';
  }
};
class GraphQLRepository {
  public getFeaturedProperties = async (): Promise<IFeaturedProperties[]> => {
    const response = await axios({
      url: ENDPOINTS.HOMZHUB,
      method: 'post',
      data: {
        query: getQuery('featuredProperties'),
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.properties;
  };

  public getFAQAllCategories = async (): Promise<IFAQCategory[]> => {
    const response = await axios({
      url: ENDPOINTS.FAQ,
      method: 'post',
      data: {
        query: getQuery('faqAllCategories'),
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.categories;
  };

  public getFAQAllQuestions = async (): Promise<IFAQs[]> => {
    const response = await axios({
      url: ENDPOINTS.FAQ,
      method: 'post',
      data: {
        query: getQuery('faqAllQuestions'),
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.faqs;
  };

  public getFAQSearchQuestions = async (param: string): Promise<IFAQs[]> => {
    const response = await axios({
      url: ENDPOINTS.FAQ,
      method: 'post',
      data: {
        query: getQuery('faqSearchQuestions', param),
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.faqs;
  };

  public getFAQCategoryQuestions = async (param: string): Promise<IFAQs[]> => {
    const response = await axios({
      url: ENDPOINTS.FAQ,
      method: 'post',
      data: {
        query: getQuery('faqCategoryQuestions', param),
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.faqs;
  };
}

const graphQLRepository = new GraphQLRepository();
export { graphQLRepository as GraphQLRepository };
