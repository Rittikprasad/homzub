import React from 'react';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

// ENUM START

export enum TicketStatusTitle {
  OPEN = 'Open',
  REQUEST_RAISED = 'Request Raised',
  QUOTE_REQUESTED = 'Quote Requested',
  QUOTE_SUBMITTED = 'Quote Submitted',
  QUOTE_APPROVED = 'Quote Approved',
  WORK_INITIATED = 'Work Initiated',
  PAYMENT_REQUESTED = 'Payment Requested',
  PAYMENT_DONE = 'Payment Done',
  WORK_COMPLETED = 'Work Completed',
  CLOSED = 'Closed',
}

export enum TicketActions {
  APPROVE_QUOTE = 'APPROVE_QUOTE',
  REASSIGN_TICKET = 'REASSIGN_TICKET',
  REQUEST_QUOTE = 'REQUEST_QUOTE',
  SUBMIT_QUOTE = 'SUBMIT_QUOTE',
  INITIATE_WORK = 'INITIATE_WORK',
  WORK_COMPLETED = 'WORK_COMPLETED',
  SEND_UPDATES = 'SEND_UPDATES',
  QUOTE_PAYMENT = 'QUOTE_PAYMENT',
  CLOSE_TICKET = 'CLOSE_TICKET',
  REQUEST_MORE_QUOTES = 'REQUEST_MORE_QUOTES',
  PAY_LATER = 'PAY_LATER',
  REJECT_TICKET = 'REJECT_TICKET',
}

// ENUM END

export interface ICollapseSection {
  children: React.ReactElement;
  title: string;
}

export const TOTAL_IMAGES = 10;

export const priorityColors = {
  LOW: theme.colors.lowPriority,
  MEDIUM: theme.colors.mediumPriority,
  HIGH: theme.colors.highPriority,
  ALL: theme.colors.informational,
};

export interface IQuoteGroup {
  groupId: number;
  groupName: string;
  data: IInitialQuote[];
}

export interface IInitialQuote {
  quoteNumber: number;
  title: string;
  price: string;
  document: IDocumentSource | File | null;
}

export const FFMTicketAction = [
  {
    title: 'Accept',
    icon: icons.circularCheckFilled,
    color: theme.colors.green,
  },
  {
    title: 'Reject',
    icon: icons.circularCrossFilled,
    color: theme.colors.red,
  },
];
