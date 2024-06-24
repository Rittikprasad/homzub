import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export const mockReviews = [
  {
    id: 1,
    experience_area: 'Location and Neighbourhood',
    rating: 93,
  },
  {
    id: 2,
    experience_area: 'Fair Pricing for Rent',
    rating: 91,
  },
  {
    id: 3,
    experience_area: 'Property Up-keep and maintenance',
    rating: 49,
  },
];

export const mockAsset = {
  id: 1,
  assetGroup: {
    id: 1,
    name: 'Residential',
  },
  postal_code: '560097',
  city_name: 'Bengaluru',
  state_name: 'Karnataka',
  country_name: 'India',
  project_name: 'Malti Kunj',
  unit_number: '41',
  block_number: 'B',
  latitude: 25.619,
  longitude: 85.123,
  carpet_area: 5000,
  carpet_area_unit: {
    id: 1,
    name: 'SQ_FT',
    label: 'Square feet',
    title: 'Sq.ft',
  },
  floor_number: 1,
  total_floors: 4,
  assetLocation: {
    latitude: 25.619,
    longitude: 85.123,
  },
  lastVisitedStep: {
    assetCreation: {
      percentage: 10,
    },
    listing: {
      type: TypeOfPlan.RENT,
    },
  },
  country: {
    id: 1,
    name: 'India',
    iso2_code: 'IN',
    iso3_code: 'IN',
    phone_codes: [],
    currencies: [
      {
        currency_name: 'Indian Rupee',
        currency_symbol: '₹',
        currency_code: 'INR',
      },
    ],
  },
  assetType: {
    id: 2,
    name: 'Apartment / Condo',
  },
  spaces: [
    {
      id: 1,
      name: 'Bedroom',
      count: 1,
    },
    {
      id: 2,
      name: 'Bathroom',
      count: 1,
    },
  ],
  leaseTerm: {
    id: 1,
    currency_code: 'INR',
    monthly_rent_price: 20000.0,
    security_deposit_price: 40000.0,
    annual_increment_percentage: 11.0,
    minimum_lease_period: 11,
    available_from_date: '2020-07-03',
    maintenance_paid_by: '5th Every Month',
    utility_paid_by: '2',
    maintenance_amount: 1200,
    maintenance_schedule: null,
    furnishing_status: 'Semi',
  },
  saleTerm: {
    id: 1,
    currency_code: 'INR',
    expected_price: 1234,
    expected_booking_amount: 1234,
    year_of_construction: 2000,
    available_from_date: '2020-08-20',
    maintenance_amount: 100,
    maintenance_schedule: 'MONTHLY',
  },
  description: 'It is a long established fact that the readable content of a page when looking at its layout.',
  verifications: {
    verification_status: 3,
    description: 'It was popularised in the 1960s with the release of Letraset sheets.',
  },
  posted_on: '2020-06-03',
  attachments: [
    {
      file_name: 'prof.jpg',
      is_cover_image: true,
      link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
      media_type: 'IMAGE',
      media_attributes: {},
    },
    {
      file_name: 'DjangoBackendLLD (1).jpg',
      is_cover_image: false,
      link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/01d71336-cd92-11ea-972b-34e12d38d70eDjangoBackendLLD%201.jpg',
      media_type: 'IMAGE',
      media_attributes: {},
    },
  ],
  amenities: [
    {
      id: 1,
      name: 'Gymnasium',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 7,
        name: 'gym.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/096a9ac6a0c144158a1a3b893e6e8661.svg',
      },
    },
    {
      id: 2,
      name: 'Swimming Pool',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 8,
        name: 'pool.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/32cef5dd96c54363848f16a28157c9bd.svg',
      },
    },
    {
      id: 3,
      name: 'CCTV Security',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 9,
        name: 'cctv.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/e1b50cf36b274f82832d06d534740dfe.svg',
      },
    },
    {
      id: 4,
      name: 'Parking',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 10,
        name: 'parking.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/744c4c3752f34240aefad6b7ca31cdb0.svg',
      },
    },
    {
      id: 5,
      name: 'Wifi',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 11,
        name: 'wifi.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/8ef69654fe634098bfb3b0d749bb6abe.svg',
      },
    },
    {
      id: 6,
      name: 'Intercom',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 12,
        name: 'intercom.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/58f8157e972742f896044b2c943a7319.svg',
      },
    },
    {
      id: 7,
      name: 'Balcony',
      category: {
        id: 1,
        name: 'General',
      },
      attachment: {
        id: 13,
        name: 'balcony.svg',
        link: 'https://homzhub-bucket.s3.us-east-1.amazonaws.com/19fe670df70c4ff8b9fc6de68bef8efb.svg',
      },
    },
  ],
  furnishing: 'NONE',
  highlights: [
    {
      name: 'Power Backup',
      covered: true,
    },
    {
      name: 'Gated Society',
      covered: true,
    },
  ],
  contacts: {
    id: 1,
    full_name: 'Anuvrat Somnath',
    email: 'anuvrat.somnath@nineleaps.com',
    country_code: '+91',
    phone_number: '7903470293',
  },
  features: [
    {
      name: 'Security Deposit',
      locale_key: 'security_deposit',
      value: '₹ 2 Lacs',
    },
    {
      name: 'Min Lease Period',
      locale_key: 'min_lease_period',
      value: '3 Months',
    },
    {
      name: 'Maintenance Paid By',
      locale_key: 'maintenance_paid_by',
      value: 'Owner',
    },
    {
      name: 'Utilities Paid By',
      locale_key: 'utilities_paid_by',
      value: 'Tenant',
    },
    {
      name: 'Maintenance',
      locale_key: 'maintenance',
      value: '₹ 5,000',
    },
    {
      name: 'Building Age',
      locale_key: 'building_age',
      value: '5 Years',
    },
    {
      name: 'Building Type',
      locale_key: 'building_type',
      value: 'Apartment',
    },
  ],
  is_managed: true,
};

export const AssetSearchData = {
  count: 1,
  links: {
    previous: null,
    next: null,
  },
  results: [mockAsset],
};
