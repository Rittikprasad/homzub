import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Count } from '@homzhub/common/src/domain/models/Count';
import { Data } from '@homzhub/common/src/domain/models/Asset';
import { IMetricsCount, MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';

enum DashboardRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export interface IMetricsData {
  metricValues: AssetMetricsData;
  updates: AssetUpdates;
  isTenant: boolean;
}

@JsonObject('UserServicePlan')
export class UserServicePlan {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }
}

export interface IMiscellaneous {
  name: string;
  label: string;
  count: number;
  color_code: string;
  code?: string;
  currency_symbol?: string;
}

@JsonObject('Miscellaneous')
export class Miscellaneous {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('currency_symbol', String, true)
  private _currency_symbol = '';

  @JsonProperty('color_code', String)
  private _colorCode = '';

  @JsonProperty('code', String, true)
  private _code = '';

  get colorCode(): string {
    return this._colorCode;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get count(): number {
    return this._count;
  }

  get currencySymbol(): string {
    return this._currency_symbol;
  }

  get code(): string {
    return this._code;
  }
}

@JsonObject('AssetMetricsData')
export class AssetMetricsData {
  @JsonProperty('assets', Count)
  private _assets = new Count();

  @JsonProperty('miscellaneous', [Miscellaneous], true)
  private _miscellaneous: Miscellaneous[] = [];

  @JsonProperty('asset_groups', [Data], true)
  private _assetGroups: Data[] = [];

  @JsonProperty('user_service_plan', UserServicePlan, true)
  private _userServicePlan = new UserServicePlan();

  get assets(): Count {
    return this._assets;
  }

  get miscellaneous(): Miscellaneous[] {
    return this._miscellaneous;
  }

  get assetGroups(): Data[] {
    return this._assetGroups;
  }

  get userServicePlan(): UserServicePlan {
    return this._userServicePlan;
  }
}

export interface IAssetUpdates {
  notifications: IMetricsCount;
  tickets: IMetricsCount;
  messages?: IMetricsCount;
  jobs?: IMetricsCount;
}

@JsonObject('AssetUpdates')
export class AssetUpdates {
  @JsonProperty('notifications', MetricsCount)
  private _notifications = new MetricsCount();

  @JsonProperty('tickets', MetricsCount)
  private _tickets = new MetricsCount();

  // Optional not to break web functionality.
  @JsonProperty('dues', Count, true)
  private _dues = new Count();

  @JsonProperty('messages', MetricsCount, true)
  private _messages = new MetricsCount();

  @JsonProperty('jobs', MetricsCount, true)
  private _jobs = new MetricsCount();

  get notifications(): MetricsCount {
    return this._notifications;
  }

  get tickets(): MetricsCount {
    return this._tickets;
  }

  get dues(): Count {
    return this._dues;
  }

  get messages(): MetricsCount {
    return this._messages;
  }

  get jobs(): MetricsCount {
    return this._jobs;
  }
}

@JsonObject('AssetMetrics')
export class AssetMetrics {
  @JsonProperty('user_service_plan', UserServicePlan, true)
  private _userServicePlan = new UserServicePlan();

  @JsonProperty('asset_metrics', AssetMetricsData, true)
  private _assetMetrics = new AssetMetricsData();

  @JsonProperty('updates', AssetUpdates, true)
  private _updates = new AssetUpdates();

  // v4 changes START
  @JsonProperty('dashboard_role', String, true)
  private _dashboardRole = DashboardRole.OWNER;

  @JsonProperty('owner_metrics', AssetMetricsData, true)
  private _ownerMetrics = new AssetMetricsData();

  @JsonProperty('tenant_metrics', AssetMetricsData, true)
  private _tenantMetrics = new AssetMetricsData();
  // v4 changes END

  get userServicePlan(): UserServicePlan {
    return this._userServicePlan;
  }

  get assetMetrics(): AssetMetricsData {
    return this._assetMetrics;
  }

  get updates(): AssetUpdates {
    return this._updates;
  }

  get dashboardRole(): DashboardRole {
    return this._dashboardRole;
  }

  get ownerMetrics(): AssetMetricsData {
    return this._ownerMetrics;
  }

  get tenantMetrics(): AssetMetricsData {
    return this._tenantMetrics;
  }

  get metricsValues(): AssetMetricsData {
    if (this._dashboardRole === DashboardRole.OWNER) return this._ownerMetrics;
    return this._tenantMetrics;
  }

  get metricsData(): IMetricsData {
    return {
      metricValues: this.metricsValues,
      updates: this.updates,
      isTenant: this._dashboardRole === DashboardRole.TENANT,
    };
  }

  get assetCount(): number {
    return this._dashboardRole === DashboardRole.OWNER
      ? this.ownerMetrics.assets.count
      : this.tenantMetrics.assets.count;
  }
}
