import { theme } from '@homzhub/common/src/styles/theme';

export interface IAssetData {
  id: number;
  property_name: string;
  address: string;
  type: string;
  color: string;
  images: any;
  contacts?: any;
  isPropertyCompleted: boolean;
}

export const TenanciesAssetData = [
  {
    id: 5,
    project_name: 'House 2',
    unit_number: '103',
    block_number: 'B',
    latitude: 25.6207722,
    longitude: 85.1280892,
    carpet_area: 2500.0,
    carpet_area_unit: {
      id: 1,
      name: 'SQ_FT',
      label: 'Square feet',
      title: 'Sq.ft',
    },
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    floor_number: 2,
    total_floors: 3,
    asset_type: {
      id: 5,
      name: 'Studio Apartment',
    },
    spaces: [
      {
        id: 1,
        name: 'Bedroom',
        count: 2,
      },
      {
        id: 2,
        name: 'Bathroom',
        count: 1,
      },
    ],
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    digital_id: '8fad8389-6893-411a-bd4a-4b1575523d4a',
    construction_year: null,
    is_gated: null,
    description: '',
    furnishing: 'SEMI',
    attachments: [
      {
        file_name: 'prof.jpg',
        is_cover_image: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
    ],
    verification_documents: [],
    verifications: {
      verification_status: 2,
      description:
        '**What is this verification?**\nSed ut perspiciatis unde omnis iste natus error sit voluptatem\naccusantium doloremque laudantium.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur\naut odit aut fugit. Neque porro quisquam est,\nqui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,\nsed quia non numquam eius modi tempora incidunt ut labore et dolore\nmagnam aliquam quaerat voluptatem.',
    },
    progress_percentage: 74.0,
    notifications: {
      count: 5,
    },
    serviceTickets: {
      count: 0,
    },
    assetStatusInfo: {
      tag: {},
      leaseTransaction: {},
      leaseTenantInfo: {},
    },
  },
];

export const PortfolioAssetData = [
  {
    id: 1,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'OWNER',
    isPropertyCompleted: true,
    color: '#CE9B6C',
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
  },
  {
    id: 2,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'RENTED',
    isPropertyCompleted: true,
    color: theme.colors.gradientA,
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 3,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'VACANT',
    isPropertyCompleted: true,
    color: theme.colors.highPriority,
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 4,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'VACANT',
    isPropertyCompleted: false,
    color: theme.colors.highPriority,
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
  },
  {
    id: 5,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'FOR SALE',
    isPropertyCompleted: true,
    color: theme.colors.mediumPriority,
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 6,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'MAINTAIN',
    isPropertyCompleted: true,
    color: theme.colors.informational,
    country: {
      id: 1,
      name: '',
      iso2_code: '',
      iso3_code: '',
      phone_codes: [],
      currencies: [
        {
          currency_name: '',
          currency_symbol: '',
          currency_code: '',
        },
      ],
    },
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2013/08/13/Photos/house--621x414.jpg',
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
];

export const AssetFilter = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Rented',
    value: 'rented',
  },
  {
    label: 'Vacant',
    value: 'vacant',
  },
  {
    label: 'For Sale',
    value: 'sale',
  },
  {
    label: 'Maintain',
    value: 'maintain',
  },
];

export const DocumentsData = [
  {
    id: 1,
    asset: 1,
    description: '',
    uploaded_on: '02/07/2020',
    attachment: {
      fileName: 'Dummy',
      link: 'dummy.pdf',
    },
    user: {
      fullName: 'Test user',
      email: 'test@gmail.com',
    },
  },
];

export const TenantHistoryData = [
  {
    id: 1,
    lease_listing: 1,
    lease_transaction: {
      id: 1,
      lease_start_date: '2020-08-14T09:55:52.115420Z',
      lease_end_date: '2021-07-14T09:55:52.115420Z',
      total_lease_period: '334 00:00:00',
      remaining_lease_period: '314 05:39:40.503404',
    },
    tenant_user: {
      id: 1,
      full_name: 'Abhijeet Anand Shah',
      email: 'abhijeet.shah@nineleaps.com',
      country_code: '+91',
      phone_number: '9031666258',
    },
  },
  {
    id: 4,
    lease_listing: 10,
    lease_transaction: {
      id: 4,
      lease_start_date: '2020-08-14T09:55:52.115420Z',
      lease_end_date: '2021-07-14T09:55:52.115420Z',
      total_lease_period: '334 00:00:00',
      remaining_lease_period: '314 05:39:40.486645',
    },
    tenant_user: {
      id: 3,
      full_name: 'rishumodi',
      email: 'rishumodi95@gmail.com',
      country_code: '+91',
      phone_number: '9108305412',
    },
  },
];
