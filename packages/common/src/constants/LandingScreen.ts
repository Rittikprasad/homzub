export interface IFeatureDataProps {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const TestimonialData = [
  {
    name: 'Milind',
    designation: 'Kuwait',
    review: 'Excellent real estate services',
    description:
      'I very much appreciate the excellent real estate services offered by Homzhub. You have talented professionals in your team. We are happy that in Nagpur we have a professionally managed company which takes care of all the activities related to property matters and manages everything under one roof.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Milind.jpg'),
  },
  {
    name: 'Mandar',
    designation: 'Mumbai',
    review: 'Personal touch shown by Homzhub',
    description:
      'I am extremely happy and satisfied with the quality of service and professional conduct along with Personal Touch shown by the Homzhub representatives and Team. The fact that they take complete responsibility for all and any issue that arises in the property, makes my task of trusting them easier.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Mandar.jpg'),
  },
  {
    name: 'Nirav',
    designation: 'Nagpur',
    review: 'Professional team to assist you',
    description:
      'Anyone who has searched for a house for rent knows how nerve-racking the process can be. It really helps to have a professional team to assist you in this. I highly recommend Homzhub.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Nirav.jpeg'),
  },
];

export const HeroSectionData: IFeatureDataProps[] = [
  {
    id: 0,
    title: 'One app for all your real estate needs!',
    description: 'Helping homeowners, tenants and buyers have peace of mind',
    image: require('@homzhub/common/src/assets/images/landingBackground1.jpg'),
  },
  {
    id: 1,
    title: 'Be in total control!',
    description: 'Arrange site visits, negotiations and tenant verifications with ease',
    image: require('@homzhub/common/src/assets/images/landingBackground2.jpg'),
  },
  {
    id: 2,
    title: 'Your house. Your rules!',
    description: 'Get the desired rent and tenant on our platform',
    image: require('@homzhub/common/src/assets/images/landingBackground3.jpg'),
  },
  {
    id: 3,
    title: 'Prime Locations for your primary needs',
    description: 'Rent directly from owners at the best locations',
    image: require('@homzhub/common/src/assets/images/landingBackground4.jpg'),
  },
];

export const OwnerFeatureData: IFeatureDataProps[] = [
  {
    id: 0,
    title: 'Your property is in your hands',
    description: 'Manage your properties remotely from anywhere, anytime',
    image: require('@homzhub/common/src/assets/images/yourPropertyIsInYourHands.svg'),
  },
  {
    id: 1,
    title: 'It’s all here',
    description: 'Arrange site visits, tenant verification and legal formalities',
    image: require('@homzhub/common/src/assets/images/itsAllHere.svg'),
  },
  {
    id: 2,
    title: 'With you all the way',
    description: 'From on-boarding your tenant to helping you re-rent your property',
    image: require('@homzhub/common/src/assets/images/withYouAllTheWay.svg'),
  },
  {
    id: 3,
    title: 'Get started for free',
    description: 'Get ready to rent or sell in a few clicks. Signup and get started',
    image: require('@homzhub/common/src/assets/images/getStartedForFree.svg'),
  },
];

export const TenantFeatureData: IFeatureDataProps[] = [
  {
    id: 0,
    title: 'Your key to your home',
    description: 'Locate, rent and manage your home and everything that comes with it',
    image: require('@homzhub/common/src/assets/images/yourKeyToYourHome.svg'),
  },
  {
    id: 1,
    title: 'Stay in control',
    description: 'Save rent receipts, raise concerns and track your rental journey in one app',
    image: require('@homzhub/common/src/assets/images/stayInControl.svg'),
  },
  {
    id: 2,
    title: 'Finely curated listings for you',
    description: 'Rent verified properties directly from owners',
    image: require('@homzhub/common/src/assets/images/finallyCuratedListings.svg'),
  },
  {
    id: 3,
    title: 'Nothing in the middle',
    description: 'Back up your rental journey - from your old property to new',
    image: require('@homzhub/common/src/assets/images/nothingInMiddle.svg'),
  },
];
