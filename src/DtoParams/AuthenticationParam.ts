import { BaseParam } from "./BaseParam";
import Employee from "../Entities/Employee";

class AuthenticationParam extends BaseParam {
    public UserName?: string;
    public Password?: string;
    public UserToken?: string;

    public Employee?: Employee;
}
export default AuthenticationParam;
