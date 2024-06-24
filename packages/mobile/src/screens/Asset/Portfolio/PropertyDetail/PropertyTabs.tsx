import React from 'react';
import { SvgProps } from 'react-native-svg';

// SVG imports START
import Notification from '@homzhub/common/src/assets/images/notification.svg';
import ServiceRequest from '@homzhub/common/src/assets/images/serviceRequest.svg';
import Calendar from '@homzhub/common/src/assets/images/calendar.svg';
import Chat from '@homzhub/common/src/assets/images/chat.svg';
import Document from '@homzhub/common/src/assets/images/document.svg';
import Finance from '@homzhub/common/src/assets/images/finance.svg';
import History from '@homzhub/common/src/assets/images/history.svg';
import Offer from '@homzhub/common/src/assets/images/offer.svg';
import Rating from '@homzhub/common/src/assets/images/rating.svg';
import Storage from '@homzhub/common/src/assets/images/storage.svg';

// SVG Imports END

const TabHOC = (Tab: React.FC<SvgProps>, size = 34): React.ReactElement => <Tab width={size} height={size} />;

export const PropertyTabs = {
  Alert: TabHOC(Notification),
  Requests: TabHOC(ServiceRequest),
  Chat: TabHOC(Chat),
  Reviews: TabHOC(Rating),
  Financials: TabHOC(Finance),
  Documents: TabHOC(Storage),
  Details: TabHOC(Document),
  Offers: TabHOC(Offer, 26),
  'Property Visits': TabHOC(Calendar, 26),
  'Tenant History': TabHOC(History),
};
