import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export const PropertyAssetGroupData = [
  {
    id: 1,
    name: 'Residential',
    asset_types: [
      {
        id: 1,
        name: 'Residential House',
      },
      {
        id: 2,
        name: 'Apartment/Condo',
      },
      {
        id: 3,
        name: 'Villa',
      },
      {
        id: 4,
        name: 'Penthouse',
      },
      {
        id: 5,
        name: 'Studio Apartment',
      },
      {
        id: 6,
        name: 'Independent Floor',
      },
    ],
    space_types: [
      {
        id: 1,
        name: 'Room',
      },
    ],
  },
  {
    id: 2,
    name: 'Commercial',
    asset_types: [
      {
        id: 1,
        name: 'Commercial Office Space',
      },
      {
        id: 2,
        name: 'Office in IT park/SEZ',
      },
      {
        id: 3,
        name: 'Commercial Showroom',
      },
      {
        id: 4,
        name: 'Warehouse/Godown',
      },
    ],
    space_types: [
      {
        id: 1,
        name: 'Room',
      },
    ],
  },
];

export const ResidentialPropertyTypeData = [
  {
    id: 1,
    name: 'Room',
  },
  {
    id: 2,
    name: 'Balcony',
  },
  {
    id: 3,
    name: 'Bathroom',
  },
];

export const CommercialPropertyTypeData = [
  {
    id: 1,
    name: 'Floor number',
  },
  {
    id: 2,
    name: 'Total floors',
  },
  {
    id: 3,
    name: 'Bathrooms',
  },
  {
    id: 4,
    name: 'Carpet Area',
  },
];

export const assetGroups = [
  {
    id: 1,
    name: 'Residential',
    asset_types: [
      {
        id: 1,
        name: 'Residential House',
      },
      {
        id: 2,
        name: 'Apartment / Condo',
      },
      {
        id: 3,
        name: 'Villa',
      },
      {
        id: 4,
        name: 'Penthouse',
      },
      {
        id: 5,
        name: 'Studio Apartment',
      },
      {
        id: 6,
        name: 'Independant Floor',
      },
    ],
    space_types: [
      {
        id: 1,
        name: 'Bedroom',
      },
      {
        id: 2,
        name: 'Bathroom',
      },
      {
        id: 3,
        name: 'Balcony',
      },
    ],
  },
  {
    id: 2,
    name: 'Commercial',
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
      },
    ],
  },
];

export const assetDetail = {
  id: 4,
  asset_group: {
    id: 1,
    name: 'Residential',
  },
  project_name: 'Project',
  unit_number: '12',
  block_number: '#12',
  latitude: '0.9999',
  longitude: '0.24444',
  carpet_area: '12',
  carpet_area_unit: {
    id: 1,
    name: 'SQ_FT',
    label: 'Square feet',
    title: 'Sq.ft',
  },
  floor_number: 2,
  total_floors: 5,
};

export const leaseTermDetail = [
  {
    id: 1,
    currency_code: '+91',
    monthly_rent_price: 1200,
    security_deposit_price: 15000,
    annual_increment_percentage: 5,
    minimum_lease_period: 2,
    furnishing_status: 'SEMI',
    available_from_date: '2020-09-12',
    maintenance_paid_by: 'OWNER',
    utility_paid_by: 'OWNER',
    maintenance_amount: 1,
    maintenance_schedule: 'MONTHLY',
  },
];

export const saleTerm = [
  {
    id: 1,
    currency_code: '+91',
    expected_price: 1200,
    booking_amount: 500,
    year_of_construction: 1,
    available_from_date: '2020-09-12',
    maintenance_amount: 200,
    maintenance_schedule: ScheduleTypes.MONTHLY,
  },
];
