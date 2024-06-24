import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAssetKey {
  id: number;
  key_holder_name: string;
  key_holder_phone_code: string;
  key_holder_contact_number: string;
  key_holder_email: string;
  key_holder_address_line_1: string;
  key_holder_address_line_2: string;
  key_holder_profile_image_url: string | null;
  postal_code: string;
  available_start_time: string;
  available_end_time: string;
}

@JsonObject('AssetKey')
export class AssetKey {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('key_holder_name', String)
  private _keyHolderName = '';

  @JsonProperty('key_holder_phone_code', String)
  private _keyHolderPhoneCode = '';

  @JsonProperty('key_holder_contact_number', String)
  private _keyHolderContactNumber = '';

  @JsonProperty('key_holder_email', String)
  private _keyHolderEmail = '';

  @JsonProperty('key_holder_address_line_1', String)
  private _keyHolderAddressLine1 = '';

  @JsonProperty('key_holder_address_line_2', String)
  private _keyHolderAddressLine2 = '';

  @JsonProperty('key_holder_profile_image_url', String, true)
  private _keyHolderProfileImageUrl = null;

  @JsonProperty('postal_code', String)
  private _postalCode = '';

  @JsonProperty('available_start_time', String)
  private _availableStartTime = '';

  @JsonProperty('available_end_time', String)
  private _availableEndTime = '';

  get id(): number {
    return this._id;
  }

  get keyHolderName(): string {
    return this._keyHolderName;
  }

  get keyHolderPhoneCode(): string {
    return this._keyHolderPhoneCode;
  }

  get keyHolderContactNumber(): string {
    return this._keyHolderContactNumber;
  }

  get keyHolderEmail(): string {
    return this._keyHolderEmail;
  }

  get keyHolderAddressLine1(): string {
    return this._keyHolderAddressLine1;
  }

  get keyHolderAddressLine2(): string {
    return this._keyHolderAddressLine2;
  }

  get keyHolderProfileImageUrl(): string | null {
    return this._keyHolderProfileImageUrl;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get availableStartTime(): string {
    return this._availableStartTime;
  }

  get availableEndTime(): string {
    return this._availableEndTime;
  }
}
