import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Company, ICompany } from '@homzhub/common/src/domain/models/Company';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IWorkInfo {
  id: number;
  jobType: IUnit;
  company_name: string;
  work_email: string;
  work_employee_id: string;
  company: ICompany;
}

@JsonObject('WorkInfo')
export class WorkInfo {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('company_name', String)
  private _companyName = '';

  @JsonProperty('job_type', Unit, true)
  private _jobType = new Unit();

  @JsonProperty('work_email', String, true)
  private _workEmail = null;

  @JsonProperty('work_employee_id', String)
  private _workEmployeeId = '';

  @JsonProperty('email_verified', Boolean)
  private _emailVerified = false;

  @JsonProperty('company', Company)
  private _company = new Company();

  get id(): number {
    return this._id;
  }

  get jobType(): Unit {
    return this._jobType;
  }

  get companyName(): string {
    return this._companyName;
  }

  get workEmail(): string | null {
    return this._workEmail;
  }

  get workEmployeeId(): string {
    return this._workEmployeeId;
  }

  get company(): Company {
    return this._company;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }
}
