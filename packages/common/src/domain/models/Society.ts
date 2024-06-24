import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IProject, Project } from '@homzhub/common/src/domain/models/Project';
import { ISocietyBankInfo, SocietyBankInfo } from '@homzhub/common/src/domain/models/SocietyBankInfo';

export interface ISociety {
  id: number;
  name: string;
  contact_name?: string;
  contact_number?: string;
  contact_email?: string;
  project?: IProject;
  society_bank_info?: ISocietyBankInfo;
  can_edit?: boolean;
  can_delete?: boolean;
}

@JsonObject('Society')
export class Society {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('contact_name', String, true)
  private _contactName = '';

  @JsonProperty('contact_number', String, true)
  private _contactNumber = '';

  @JsonProperty('contact_email', String, true)
  private _contactEmail = '';

  @JsonProperty('project', Project, true)
  private _project = new Project();

  @JsonProperty('society_bank_info', SocietyBankInfo, true)
  private _societyBankInfo = new SocietyBankInfo();

  @JsonProperty('can_edit', Boolean, true)
  private _canEdit = false;

  @JsonProperty('can_delete', Boolean, true)
  private _canDelete = false;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get contactName(): string {
    return this._contactName;
  }

  get contactNumber(): string {
    return this._contactNumber;
  }

  get contactEmail(): string {
    return this._contactEmail;
  }

  get project(): Project {
    return this._project;
  }

  get societyBankInfo(): SocietyBankInfo {
    return this._societyBankInfo;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get canDelete(): boolean {
    return this._canDelete;
  }
}
