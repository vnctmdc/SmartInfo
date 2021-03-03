import { GlobalDto } from "../DtoParams/GlobalDto";
import HttpUtils from "./HttpUtils";
import ApiUrl from "../constants/ApiUrl";

export default class LogManager{
    public static async Log(global) {
        HttpUtils.post<GlobalDto>(ApiUrl.Global_LogError, null, JSON.stringify(global), false);
    }
}
