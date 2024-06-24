export const CaseLog = [
  {
    id: 2,
    ticket_number: 'HOM-1435',
    title: 'My property images are not reflecting on the frontend.',
    status: 'RESOLVED',
    raised_at: '2021-01-27T14:28:00.140055+05:30Z',
    support_category: {
      id: 41,
      order: 1,
      label: 'Leasing',
      code: 'BUG_REPORT|FEATURE_REQUEST',
    },
    attachments: [
      {
        id: '1',
        file_name: 'Original name of the attachment',
        media_type: 'IMAGE',
        link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
        media_attributes: {},
      },
    ],
  },
  {
    id: 2,
    ticket_number: 'HOM-1433',
    title: 'My property details are not reflecting on the frontend.',
    description: 'Ut enim sagittis dui lacus, in felis convallis pulvinar. Posuere integer eu sit mauris vitae in.',
    status: 'RESOLVED',
    raised_at: '2021-01-27T14:28:00.140055+05:30Z',
    support_category: {
      id: 41,
      order: 1,
      label: 'Bug report',
      code: 'BUG_REPORT|FEATURE_REQUEST',
    },
    attachments: [
      {
        id: '1',
        file_name: 'Original name of the attachment',
        media_type: 'IMAGE',
        link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
        media_attributes: {},
      },
      {
        id: '2',
        file_name: 'Document Name.pdf',
        media_type: 'DOCUMENT',
        link: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
        media_attributes: {},
      },
    ],
  },
];
