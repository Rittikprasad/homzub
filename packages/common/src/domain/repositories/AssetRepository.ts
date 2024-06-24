import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetGroup, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { AssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { DownloadAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetReviewComment } from '@homzhub/common/src/domain/models/AssetReviewComment';
import { Count } from '@homzhub/common/src/domain/models/Count';
import { ILeaseTermination, ILeaseTermParams, LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { IManageTerm } from '@homzhub/common/src/domain/models/ManageTerm';
import { OnGoingTransaction } from '@homzhub/common/src/domain/models/OnGoingTransaction';
import { ReportReview } from '@homzhub/common/src/domain/models/ReportReview';
import { ICreateSaleTermParams, IUpdateSaleTermParams, SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { UpcomingSlot } from '@homzhub/common/src/domain/models/UpcomingSlot';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { User } from '@homzhub/common/src/domain/models/User';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import {
  ExistingVerificationDocuments,
  IPostVerificationDocuments,
  IYoutubeResponse,
  VerificationDocumentTypes,
} from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IAcceptInvitePayload,
  ICreateAssetParams,
  ICreateAssetResult,
  ICreateDocumentPayload,
  IScheduleVisitPayload,
  IUpcomingVisitPayload,
  IPropertyImagesPostPayload,
  IMarkCoverImageAttachment,
  IUpdateAssetParams,
  IAssetVisitPayload,
  IUpdateVisitPayload,
  IRescheduleVisitPayload,
  ISendNotificationPayload,
  IClosureReasonPayload,
  ICancelListingPayload,
  ICancelListingParam,
  ITerminateListingPayload,
  IListingReviewParams,
  IGetListingReviews,
  IAddReviewComment,
  IReportReview,
  IUpdateTenantParam,
  IUserDetails,
  IUpdateLeaseTerm,
  IUnitListingPayload,
  IAssetUserPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IUpdateDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';

// TODO: Split these across multiple repos
const ENDPOINTS = {
  asset: (): string => 'v1/assets/',
  updateAsset: (id: number): string => `v1/assets/${id}/`,
  getReviewsById: (reviewId: number): string => `v1/listing-reviews/${reviewId}/`,
  getAssetById: (propertyId: number): string => `v1/assets/${propertyId}/`,
  leaseTerms: (propertyId: number): string => `v1/assets/${propertyId}/lease-listings/`,
  updateLeaseTerms: (propertyId: number, leaseTermId: number): string =>
    `v1/assets/${propertyId}/lease-listings/${leaseTermId}/`,
  saleTerms: (propertyId: number): string => `v1/assets/${propertyId}/sale-listings/`,
  updateSaleTerms: (propertyId: number, saleTermId: number): string =>
    `v1/assets/${propertyId}/sale-listings/${saleTermId}/`,
  manageTerm: (assetId: number): string => `v1/assets/${assetId}/manage-lease-listing/`,
  updateManageTerm: (assetId: number, leaseUnitId: number): string =>
    `v1/assets/${assetId}/revise-manage-lease-listing/${leaseUnitId}/`,
  existingVerificationDocuments: (propertyId: number): string => `v1/assets/${propertyId}/verification-documents/`,
  deleteExistingVerificationDocuments: (propertyId: number, documentId: number): string =>
    `v1/assets/${propertyId}/verification-documents/${documentId}/`,
  assetAttachments: (propertyId: number): string => `v1/assets/${propertyId}/attachments/`,
  postVerificationDocuments: (propertyId: number): string => `v1/assets/${propertyId}/verification-documents/`,
  markAttachmentAsCoverImage: (propertyId: number, attachmentId: number): string =>
    `v1/assets/${propertyId}/attachments/${attachmentId}/cover-image`,
  getAssetGroups: (): string => 'v1/asset-groups/',
  deletePropertyAttachment: (attachmentId: number): string => `v1/attachments/${attachmentId}`,
  assetIdentityDocuments: (): string => 'v1/asset-identity-documents/',
  getVerificationDocumentDetails: (): string => 'v1/verification-document-types/',
  getLeaseListing: (propertyTermId: number): string => `v1/lease-listings/${propertyTermId}`,
  getSaleListing: (propertyTermId: number): string => `v1/sale-listings/${propertyTermId}`,
  getSimilarPropertiesForLease: (propertyTermId: number): string =>
    `v1/lease-listings/${propertyTermId}/similar-properties/`,
  getSimilarPropertiesForSale: (propertyTermId: number): string =>
    `v1/sale-listings/${propertyTermId}/similar-properties/`,
  assetDocument: (propertyId: number): string => `v1/assets/${propertyId}/asset-documents/`,
  handleAssetDocument: (propertyId: number, documentId: number): string =>
    `v1/assets/${propertyId}/asset-documents/${documentId}/`,
  downloadAttachment: (): string => 'v1/attachments/download/',
  getVisitLead: (): string => 'v1/list-of-values/site-visit-lead-types/',
  getUpcomingVisits: (): string => 'v1/listing-visits/upcoming-visits/',
  assetVisit: (): string => 'v1/listing-visits/',
  allVisitAsset: (): string => 'v1/listing-visits/assets/',
  rescheduleVisit: (): string => 'v1/listing-visits/reschedule/',
  visitUpdate: (id: number): string => `v1/listing-visits/${id}/`,
  attachmentUpload: (): string => 'v1/attachments/upload/',
  assetDescriptionDropdownValues: (): string => 'v1/assets/list-of-values/',
  availableSpaces: (id: number): string => `v1/assets/${id}/available-spaces/`,
  assetCount: (): string => 'v1/assets/count/',
  sendNotification: (): string => 'v1/assets/notifications/listing-reviews/',
  valueServicesAssetList: (): string => 'v2/assets/?extra=asset_status_info',
  cancelListing: (param: ICancelListingParam): string =>
    `v1/assets/${param.assetId}/${param.listingType}/${param.listingId}/cancel/`,
  terminateTransaction: (id: number): string => `v1/lease-transactions/${id}/terminate/`,
  closureReason: 'v1/closure-reasons/',
  reviewReportCategories: 'v1/list-of-values/review-report-categories/',
  listingReviews: 'v1/listing-reviews/',
  addReviewComment: (reviewId: number): string => `v1/listing-reviews/${reviewId}/comments/`,
  reportReview: (reviewId: number): string => `v1/listing-reviews/${reviewId}/reports/`,
  reportReviewData: (reviewId: number, reportId: number): string =>
    `v1/listing-reviews/${reviewId}/reports/${reportId}`,
  editReviewComment: (reviewId: number, commentId: number): string =>
    `v1/listing-reviews/${reviewId}/comments/${commentId}/`,
  listingReviewsSummary: 'v1/listing-reviews/summary/',
  updateTenant: (param: IUpdateTenantParam): string =>
    `v1/assets/${param.assetId}/lease-transactions/${param.leaseTransactionId}/lease-tenants/${param.leaseTenantId}/`,
  acceptInvite: (): string => 'v1/lease-tenants/accept-invite',
  leaseTransaction: (id: number): string => `v1/lease-transactions/${id}/`,
  activeAssets: 'v1/active-assets/',
  createUnitListing: (propertyId: number, unitId: number): string =>
    `v1/assets/${propertyId}/lease-units/${unitId}/lease-listings/`,
  assetAttachmentById: (propertyId: number, attachmentId: number): string =>
    `v1/assets/${propertyId}/attachments/${attachmentId}`,
  inviteTenant: (id: number): string => `v1/lease-tenants/${id}/invites/`,
  leaseUnits: (id: number): string => `v1/assets/${id}/lease-units/`,
  assetUser: (id: number): string => `v1/assets/${id}/users/`,
};

class AssetRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetById = async (propertyId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetById(propertyId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getRequiredAssetFieldsById = async (propertyId: number, requiredFields: string[]): Promise<Asset> => {
    const queryParams = requiredFields.toString();
    const response = await this.apiClient.get(ENDPOINTS.getAssetById(propertyId), { fields: queryParams });
    return ObjectMapper.deserialize(Asset, response, true);
  };

  public getAssetGroups = async (): Promise<AssetGroup[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetGroups());
    return ObjectMapper.deserializeArray(AssetGroup, response);
  };

  public createAsset = async (assetDetails: ICreateAssetParams): Promise<ICreateAssetResult> => {
    return await this.apiClient.post(ENDPOINTS.asset(), assetDetails);
  };

  public updateAsset = async (id: number, requestBody: IUpdateAssetParams): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.updateAsset(id), requestBody);
  };

  public deleteAsset = async (id: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.updateAsset(id));
  };

  public getReview = async (reviewId: number): Promise<AssetReview> => {
    const response = await this.apiClient.get(ENDPOINTS.getReviewsById(reviewId));
    return ObjectMapper.deserialize(AssetReview, response);
  };

  public getLeaseTerms = async (propertyId: number): Promise<LeaseTerm[]> => {
    const response = await this.apiClient.get(ENDPOINTS.leaseTerms(propertyId));
    return ObjectMapper.deserializeArray(LeaseTerm, response);
  };

  public createLeaseTerms = async (propertyId: number, leaseTerms: ILeaseTermParams[]): Promise<{ ids: number[] }> => {
    return await this.apiClient.post(ENDPOINTS.leaseTerms(propertyId), leaseTerms);
  };

  public updateLeaseTerms = async (
    propertyId: number,
    leaseTermId: number,
    leaseTerms: ILeaseTermParams
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateLeaseTerms(propertyId, leaseTermId), leaseTerms);
  };

  public deleteLeaseTerm = async (assetId: number, leaseUnitId: number): Promise<void> => {
    await this.apiClient.delete(ENDPOINTS.updateLeaseTerms(assetId, leaseUnitId));
  };

  public getSaleTerms = async (propertyId: number): Promise<SaleTerm[]> => {
    const response = await this.apiClient.get(ENDPOINTS.saleTerms(propertyId));
    return ObjectMapper.deserializeArray(SaleTerm, response);
  };

  public createSaleTerm = async (propertyId: number, saleTerms: ICreateSaleTermParams): Promise<{ id: number }> => {
    return await this.apiClient.post(ENDPOINTS.saleTerms(propertyId), saleTerms);
  };

  public updateSaleTerm = async (
    propertyId: number,
    saleTermId: number,
    saleTerms: IUpdateSaleTermParams
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateSaleTerms(propertyId, saleTermId), saleTerms);
  };

  public getExistingVerificationDocuments = async (propertyId: number): Promise<ExistingVerificationDocuments[]> => {
    const response = await this.apiClient.get(ENDPOINTS.existingVerificationDocuments(propertyId));
    return ObjectMapper.deserializeArray(ExistingVerificationDocuments, response);
  };

  public deleteVerificationDocument = async (propertyId: number, documentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.deleteExistingVerificationDocuments(propertyId, documentId));
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<AssetGallery[]> => {
    const response = await this.apiClient.get(ENDPOINTS.assetAttachments(propertyId));
    return ObjectMapper.deserializeArray(AssetGallery, response);
  };

  public markAttachmentAsCoverImage = async (
    propertyId: number,
    attachmentId: number
  ): Promise<IMarkCoverImageAttachment> => {
    return await this.apiClient.put(ENDPOINTS.markAttachmentAsCoverImage(propertyId, attachmentId));
  };

  public postAttachmentsForProperty = async (
    propertyId: number,
    requestBody: IPropertyImagesPostPayload[]
  ): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.assetAttachments(propertyId), requestBody);
  };

  public postVerificationDocuments = async (
    propertyId: number,
    requestBody: IPostVerificationDocuments[]
  ): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.postVerificationDocuments(propertyId), requestBody);
  };

  public deletePropertyImage = async (attachmentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.deletePropertyAttachment(attachmentId));
  };

  public getAssetIdentityDocuments = async (): Promise<ExistingVerificationDocuments[]> => {
    const response = await this.apiClient.get(ENDPOINTS.assetIdentityDocuments());
    return ObjectMapper.deserializeArray(ExistingVerificationDocuments, response);
  };

  public getVerificationDocumentTypes = async (): Promise<VerificationDocumentTypes[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getVerificationDocumentDetails());
    return ObjectMapper.deserializeArray(VerificationDocumentTypes, response);
  };

  public getLeaseListing = async (propertyTermId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getLeaseListing(propertyTermId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getSaleListing = async (propertyTermId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getSaleListing(propertyTermId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getSimilarProperties = async (propertyTermId: number, type: number): Promise<Asset[]> => {
    if (type === 0) {
      // RENT FLOW
      const response = await this.apiClient.get(ENDPOINTS.getSimilarPropertiesForLease(propertyTermId));
      return ObjectMapper.deserializeArray(Asset, response);
    }
    // SALE FLOW
    const response = await this.apiClient.get(ENDPOINTS.getSimilarPropertiesForSale(propertyTermId));
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getPropertiesByStatus = async (status?: string): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.asset(), { status });
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public createAssetDocument = async (payload: ICreateDocumentPayload): Promise<void> => {
    const { propertyId, documentData } = payload;
    await this.apiClient.post(ENDPOINTS.assetDocument(propertyId), documentData);
  };

  public getAssetDocument = async (propertyId: number): Promise<AssetDocument[]> => {
    const response = await this.apiClient.get(ENDPOINTS.assetDocument(propertyId));
    return ObjectMapper.deserializeArray(AssetDocument, response);
  };

  public renameAssetDocument = async (payload: IUpdateDocumentPayload): Promise<void> => {
    const { assetId, assetDocumentId, fileName } = payload;
    await this.apiClient.patch(ENDPOINTS.handleAssetDocument(assetId, assetDocumentId), { file_name: fileName });
  };

  public deleteAssetDocument = async (propertyId: number, documentId: number): Promise<void> => {
    await this.apiClient.delete(ENDPOINTS.handleAssetDocument(propertyId, documentId));
  };

  public downloadAttachment = async (refKey: string): Promise<DownloadAttachment> => {
    const response = await this.apiClient.get(ENDPOINTS.downloadAttachment(), { presigned_reference_key: refKey });
    return ObjectMapper.deserialize(DownloadAttachment, response);
  };

  public getVisitLeadType = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getVisitLead());
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getUpcomingVisits = async (payload?: IUpcomingVisitPayload): Promise<UpcomingSlot[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getUpcomingVisits(), payload);
    return ObjectMapper.deserializeArray(UpcomingSlot, response);
  };

  public propertyVisit = async (payload: IScheduleVisitPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.assetVisit(), payload);
  };

  public deleteReview = async (reviewId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.getReviewsById(reviewId));
  };

  public updateReview = async (reviewId: number, payload: IListingReviewParams): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.getReviewsById(reviewId), payload);
  };

  public postAttachmentUpload = async (payload: { link: string }[]): Promise<IYoutubeResponse[]> => {
    return await this.apiClient.post(ENDPOINTS.attachmentUpload(), payload);
  };

  public getAssetDescriptionDropdownValues = async (): Promise<AssetDescriptionDropdownValues> => {
    const response = await this.apiClient.get(ENDPOINTS.assetDescriptionDropdownValues());
    return ObjectMapper.deserialize(AssetDescriptionDropdownValues, response);
  };

  public getAssetAvailableSpaces = async (assetId: number): Promise<SpaceType[]> => {
    const response = await this.apiClient.get(ENDPOINTS.availableSpaces(assetId));
    return ObjectMapper.deserializeArray(SpaceType, response);
  };

  public createManageTerm = async (assetId: number, params: IManageTerm): Promise<number> => {
    const response = await this.apiClient.post(ENDPOINTS.manageTerm(assetId), params);
    return response.lease_unit_id;
  };

  public updateManageTerm = async (assetId: number, leaseUnitId: number, params: IManageTerm): Promise<void> => {
    await this.apiClient.put(ENDPOINTS.updateManageTerm(assetId, leaseUnitId), params);
  };

  public getPropertyVisit = async (payload: IAssetVisitPayload): Promise<AssetVisit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.assetVisit(), payload);
    return ObjectMapper.deserializeArray(AssetVisit, response);
  };

  public updatePropertyVisit = async (payload: IUpdateVisitPayload): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.visitUpdate(payload.id), payload.data);
  };

  public reschedulePropertyVisit = async (payload: IRescheduleVisitPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.rescheduleVisit(), payload);
  };

  public getAssetCount = async (): Promise<Count> => {
    const response = await this.apiClient.get(ENDPOINTS.assetCount());
    return ObjectMapper.deserialize(Count, response);
  };

  public sendNotification = async (payload: ISendNotificationPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.sendNotification(), payload);
  };

  public getAllVisitAsset = async (): Promise<VisitAssetDetail[]> => {
    const response = await this.apiClient.get(ENDPOINTS.allVisitAsset());
    return ObjectMapper.deserializeArray(VisitAssetDetail, response);
  };

  public getValueServicesAssetList = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.valueServicesAssetList());
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getClosureReason = async (payload: IClosureReasonPayload): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.closureReason, payload);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public cancelAssetListing = async (payload: ICancelListingPayload): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.cancelListing(payload.param), payload.data);
  };

  public terminateLease = async (payload: ITerminateListingPayload): Promise<ILeaseTermination> => {
    return await this.apiClient.post(ENDPOINTS.terminateTransaction(payload.id), payload.data);
  };

  public getReviewReportCategories = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reviewReportCategories);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getListingReviews = async (params: IGetListingReviews): Promise<AssetReview[]> => {
    const response = await this.apiClient.get(ENDPOINTS.listingReviews, params);
    return ObjectMapper.deserializeArray(AssetReview, response);
  };

  public getListingReviewsSummary = async (params: IGetListingReviews): Promise<AssetReview> => {
    const response = await this.apiClient.get(ENDPOINTS.listingReviewsSummary, params);
    return ObjectMapper.deserialize(AssetReview, response);
  };

  public postListingReview = async (params: IListingReviewParams): Promise<void> => {
    return this.apiClient.post(ENDPOINTS.listingReviews, params);
  };

  public addReviewComment = async (reviewId: number, payload: IAddReviewComment): Promise<AssetReviewComment> => {
    const response = await this.apiClient.post(ENDPOINTS.addReviewComment(reviewId), payload);
    return ObjectMapper.deserialize(AssetReviewComment, response);
  };

  public editReviewComment = async (reviewId: number, commentId: number, payload: IAddReviewComment): Promise<void> => {
    return this.apiClient.put(ENDPOINTS.editReviewComment(reviewId, commentId), payload);
  };

  public deleteReviewComment = async (reviewId: number, commentId: number): Promise<void> => {
    return this.apiClient.delete(ENDPOINTS.editReviewComment(reviewId, commentId));
  };

  public reportReview = async (reviewId: number, payload: IReportReview): Promise<void> => {
    return this.apiClient.post(ENDPOINTS.reportReview(reviewId), payload);
  };

  public getReportReviewData = async (reviewId: number, reportId: number): Promise<ReportReview> => {
    const response = await this.apiClient.get(ENDPOINTS.reportReviewData(reviewId, reportId));
    return ObjectMapper.deserialize(ReportReview, response);
  };

  public updateTenantDetails = async (param: IUpdateTenantParam, payload: IUserDetails): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateTenant(param), payload);
  };

  public deleteTenant = async (param: IUpdateTenantParam): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.updateTenant(param));
  };

  public acceptInvite = async (payload: IAcceptInvitePayload): Promise<void> => {
    const { inviteId } = payload;
    return await this.apiClient.get(ENDPOINTS.acceptInvite(), { invite_id: inviteId });
  };

  public getLeaseTransaction = async (transactionId: number): Promise<TransactionDetail> => {
    const response = await this.apiClient.get(ENDPOINTS.leaseTransaction(transactionId));
    return ObjectMapper.deserialize(TransactionDetail, response);
  };

  public updateLeaseTransaction = async (payload: IUpdateLeaseTerm): Promise<void> => {
    const { transactionId, data } = payload;
    return await this.apiClient.put(ENDPOINTS.leaseTransaction(transactionId), data);
  };

  public getActiveAssets = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.activeAssets);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public createUnitListing = async (payload: IUnitListingPayload): Promise<{ id: number }> => {
    const { propertyId, unitId, leaseTerms } = payload;
    return await this.apiClient.post(ENDPOINTS.createUnitListing(propertyId, unitId), leaseTerms);
  };

  public deleteAssetAttachment = async (propertyId: number, attachmentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.assetAttachmentById(propertyId, attachmentId));
  };

  public inviteTenant = async (tenantId: number): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.inviteTenant(tenantId));
  };

  public getOnGoingTransaction = async (assetId: number): Promise<OnGoingTransaction[]> => {
    const response = await this.apiClient.get(ENDPOINTS.leaseUnits(assetId));
    return ObjectMapper.deserializeArray(OnGoingTransaction, response);
  };

  public getAssetUsers = async (payload: IAssetUserPayload): Promise<User[]> => {
    const response = await this.apiClient.get(
      ENDPOINTS.assetUser(payload.assetId),
      payload.lease_transaction_id && {
        lease_transaction: payload.lease_transaction_id,
      }
    );
    return ObjectMapper.deserializeArray(User, response);
  };
}

const propertyRepository = new AssetRepository();
export { propertyRepository as AssetRepository };
