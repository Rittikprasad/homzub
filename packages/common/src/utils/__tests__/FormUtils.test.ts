import { FormUtils } from '../FormUtils';

const mockFn = jest.fn();
const ValidationError = {
  inner: [
    {
      name: 'ValidationError',
      value: '',
      path: 'email',
      type: 'required',
      inner: [],
      message: 'Please enter your email',
      params: {
        path: 'email',
        value: '',
        originalValue: '',
      },
    },
    {
      name: 'ValidationError',
      value: '',
      path: 'phone',
      type: 'required',
      errors: ['Please enter your mobile number'],
      inner: [],
      message: 'Please enter your mobile number',
      params: {
        path: 'phone',
        value: '',
        originalValue: '',
      },
    },
    {
      name: 'ValidationError',
      value: '',
      path: 'password',
      type: 'matches',
      errors: ['Should contain a upper-case, lower-case alphabet and a number'],
      inner: [],
      message: 'Should contain a upper-case, lower-case alphabet and a number',
      params: {
        path: 'password',
        value: '',
        originalValue: '',
        regex: {},
      },
    },
    {
      name: 'ValidationError',
      value: '',
      path: 'password',
      type: 'min',
      errors: ['Minimum 8 characters allowed'],
      inner: [],
      message: 'Minimum 8 characters allowed',
      params: {
        path: 'password',
        value: '',
        originalValue: '',
        min: 8,
      },
    },
    {
      name: 'ValidationError',
      value: '',
      path: 'password',
      type: 'required',
      errors: ['Please enter your password'],
      inner: [],
      message: 'Please enter your password',
      params: {
        path: 'password',
        value: '',
        originalValue: '',
      },
    },
  ],
};

describe('FormUtils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run form validate for the happy path', () => {
    const getValidationSchema = jest.fn().mockImplementation(() => ({
      validateSync: mockFn,
    }));
    const response = FormUtils.validate(getValidationSchema);
    response();
    expect(mockFn).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it('should run form validate for the error path', () => {
    jest.spyOn(FormUtils, 'getErrorsFromValidationError').mockImplementation(() => true);
    const getValidationSchema = jest.fn().mockImplementation(() => ({
      validateSync: (): void => {
        throw new Error('Test Error');
      },
    }));
    const response = FormUtils.validate(getValidationSchema)();
    expect(response).toBeTruthy();
  });

  it('should run custom error extraction', () => {
    const response = FormUtils.getErrorsFromValidationError(ValidationError);
    expect(response).toStrictEqual({
      email: '',
      phone: 'Please enter your mobile number',
      password: 'Please enter your password',
    });
  });
});
