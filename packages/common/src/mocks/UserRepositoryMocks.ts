import { LoginTypes } from '../domain/repositories/interfaces';

export const loginData = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  user: {
    full_name: 'Rishabh Modi',
    email: 'r@gmail.com',
    country_code: 'IN',
    phone_number: '99999999',
  },
};

export const socialLogin = {
  is_new_user: false,
  ...loginData,
};

export const socialLoginNoUser = {
  is_new_user: false,
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  user: null,
};

export const otpSent = {
  otp_sent: true,
};

export const otpVerify = {
  otp_verify: true,
};

export const emailExists = {
  is_exists: true,
};

export const userData = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  full_name: 'Rishabh Modi',
  email: 'r@gmail.com',
  country_code: 'IN',
  phone_number: '99999999',
};

export const loginPayload = {
  action: LoginTypes.EMAIL,
  payload: {
    email: 'test@yopmail.com',
    password: 'Test@123',
  },
};

export const loginWithCallback = {
  data: loginPayload,
};

export const userLogout = {
  callback: (status: boolean): void => {},
};

export const mockUsers = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@mail.com',
    phone_code: '+91',
    phone_number: '9597773556',
    profile_picture:
      'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
    rating: 3,
    is_asset_owner: true,
  },
  {
    id: 2,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@mail.com',
    phone_code: '+91',
    phone_number: '9597773556',
    profile_picture: null,
    rating: 3,
    is_asset_owner: false,
  },
  {
    id: 3,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@mail.com',
    phone_code: '+91',
    phone_number: '9597773556',
    profile_picture:
      'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
    rating: 3,
    is_asset_owner: true,
  },
  {
    id: 4,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@mail.com',
    phone_code: '+91',
    phone_number: '9597773556',
    profile_picture: null,
    rating: 3,
    is_asset_owner: true,
  },
];
