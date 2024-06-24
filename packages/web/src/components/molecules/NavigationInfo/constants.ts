type tpageTitles = {
  [key: string]: string;
};
export const pageTitles: tpageTitles = {
  selectProperty: 'Market Place',
  selectServices: 'Market Place',
  propertyView: 'Property View',
  searchProperty: 'Search Property',
  propertyVisits: 'Property Visits',
  savedProperties: 'Saved Properties',
  addProperty: 'Add Property',
  nextActions: 'Next Actions',
  serviceRequests: 'Service Requests',
  serviceRequestDetails: 'Service Request Details',
};

export const routesConfig = [
  {
    path: '/home/marketPlace/selectServices',
    breadcrumb: 'Select Services',
  },
  {
    path: '/home/marketPlace',
    breadcrumb: 'Market Place',
  },
  {
    path: '/home/marketPlace/selectProperty',
    breadcrumb: 'Select Property',
  },
  {
    path: '/home/propertyView',
    breadcrumb: 'Property View',
  },
  {
    path: '/home/portfolio/propertySelected',
    breadcrumb: 'Property Selected',
  },
  {
    path: '/home/searchProperty',
    breadcrumb: 'Search Property',
  },
  {
    path: '/home/propertyDetail',
    breadcrumb: 'Property Detail',
  },
  {
    path: '/home/propertyVisits',
    breadcrumb: 'Property Visits',
  },
  {
    path: '/home/savedProperties',
    breadcrumb: 'Saved Properties',
  },
  {
    path: '/home/addProperty',
    breadcrumb: 'Add Property',
  },
  {
    path: '/home/nextActions',
    breadcrumb: 'Next Actions',
  },
  {
    path: '/home/serviceRequests',
    breadcrumb: 'Service Requests',
  },
  {
    path: '/home/serviceRequests/serviceRequestDetails',
    breadcrumb: 'Service Request Details',
  },
];
