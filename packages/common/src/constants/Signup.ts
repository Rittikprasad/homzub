export interface IImageDataProps {
  id: number;
  image: string;
}

export const ImageData: IImageDataProps[] = [
  {
    id: 1,
    image: require('@homzhub/common/src/assets/images/signUp1.svg'),
  },
  {
    id: 2,
    image: require('@homzhub/common/src/assets/images/signUp2.svg'),
  },
  {
    id: 3,
    image: require('@homzhub/common/src/assets/images/signUp3.svg'),
  },
];

export enum Role {
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  PROPERTY_AGENT = 'PROPERTY_AGENT',
}
