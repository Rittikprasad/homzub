export const FinancialTransaction = {
  count: 10,
  links: {
    next: null,
    previous: null,
  },
  results: [
    {
      id: 1,
      entry_type: 'CREDIT',
      category: { id: 1, name: 'Maintanence' },
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      amount: 27000,
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'akn',
      },
      attachments: [],
    },
    {
      id: 2,
      entry_type: 'DEBIT',
      category: { id: 1, name: 'Rental Income' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
    {
      id: 3,
      entry_type: 'CREDIT',
      category: { id: 1, name: 'Utility bills' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
    {
      id: 4,
      entry_type: 'DEBIT',
      category: { id: 1, name: 'Utility bills' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
    {
      id: 5,
      entry_type: 'CREDIT',
      category: { id: 1, name: 'Utility bills' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
    {
      id: 6,
      entry_type: 'DEBIT',
      category: { id: 1, name: 'Utility bills' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
    {
      id: 7,
      entry_type: 'CREDIT',
      category: { id: 1, name: 'Utility bills' },
      amount: 27000,
      currency: {
        currency_name: 'AUD',
        currency_code: 'AUD',
        currency_symbol: '$',
      },
      transaction_date: '2020-06-20',
      label: 'Rent',
      notes: 'Jahn Doe',
      payer_name: 'Foobar',
      receiver_name: 'JohnDoe',
      asset: {
        id: 1,
        project_name: 'Godrej Prime',
      },
      attachments: [
        {
          id: 1,
          file_name: 'Foobar.jpg',
        },
      ],
    },
  ],
};
