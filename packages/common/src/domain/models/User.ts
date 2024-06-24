import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Address, IAddress } from '@homzhub/common/src/domain/models/Address';
import { IWorkInfo, WorkInfo } from '@homzhub/common/src/domain/models/WorkInfo';

export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export interface IAssetUser {
  owners: IDropdownOption[];
  tenants: IDropdownOption[];
}

export interface IUser {
  id?: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
  profile_picture?: string;
  rating?: number;
  is_asset_owner?: boolean;
  workInfo: IWorkInfo;
  role?: string;
  user_address?: IAddress[];
}
@JsonObject('User')
export class User {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('full_name', String, true)
  private _fullName = '';

  @JsonProperty('first_name', String, true)
  private _firstName = '';

  @JsonProperty('last_name', String, true)
  private _lastName = '';

  @JsonProperty('email', String, true)
  private _email = '';

  @JsonProperty('phone_code', String, true)
  private _countryCode = '';

  @JsonProperty('phone_number', String, true)
  private _phoneNumber = '';

  @JsonProperty('profile_picture', String, true)
  private _profilePicture = '';

  @JsonProperty('refresh_token', String, true)
  private _refreshToken = '';

  @JsonProperty('access_token', String, true)
  private _accessToken = '';

  @JsonProperty('rating', Number, true)
  private _rating = 0;

  @JsonProperty('is_asset_owner', Boolean, true)
  private _isAssetOwner = false;

  @JsonProperty('work_info', WorkInfo, true)
  private _workInfo = new WorkInfo();

  @JsonProperty('role', String, true)
  private _role = '';

  @JsonProperty('user_address', [Address], true)
  private _userAddress = [];

  get refreshToken(): string {
    return this._refreshToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get fullName(): string {
    return this._fullName;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get email(): string {
    return this._email;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get id(): number {
    return this._id;
  }

  get rating(): number {
    return this._rating;
  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  get isAssetOwner(): boolean {
    return this._isAssetOwner;
  }

  get workInfo(): WorkInfo {
    return this._workInfo;
  }

  get role(): string {
    return this._role;
  }

  get userAddress(): Address[] {
    return this._userAddress;
  }
}
