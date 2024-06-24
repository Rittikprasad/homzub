import { icons } from '@homzhub/common/src/assets/icon';
import { IDetailsInfo } from '@homzhub/mobile/src/components/molecules/DetailsCard';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Address, IAddress } from '@homzhub/common/src/domain/models/Address';
import { EmergencyContact, IEmergencyContact } from '@homzhub/common/src/domain/models/EmergencyContact';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { IWorkInfo, WorkInfo } from '@homzhub/common/src/domain/models/WorkInfo';

export interface IUserProfile extends IUser {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email_verified: boolean;
  social_image_url: string;
  profile_progress: number;
  referral_code: string;
  user_address: IAddress[];
  emergency_contact: IEmergencyContact;
  work_info: IWorkInfo;
}

@JsonObject('UserProfile')
export class UserProfile extends User {
  @JsonProperty('date_of_birth', String, true)
  private _dateOfBirth = '';

  @JsonProperty('email_verified', Boolean)
  private _isPersonalEmailVerified = false;

  @JsonProperty('social_image_url', String)
  private _socialImageUrl = '';

  @JsonProperty('profile_progress', Number, true)
  private _profileProgress = 0;

  @JsonProperty('referral_code', String)
  private _referralCode = '';

  @JsonProperty('user_address', [Address])
  private _userAddress = [new Address()];

  @JsonProperty('emergency_contact', EmergencyContact)
  private _emergencyContact = new EmergencyContact();

  @JsonProperty('work_info', WorkInfo)
  private _workInfo = new WorkInfo();

  @JsonProperty('is_password_created', Boolean)
  private _isPasswordCreated = false;

  get dateOfBirth(): string {
    return this._dateOfBirth;
  }

  get isPersonalEmailVerified(): boolean {
    return this._isPersonalEmailVerified;
  }

  get isWorkEmailVerified(): boolean {
    return this.workInfo.emailVerified;
  }

  get socialImageUrl(): string {
    return this._socialImageUrl;
  }

  get profileProgress(): number {
    return this._profileProgress;
  }

  get referralCode(): string {
    return this._referralCode;
  }

  get userAddress(): Address[] {
    return this._userAddress;
  }

  get address(): string {
    return this.userAddress && this.userAddress.length > 0 ? this.userAddress[0].addressLine1 : '';
  }

  get isPasswordCreated(): boolean {
    return this._isPasswordCreated;
  }

  get emergencyContact(): EmergencyContact {
    return this._emergencyContact;
  }

  get basicDetailsArray(): IDetailsInfo[] | undefined {
    if (!this.name && !this.phoneNumber && !this.email && !(this.userAddress && this.userAddress.length > 0)) {
      return undefined;
    }

    let detailsArray: IDetailsInfo[] = [];

    detailsArray = [
      { icon: icons.filledUser, ...(this.name ? { text: this.name } : { helperText: 'Name' }) },
      {
        icon: icons.phone,
        ...(this.phoneNumber ? { text: `(${this.countryCode}) ${this.phoneNumber}` } : { helperText: 'Phone Number' }),
      },
      {
        icon: icons.email,
        ...(this.email ? { text: this.email } : { helperText: 'Email' }),
        type: 'EMAIL',
        emailVerified: this.isPersonalEmailVerified,
      },
    ];

    if (this.userAddress.length > 0) {
      const { address, postalCode } = this.userAddress[0];
      detailsArray.push({
        icon: icons.marker,
        text: `${address}, ${postalCode}`,
      });
    }

    return detailsArray;
  }

  get emergencyContactArray(): IDetailsInfo[] | undefined {
    const { name, phoneNumber, email } = this._emergencyContact;

    if (!name && !phoneNumber && !email) {
      return undefined;
    }

    return [
      { icon: icons.filledUser, ...(name ? { text: name } : { helperText: 'Name' }) },
      { icon: icons.phone, ...(phoneNumber ? { text: phoneNumber } : { helperText: 'Phone Number' }) },
      { icon: icons.email, ...(email ? { text: email } : { helperText: 'Email' }) },
    ];
  }

  get workInfo(): WorkInfo {
    return this._workInfo;
  }

  get workInfoArray(): IDetailsInfo[] | undefined {
    const { companyName, workEmail } = this._workInfo || new WorkInfo();

    if (!companyName && !workEmail) {
      return undefined;
    }

    return [
      { icon: icons.filledUser, ...(companyName ? { text: companyName } : { helperText: 'Company Name' }) },
      {
        icon: icons.email,
        ...(workEmail ? { text: workEmail } : { helperText: 'Work Email' }),
        type: 'EMAIL',
        emailVerified: this.isWorkEmailVerified,
      },
    ];
  }
}
