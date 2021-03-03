import PagingInfo from "./PagingInfo";

class BaseParam {

    public PagingInfo?: PagingInfo;

    public FunctionCodes?: Array<string>;
}

class BaseFilter {
    public PageIndex: number = 0;

    public PageSize?: number;
}

export { BaseParam, BaseFilter }