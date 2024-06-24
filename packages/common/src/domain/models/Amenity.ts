import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export enum AssetAmenityType {
  GENERAL = 'General',
  SPORTS = 'Sports',
  ECO_FRIENDLY = 'Eco-friendly',
}

export interface IAmenity {
  id: number;
  name: string;
  category: IUnit;
  attachment: IAttachment;
}

@JsonObject('Amenity')
export class Amenity {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('category', Unit, true)
  private _category = new Unit();

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get category(): Unit {
    return this._category;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}

@JsonObject('AssetAmenity')
export class AssetAmenity extends Unit {
  @JsonProperty('amenities', [Amenity], true)
  private _amenities: Amenity[] = [];

  get amenities(): Amenity[] {
    return this._amenities;
  }
}

@JsonObject('AssetGroupAmenity')
export class AssetGroupAmenity extends Unit {
  @JsonProperty('category', [AssetAmenity])
  private _category: AssetAmenity[] = [];

  get category(): AssetAmenity[] {
    return this._category;
  }
}

@JsonObject('CategoryAmenityGroup')
export class CategoryAmenityGroup extends Unit {
  @JsonProperty('category', AssetAmenity)
  private _category = new AssetAmenity();

  @JsonProperty('attachment', Attachment, true)
  private _attachment = new Attachment();

  get category(): AssetAmenity {
    return this._category;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}

@JsonObject('AmenityGroup')
export class AmenityGroup extends Unit {
  @JsonProperty('amenities', [CategoryAmenityGroup])
  private _amenities: CategoryAmenityGroup[] = [];

  get amenities(): CategoryAmenityGroup[] {
    return this._amenities;
  }
}
