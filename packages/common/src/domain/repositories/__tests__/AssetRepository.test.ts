import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { assetGroups, leaseTermDetail, saleTerm } from '@homzhub/common/src/mocks/PropertyDetails';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';
import { FurnishingTypes, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('AssetRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a asset data', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(assetGroups));
    const response = await AssetRepository.getAssetGroups();
    expect(response).toMatchSnapshot();
  });

  it('should add a new asset in DB and return the corresponding property ID', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({ id: 5 }));
    const response = await AssetRepository.createAsset({
      project_name: 'My House',
      unit_number: '6',
      block_number: 'C1',
      latitude: '1',
      longitude: '1',
      address: 'address',
      pin_code: '123456',
      city: 'city',
      state: 'state',
      country: 'country',
      asset_type: 1,
      country_iso2_code: 'IN',
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update an existing asset in DB', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'patch').mockImplementation(() => Promise.resolve(true));
    const response = await AssetRepository.updateAsset(7, {
      total_floors: 5,
      asset_type: 5,
    });
    expect(response).toBeTruthy();
  });

  [
    { apiName: 'updateAsset', method: 'get' },
    { apiName: 'createAsset', method: 'get' },
    { apiName: 'getRentServices', method: 'get' },
    { apiName: 'getDetails', method: 'get' },
  ].forEach((api: { method: string; apiName: string }) => {
    it(`should throw an error in case of ${api.apiName} API failure`, async () => {
      // @ts-ignore
      jest.spyOn(BootstrapAppService.clientInstance, `${api.method}`).mockImplementation(() => {
        throw new Error('Test Error');
      });
      try {
        // @ts-ignore
        await AssetRepository[api.apiName]();
      }catch (e: any) {        expect(e).toBeTruthy();
      }
    });
  });

  it('should fetch a asset detail', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(mockAsset));
    const response = await AssetRepository.getAssetById(1);
    expect(response).toMatchSnapshot();
  });

  it('should fetch a lease term', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(leaseTermDetail));
    const response = await AssetRepository.getLeaseTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create lease term in DB and return the corresponding property ID', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({ id: 5 }));
    const response = await AssetRepository.createLeaseTerms(1, {
      currency_code: '+91',
      expected_monthly_rent: 1200,
      security_deposit: 15000,
      annual_rent_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing: FurnishingTypes.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update lease term in DB and return the corresponding property ID', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => Promise.resolve({ id: 5 }));
    const response = await AssetRepository.updateLeaseTerms(1, 1, {
      currency_code: '+91',
      expected_monthly_rent: 1200,
      security_deposit: 15000,
      annual_rent_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing: FurnishingTypes.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should fetch a sale term', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(saleTerm));
    const response = await AssetRepository.getSaleTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create sale term in DB and return the corresponding property ID', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => Promise.resolve({ id: 5 }));
    const response = await AssetRepository.createSaleTerm(1, {
      expected_price: 1200,
      expected_booking_amount: 500,
      available_from_date: '2020-09-12',
      maintenance_amount: 200,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update sale term in DB and return the corresponding property ID', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => Promise.resolve({ id: 5 }));
    const response = await AssetRepository.updateSaleTerm(1, 1, {
      expected_price: 12000,
      expected_booking_amount: 5000,
      available_from_date: '2020-10-12',
      maintenance_amount: 2000,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('Should delete verification document', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'delete').mockImplementation(() => Promise.resolve({}));
    const response = await AssetRepository.deleteVerificationDocument(1, 1);
    expect(response).toMatchSnapshot();
  });

  it.skip('Should get property images by property id', async () => {
    const data = ObjectMapper.deserializeArray(AssetGallery, [
      {
        id: 1,
        description: 'image.png',
        is_cover_image: true,
        file_name: 'filename',
        asset: 10,
        attachment: 14,
        link: 'www.google.com',
      },
    ]);
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(data));
    const response = await AssetRepository.getPropertyImagesByPropertyId(1);
    expect(response).toStrictEqual(data);
  });

  it('Should mark attachment as cover image', async () => {
    const data = {
      cover_updated: true,
    };
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => Promise.resolve(data));
    const response = await AssetRepository.markAttachmentAsCoverImage(1, 10);
    expect(response).toMatchSnapshot();
  });

  it('Should post attachment for property', async () => {
    const requestPayload = [
      {
        attachment: 1,
        is_cover_image: true,
      },
    ];
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({}));
    const response = await AssetRepository.postAttachmentsForProperty(1, requestPayload);
    expect(response).toMatchSnapshot();
  });

  it('Should post verification document', async () => {
    const requestPayload = [
      {
        verification_document_type_id: 1,
        document_id: 1,
      },
    ];
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => Promise.resolve({}));
    const response = await AssetRepository.postVerificationDocuments(1, requestPayload);
    expect(response).toMatchSnapshot();
  });

  it('Should delete property image', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'delete').mockImplementation(() => Promise.resolve({}));
    const response = await AssetRepository.deletePropertyImage(1);
    expect(response).toMatchSnapshot();
  });

  it('Should get ratings', async () => {
    const data = [
      {
        id: 1,
        rating: 2,
        experience_area: 'experience area',
      },
    ];
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(data));
    const response = await AssetRepository.getRatings(1);
    expect(response).toMatchSnapshot();
  });

  it('Should get lease listings', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(mockAsset));
    const response = await AssetRepository.getLeaseListing(1);
    expect(response).toMatchSnapshot();
  });

  it('Should get sale listings', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(mockAsset));
    const response = await AssetRepository.getSaleListing(1);
    expect(response).toMatchSnapshot();
  });

  it('Should get similar properties for rent', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve([mockAsset]));
    const response = await AssetRepository.getSimilarProperties(1, 0);
    expect(response).toMatchSnapshot();
  });

  it('Should get similar properties for sale', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve([mockAsset]));
    const response = await AssetRepository.getSimilarProperties(1, 1);
    expect(response).toMatchSnapshot();
  });
});
