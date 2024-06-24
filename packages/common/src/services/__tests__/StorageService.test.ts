// @ts-nocheck
/* eslint-disable import/no-unresolved */
import { StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { Storage, CryptoJS } from '@homzhub/common/src/services/storage/index';

jest.mock('@homzhub/common/src/services/storage/index', () => {
  return {
    Storage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    CryptoJS: {
      AES: {
        encrypt: jest.fn().mockImplementation((data, secret) => data),
        decrypt: jest.fn().mockImplementation((data, secret) => data),
      },
      enc: {
        utf8: 'mockUtf',
      },
    },
  };
});

describe('Storage Service', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Should set data to storage', async () => {
    await StorageService.set('TestKey', { key: 'test' });
    expect(CryptoJS.AES.encrypt).toHaveBeenCalled();
    expect(Storage.setItem).toHaveBeenCalledWith('TestKey', JSON.stringify({ key: 'test' }));
  });

  it('Should get data from storage and return null if it does not exist', async () => {
    Storage.getItem.mockImplementation(() => undefined);
    const data = await StorageService.get('TestKey');
    expect(Storage.getItem).toHaveBeenCalledWith('TestKey');
    expect(data).toStrictEqual(null);
  });

  it('Should get data from storage', async () => {
    const testData = JSON.stringify({ key: 'TestData' });
    Storage.getItem.mockImplementation(() => testData);
    const data = await StorageService.get('TestKey');
    expect(Storage.getItem).toHaveBeenCalledWith('TestKey');
    expect(CryptoJS.AES.decrypt).toHaveBeenCalled();
    expect(data).toStrictEqual(JSON.parse(testData));
  });

  it('Should clear data from storage', async () => {
    await StorageService.reset();
    expect(Storage.clear).toHaveBeenCalled();
  });

  it('Should set data to storage', async () => {
    await StorageService.remove('TestKey');
    expect(Storage.removeItem).toHaveBeenCalledWith('TestKey');
  });
});
