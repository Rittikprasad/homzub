// eslint-disable-next-line max-classes-per-file
import { JsonObject, JsonProperty, ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('NestedClass')
class NestedClass {
  @JsonProperty('someBoolean', Boolean)
  private _someBoolean = false;

  @JsonProperty('someString', String)
  private _someString = '';

  get someBoolean(): boolean {
    return this._someBoolean;
  }

  set someBoolean(value: boolean) {
    this._someBoolean = value;
  }

  get someString(): string {
    return this._someString;
  }

  set someString(value: string) {
    this._someString = value;
  }
}

@JsonObject('SimpleClass')
class SimpleClass {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('phone', Number)
  private _phone = 0;

  @JsonProperty('isActive', Boolean)
  private _isActive = false;

  @JsonProperty('addresses', [String], true)
  private _addresses: string[] = [];

  @JsonProperty('newProps', [NestedClass], true)
  private _newProps: NestedClass[] = [];

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get phone(): number {
    return this._phone;
  }

  set phone(value: number) {
    this._phone = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get addresses(): string[] {
    if (!this._addresses) {
      return [];
    }

    return this._addresses;
  }

  set addresses(value: string[]) {
    this._addresses = value;
  }

  get newProps(): NestedClass[] {
    return this._newProps;
  }

  set newProps(value: NestedClass[]) {
    this._newProps = value;
  }
}

const name = 'John Galt';
const phone = 123456;
const addresses = ['a', 'b', 'c'];

describe('ObjectMapper', () => {
  describe('serialize', () => {
    let instance: SimpleClass;
    beforeEach(() => {
      instance = new SimpleClass();
      instance.name = name;
      instance.phone = phone;
      instance.isActive = true;
    });

    it('should serialize to plain object', () => {
      const serializedObject = ObjectMapper.serialize(instance);

      expect(serializedObject).toStrictEqual({ name, phone, isActive: true, addresses: [], newProps: [] });
    });

    it('should serialize to array of plain objects', () => {
      const instance2 = new SimpleClass();
      instance2.name = 'test';
      instance2.phone = 0;
      instance2.isActive = true;
      const serializedArray = ObjectMapper.serializeArray([instance, instance2]);

      expect(serializedArray).toHaveLength(2);
      expect(serializedArray[0]).toStrictEqual({ name, phone, isActive: true, addresses: [], newProps: [] });
      expect(serializedArray[1]).toStrictEqual({
        name: 'test',
        phone: 0,
        isActive: true,
        addresses: [],
        newProps: [],
      });
    });

    it('should serialize to plain object, if includes optional properties', () => {
      instance.addresses = ['a', 'b', 'c'];

      const serializedObject = ObjectMapper.serialize(instance);

      expect(serializedObject).toStrictEqual({ name, phone, isActive: true, addresses, newProps: [] });
    });

    it('should throw an error if object is invalid', () => {
      instance = new SimpleClass();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance.invalid = true;

      try {
        ObjectMapper.serialize(instance);
      }catch (e: any) {        expect(e).toBeTruthy();
      }
    });
  });

  describe('deserialize', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let object: any;
    beforeEach(() => {
      object = {
        name: 'John Galt',
        phone: 123456,
        isActive: false,
      };
    });

    it('should deserialize object to type, if object is valid', () => {
      const instance = ObjectMapper.deserialize(SimpleClass, object);

      expect(instance).toBeInstanceOf(SimpleClass);
      expect(instance.name).toStrictEqual(name);
      expect(instance.phone).toStrictEqual(phone);
      expect(instance.isActive).toStrictEqual(false);
      expect(instance.addresses).toStrictEqual([]);
    });

    it('should deserialize array to array of type, if array is valid', () => {
      const instanceArray = ObjectMapper.deserializeArray(SimpleClass, [object, object]);

      expect(instanceArray).toHaveLength(2);
      expect(instanceArray[0]).toBeInstanceOf(SimpleClass);
      expect(instanceArray[0].name).toStrictEqual(name);
      expect(instanceArray[0].phone).toStrictEqual(phone);
      expect(instanceArray[0].isActive).toStrictEqual(false);
      expect(instanceArray[0].addresses).toStrictEqual([]);
    });

    it('should deserialize object to type with optional properties, if object is valid', () => {
      object.addresses = addresses;
      object.isActive = true;

      const instance = ObjectMapper.deserialize(SimpleClass, object);

      expect(instance).toBeInstanceOf(SimpleClass);
      expect(instance.name).toStrictEqual(name);
      expect(instance.phone).toStrictEqual(phone);
      expect(instance.isActive).toStrictEqual(true);
      expect(instance.addresses).toStrictEqual(addresses);
    });

    it('should deserialize object if it contains additional properties and is valid', () => {
      object.addresses = addresses;
      object.isActive = true;
      object.someProperty = 123;
      object.someArray = [true, false, true];
      object.newProps = [
        { someBoolean: false, someString: '123' },
        { someBoolean: true, someString: '1234' },
      ];

      const instance = ObjectMapper.deserialize(SimpleClass, object);

      expect(instance).toBeInstanceOf(SimpleClass);
      expect(instance.name).toStrictEqual(name);
      expect(instance.phone).toStrictEqual(phone);
      expect(instance.isActive).toStrictEqual(true);
      expect(instance.addresses).toStrictEqual(addresses);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(instance.someProperty).not.toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(instance.someArray).not.toBeDefined();
    });

    it('should throw an error if the json in invalid', () => {
      delete object.name;

      try {
        ObjectMapper.deserialize(SimpleClass, object);
      }catch (e: any) {        expect(e).toBeTruthy();
      }

      expect.assertions(1);
    });
  });
});
