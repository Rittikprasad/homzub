import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export interface IAssetCreationStep {
  is_created?: boolean;
  is_details_done?: boolean;
  is_highlights_done?: boolean;
  is_gallery_done?: boolean;
  total_step: number;
}

export interface IListingStep {
  type: TypeOfPlan | string;
  is_listing_created?: boolean;
  is_verification_done?: boolean;
  is_services_done?: boolean;
  is_payment_done?: boolean;
}

export interface ILastVisitedStep {
  asset_creation?: IAssetCreationStep;
  listing?: IListingStep;
}

@JsonObject('AssetCreationStep')
export class AssetCreationStep {
  @JsonProperty('is_created', Boolean, true)
  private _isCreated = true;

  @JsonProperty('is_details_done', Boolean, true)
  private _isDetailsDone = false;

  @JsonProperty('is_highlights_done', Boolean, true)
  private _isHighlightsDone = false;

  @JsonProperty('is_gallery_done', Boolean, true)
  private _isGalleryDone = false;

  @JsonProperty('total_step', Number, true)
  private _totalStep = 4;

  @JsonProperty('percentage', Number, true)
  private _percentage = 0;

  get totalStep(): number {
    return this._totalStep;
  }

  get isCreated(): boolean {
    return this._isCreated;
  }

  get isDetailsDone(): boolean {
    return this._isDetailsDone;
  }

  get isHighlightsDone(): boolean {
    return this._isHighlightsDone;
  }

  get isGalleryDone(): boolean {
    return this._isGalleryDone;
  }

  get stepList(): boolean[] {
    // Sort in same order as add property flow
    return [this.isDetailsDone, this.isHighlightsDone, this.isGalleryDone];
  }

  get percentage(): number {
    let totalDone = 0;
    const totalSteps = [...this.stepList, this.isCreated];
    totalDone = totalSteps.filter((item) => item).length;
    return (totalDone / this.totalStep) * 100;
  }
}

@JsonObject('ListingStep')
export class ListingStep {
  @JsonProperty('type', String, true)
  private _type = TypeOfPlan.RENT;

  @JsonProperty('is_listing_created', Boolean, true)
  private _isListingCreated = false;

  @JsonProperty('is_verification_done', Boolean, true)
  private _isVerificationDone = false;

  @JsonProperty('is_services_done', Boolean, true)
  private _isServicesDone = false;

  @JsonProperty('is_payment_done', Boolean, true)
  private _isPaymentDone = false;

  get type(): TypeOfPlan {
    return this._type;
  }

  get isListingCreated(): boolean {
    return this._isListingCreated;
  }

  get isVerificationDone(): boolean {
    return this._isVerificationDone;
  }

  get isServicesDone(): boolean {
    return this._isServicesDone;
  }

  get isPaymentDone(): boolean {
    return this._isPaymentDone;
  }

  get stepList(): boolean[] {
    return [this.isListingCreated, this.isVerificationDone, this.isServicesDone, this.isPaymentDone];
  }
}

@JsonObject('LastVisitedStep')
export class LastVisitedStep {
  @JsonProperty('asset_creation', AssetCreationStep, true)
  private _assetCreation = new AssetCreationStep();

  @JsonProperty('listing', ListingStep, true)
  private _listing = new ListingStep();

  get assetCreation(): AssetCreationStep {
    return this._assetCreation;
  }

  get listing(): ListingStep {
    return this._listing;
  }

  get isVerificationRequired(): boolean {
    const { isListingCreated, isVerificationDone, type } = this.listing;
    if (type !== TypeOfPlan.MANAGE) {
      return isListingCreated && !isVerificationDone;
    }
    return false;
  }

  get isListingRequired(): boolean {
    const { percentage } = this.assetCreation;
    const { isListingCreated } = this.listing;

    return percentage === 100 && !isListingCreated;
  }

  get isPropertyReady(): boolean {
    const { isListingCreated, isVerificationDone, type } = this.listing;
    if (type === TypeOfPlan.MANAGE) {
      return isListingCreated;
    }
    return isListingCreated && isVerificationDone;
  }

  get isCompleteDetailsRequired(): boolean {
    const { percentage } = this.assetCreation;
    const { isListingCreated } = this.listing;

    return percentage < 100 && !isListingCreated;
  }
}
