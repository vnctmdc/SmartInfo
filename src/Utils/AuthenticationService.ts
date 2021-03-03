import HttpUtils from "./HttpUtils";
import AuthenticationParam from "../DtoParams/AuthenticationParam";
import ApiUrl from "../constants/ApiUrl";
import GlobalCache from "../Caches/GlobalCache";

export default class AuthenticationService {
    static SignOut() {
        HttpUtils.post<AuthenticationParam>(ApiUrl.Authentication_Logout, "", null);
    }

    static IsSignIn() {
        return GlobalCache.UserToken && GlobalCache.UserToken !== "";
    }
}
