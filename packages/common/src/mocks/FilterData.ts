import { DateUtils } from '@homzhub/common/src/utils/DateUtils';

export const FilterData = {
  currency: [
    {
      currency_code: 'INR',
      currency_symbol: '₹',
      currency_name: '',
    },
  ],
  assetGroupList: [
    {
      id: 1,
      name: 'RESIDENTIAL',
      title: 'Residential',
    },
    {
      id: 2,
      name: 'COMMERCIAL',
      title: 'Commercial',
    },
  ],
  filters: {
    asset_group: {
      id: 2,
      name: 'COMMERCIAL',
      asset_types: [
        {
          id: 7,
          name: 'Commercial Office Space',
        },
        {
          id: 8,
          name: 'Office in IT park/SEZ',
        },
        {
          id: 9,
          name: 'Commercial Showroom',
        },
        {
          id: 10,
          name: 'Warehouse / Godown',
        },
      ],
      space_types: [
        {
          id: 2,
          name: 'Bathroom',
          field_type: '',
        },
      ],
      title: 'Commercial',
    },
    transaction_type: [
      {
        title: 'Rent',
        label: 'RENT',
        min_price: 0,
        max_price: 5000000,
      },
      {
        title: 'Buy',
        label: 'BUY',
        min_price: 0,
        max_price: 1000000000,
      },
    ],
    carpet_area: [
      {
        id: 1,
        name: 'SQ_FT',
        label: 'Square feet',
        title: 'Sq.ft',
        min_area: 121.0,
        max_area: 12345.0,
      },
    ],
  },
};

export const SearchFilter = {
  search_latitude: 0,
  search_longitude: 0,
  asset_transaction_type: 0,
  asset_type: [],
  min_price: -1,
  max_price: -1,
  min_area: -1,
  max_area: -1,
  area_unit: 1,
  furnishing_status: '',
  room_count: [-1],
  bath_count: -1,
  asset_group: 1,
  search_address: '',
  limit: 10,
  offset: 0,
  miscellaneous: {
    show_verified: false,
    agent_listed: false,
    search_radius: -1,
    date_added: -1,
    property_age: -1,
    rent_free_period: -1,
    expected_move_in_date: DateUtils.getCurrentMonthLastDate(),
    facing: [],
    furnishing: [],
    propertyAmenity: [],
  },
};
