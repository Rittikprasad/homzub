export interface IInvestmentMockData {
  id: number;
  investmentStatus: string;
  project_name: string;
  address: string;
  status: number;
  asset_group: IAssetGroup;
  asset_type: IAssetGroup;
  spaces: IAssetSpaces[];
}

interface IAssetGroup {
  id: number;
  name: string;
}
interface IAssetSpaces {
  id: number;
  name: string;
  count: number;
}

export const InvestmentMockData: IInvestmentMockData[] = [
  {
    id: 1,
    investmentStatus: 'New',
    project_name: 'Orbitz Corporate - Kalpataru Splend',
    address: 'Shankar Kalat Nagar, Maharashtra 411057',
    status: 40,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Farm House',
    },
    spaces: [
      {
        id: 1,
        name: 'Bedroom',
        count: 3,
      },
      {
        id: 2,
        name: 'Bathroom',
        count: 3,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 2,
      },
    ],
  },
  {
    id: 2,
    investmentStatus: 'Sale',
    project_name: 'Eaton Garth Manor',
    address: '2972 Westheimer Rd. Santa Ana, NY',
    status: 20,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Apartment',
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
        count: 2,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 1,
      },
    ],
  },
  {
    id: 3,
    investmentStatus: 'Ready',
    project_name: 'Eaton Garth Manor',
    address: '2972 Westheimer Rd. Santa Ana, NY',
    status: 20,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Apartment',
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
        count: 2,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 1,
      },
    ],
  },
  {
    id: 4,
    investmentStatus: 'New',
    project_name: 'Orbitz Corporate - Kalpataru Splend',
    address: 'Shankar Kalat Nagar, Maharashtra 411057',
    status: 40,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Farm House',
    },
    spaces: [
      {
        id: 1,
        name: 'Bedroom',
        count: 3,
      },
      {
        id: 2,
        name: 'Bathroom',
        count: 3,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 2,
      },
    ],
  },
  {
    id: 5,
    investmentStatus: 'Sale',
    project_name: 'Eaton Garth Manor',
    address: '2972 Westheimer Rd. Santa Ana, NY',
    status: 20,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Apartment',
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
        count: 2,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 1,
      },
    ],
  },
  {
    id: 6,
    investmentStatus: 'Ready',
    project_name: 'Eaton Garth Manor',
    address: '2972 Westheimer Rd. Santa Ana, NY',
    status: 20,
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    asset_type: {
      id: 2,
      name: 'Apartment',
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
        count: 2,
      },
      {
        id: 2,
        name: 'Balcony',
        count: 1,
      },
    ],
  },
];
