import { cloneDeep, findIndex } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ExistingVerificationDocuments } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IRoutes } from '@homzhub/common/src/constants/Tabs';

const baseUrl = ConfigHelper.getBaseUrl();

export interface IDocsProps {
  document?: ExistingVerificationDocuments;
  existingDocuments?: ExistingVerificationDocuments[];
  localDocuments?: ExistingVerificationDocuments[];
  clonedDocuments?: ExistingVerificationDocuments[];
  key?: string;
  propertyId?: number;
  isLocalDocument?: boolean;
}

export interface IListingUpdate {
  isStepDone?: boolean[];
  isNextStep?: boolean;
  currentIndex?: number;
  isSheetVisible?: boolean;
}

export interface IListingStep {
  currentIndex: number;
  isStepDone: boolean[];
  getAssetById: () => void;
  assetDetails: Asset | null;
  scrollToTop: () => void;
  routes: IRoutes[];
  isNextStep: boolean;
  isSheetVisible: boolean;
  updateState: (state: IListingUpdate) => void;
  onPreview?: (assetDetails: Asset) => void;
  params?: { previousScreen: string; isEditFlow?: boolean };
}

class ListingService {
  public getHeader = (selectedPlan: TypeOfPlan): string => {
    switch (selectedPlan) {
      case TypeOfPlan.RENT:
        return I18nService.t('property:rent');
      case TypeOfPlan.SELL:
        return I18nService.t('property:sell');
      default:
        return I18nService.t('property:inviteTenant');
    }
  };

  public getExistingDocuments = async (propertyId: number, updateState: (props: IDocsProps) => void): Promise<void> => {
    try {
      let existingDocuments: ExistingVerificationDocuments[] = [];
      existingDocuments = await AssetRepository.getExistingVerificationDocuments(propertyId);
      if (existingDocuments.length === 0) {
        existingDocuments = await AssetRepository.getAssetIdentityDocuments();
      }
      updateState({ existingDocuments });
    } catch (error) {
      AlertHelper.error({ message: error.message, statusCode: error.details.statusCode }); // TODOS: Lakshit - Require Clarity on Usage
    }
  };

  public deleteDocument = async (deleteProps: IDocsProps, updateState: (props: IDocsProps) => void): Promise<void> => {
    const { existingDocuments, localDocuments, document, isLocalDocument, propertyId } = deleteProps;
    const clonedDocuments =
      isLocalDocument && localDocuments ? cloneDeep(localDocuments) : cloneDeep(existingDocuments);
    if (document && !document.id) {
      const documentIndex = findIndex(clonedDocuments, (existingDocument: ExistingVerificationDocuments) => {
        return existingDocument.verificationDocumentType.id === document.verificationDocumentType.id;
      });
      if (clonedDocuments && documentIndex !== -1) {
        clonedDocuments.splice(documentIndex, 1);
        const key = isLocalDocument ? 'localDocuments' : 'existingDocuments';
        updateState({ existingDocuments, localDocuments, clonedDocuments, key });
      }
    } else {
      try {
        if (propertyId && document && document.id) {
          await AssetRepository.deleteVerificationDocument(propertyId, document.id);
          await this.getExistingDocuments(propertyId, updateState);
        }
      } catch (error) {
        AlertHelper.error({ message: error.message, statusCode: error.details.statusCode });
      }
    }
  };

  public handleListingStep = (props: IListingStep): void => {
    const {
      currentIndex,
      isStepDone,
      getAssetById,
      assetDetails,
      params,
      updateState,
      scrollToTop,
      routes,
      onPreview,
      isNextStep,
      isSheetVisible,
    } = props;

    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    const states: IListingUpdate = {
      currentIndex,
      isStepDone,
      isNextStep,
      isSheetVisible,
    };
    let updatedStates: IListingUpdate;

    updatedStates = {
      ...states,
      isStepDone: newStepDone,
      isNextStep: true,
    };

    if (assetDetails) {
      const {
        isPropertyReady,
        listing: { isPaymentDone },
      } = assetDetails.lastVisitedStep;
      if (currentIndex === 0 && params && params.isEditFlow) {
        updatedStates = {
          ...updatedStates,
          currentIndex: currentIndex + 1,
        };
        getAssetById();
        scrollToTop();
      } else if ((currentIndex === 1 || isPropertyReady) && isPaymentDone && onPreview) {
        onPreview(assetDetails);
      } else if (currentIndex < routes.length - 1) {
        updatedStates = {
          ...updatedStates,
          currentIndex: currentIndex + 1,
        };
        getAssetById();
        scrollToTop();
      } else if (currentIndex === 1 || isPropertyReady) {
        if (currentIndex < routes.length - 1) {
          updatedStates = {
            ...updatedStates,
            currentIndex: currentIndex + 1,
          };
          getAssetById();
          scrollToTop();
        } else {
          updatedStates = {
            ...updatedStates,
            isSheetVisible: true,
          };
        }
      } else {
        updatedStates = {
          ...updatedStates,
          isSheetVisible: true,
        };
      }
    }

    updateState(updatedStates);
  };

  // TODO: (Shikha) - Fix Network request failed issue
  public resendInvite = async (id: number): Promise<void> => {
    const token = StoreProviderService.getUserToken();
    await fetch(`${baseUrl}v1/lease-tenants/${id}/invites/`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        AnalyticsService.track(EventType.TenantInviteResent);
      })
      .catch((e) => Logger.warn(JSON.stringify(e)));
  };
}

const listingService = new ListingService();
export { listingService as ListingService };
