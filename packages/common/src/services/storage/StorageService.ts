import { ConfigHelper } from "@homzhub/common/src/utils/ConfigHelper";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
// import { Storage, CryptoJS } from "./index.native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "react-native-crypto-js";

export enum StorageKeys {
  IS_ONBOARDING_COMPLETED = "@is_onBoarding_completed",
  USER_SELECTED_LANGUAGE = "@user_selected_language",
  USER = "@user",
  DEVICE_TOKEN = "@device_token",
  IS_OFFER_RECEIVED_INFO_READ = "@is_offer_received_info_read",
  IS_OFFER_MADE_INFO_READ = "@is_offer_made_info_read",
  IS_APP_ALREADY_OPENED = "@is_app_already_opened",
}

export interface IUserTokens {
  access_token: string;
  refresh_token: string;
}

// class StorageService {
//   private secret: string = ConfigHelper.getStorageSecret();

//   public get = async <T>(key: string): Promise<T | null> => {
//     const value: string | null = await AsyncStorage.getItem(key);
//     if (!value) {
//       return null;
//     }

//     const bytes = CryptoJS.AES.decrypt(value, this.secret);
//     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     return decryptedData as T;
//   };

//   public set = async <T>(key: string, data: T): Promise<void> => {
//     const encryptedData = CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       this.secret
//     ).toString();
//     await AsyncStorage.setItem(key, encryptedData);
//   };

//   public remove = async (key: string): Promise<void> => {
//     await AsyncStorage.removeItem(key);
//   };

//   public reset = async (): Promise<void> => {
//     await AsyncStorage.clear();
//   };
// }

class StorageService {
  private secret: string = ConfigHelper.getStorageSecret();

  public get = async <T>(key: string): Promise<T | null> => {
    try {
      const value: string | null = await AsyncStorage.getItem(key);
      if (!value) {
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(value, this.secret);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData as T;
    } catch (error) {
      return null;
    }
  };

  public set = async <T>(key: string, data: T): Promise<void> => {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.secret
      ).toString();
      await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {}
  };

  // Add similar error handling for remove and reset methods if needed

  public remove = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {}
  };

  public reset = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {}
  };
}

const storageService = new StorageService();
export { storageService as StorageService };
