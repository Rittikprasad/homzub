export const sampleData = {
  job_type: {
    id: 1,
    order: 1,
    label: 'Salaried Employee',
    name: 'Salaried Employee',
    code: 'SALARIED_EMPLOYEE',
  },
  company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
  work_email: 'abhijeet.shah@nineleaps.com',
  number_of_occupants: 5,
  tenant_type: {
    id: 2,
    order: 2,
    label: 'Bachelor',
    code: 'BACHELOR',
  },
  userName: 'Jaya Naveen sai',
  designation: 'naveen.sai@nineleaps.com',
  description: 'Nibh nunc massa mauris velit vitae cursus sagittis. Ornare ut porta velit lorem metus ut.',
};

export const acceptOffer = {
  owner: [
    { text: '1. Your property will no longer appear in search results' },
    { text: '2. All the active offers will be automatically rejected.' },
    { text: '3. Your last name, phone number, email will be visible to the prospect should you accept this offer.' },
    {
      text: '4. Homzhub is not legally liable for the actions of its user. Please do your own due diligence before transferring any amount',
    },
  ],
  tenant: [
    {
      text: '1. Your last name, phone number, and email will be visible to the property owner should you accept this offer.',
    },
    { text: '2. The property owner will create a lease to connect you with the property' },
    { text: '3. Once the lease is created, you can chat with the owner via the messages feature in the app. ' },
    {
      text: '4. Homzhub is not legally liable for the actions of its user. Please do your own due diligence before transferring money.',
    },
  ],
};
