import SystemParameter from "../Entities/SystemParameter";

class GlobalDto {
    AppName: string;
    Version: string;
    Copyright: string;
    SystemParameter: SystemParameter;
    SystemParameters: SystemParameter[];

    DeviceInfo?: string;
    ExceptionInfo?: string;  

    Filter?: GlobalFilter;
}

class GlobalFilter {
    public SystemParameterID?: number;
    public FeatureID?: number;
    public Ext1i?: number;    
}

export {GlobalDto, GlobalFilter}