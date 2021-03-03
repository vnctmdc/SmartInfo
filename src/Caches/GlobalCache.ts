import { GlobalFilter, GlobalDto } from "../DtoParams/GlobalDto";
import HttpUtils from "../Utils/HttpUtils";
import ApiUrl from "../constants/ApiUrl";
import Employee from "../Entities/Employee";

interface iSystemParameter {
    SystemParameterID: number;
    Name: string;
    Code: string;
    FeatureID: number;
    Ext1i: number;
}

export default class GlobalCache {
    static Profile?: Employee;

    // apikey
    static MapApiKey = "";

    // Token đăng nhập của user
    static UserToken = "";

    // Cache bảng system parameter
    static SystemParameters: iSystemParameter[];

    // Cache bảng Organization
    static Organizations = [];

    //Lấy tên của SystemParam by ID
    static GetSystemParamNameByID(id: number): string | null {
        let item = GlobalCache.SystemParameters.find((en) => en.SystemParameterID === id);
        if (item) {
            return item.Name;
        }

        return null;
    }

    // Lấy code của SystemParam by ID
    static GetSystemParamCodeByID(id: number): string | null {
        let item = GlobalCache.SystemParameters.find((en) => en.SystemParameterID === id);
        if (item) {
            return item.Code;
        }

        return null;
    }

    // Lấy danh sách SystemParam by featureID
    static GetSystemParamsByFeatureID(featureID: number): Array<iSystemParameter> {
        return GlobalCache.SystemParameters.filter((en) => en.FeatureID === featureID);
    }

    // Lấy danh sách SystemParam by featureID và cột mở rộng Ext1i
    static GetSystemParamsByFeatureAndExt1i(featureID: number, ext1i: number): Array<iSystemParameter> {
        return GlobalCache.SystemParameters.filter((en) => en.FeatureID === featureID && en.Ext1i === ext1i);
    }

    // static GetSystemParameterByID(id?: number) : SystemParameter
    // {
    //     if (GlobalCache.SystemParameters != null && id != null)
    //         return GlobalCache.SystemParameters.filter(item => item.SystemParameterID != id);

    //     return null;
    // }

    // static GetCodeByID(id?: number): string
    // {
    //         SystemParameter item = GetSystemParameterByID(id);

    //         return item == null ? string.Empty : item.Code;
    // }
}
