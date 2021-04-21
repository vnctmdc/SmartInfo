import GlobalCache from "../Caches/GlobalCache";
import { navigate, JumToErrorPage } from "../Screens/NavigationService";
import { SMXException, ExceptionType } from "../SharedEntity/SMXException";

export default class HttpUtils {
    public static async post<T>(apiUrl: string, actionCode: string, bodyContent: string, includeToken: boolean = true) {
        return HttpUtils.fetch_api<T>(apiUrl, actionCode, bodyContent, includeToken, "POST");
    }

    public static async get<T>(apiUrl: string, actionCode: string, bodyContent: string, includeToken: boolean = true) {
        return HttpUtils.fetch_api<T>(apiUrl, actionCode, bodyContent, includeToken, "GET");
    }

    public static async fetch_api<T>(
        apiUrl: string,
        actionCode: string,
        bodyContent: string,
        includeToken: boolean,
        actionType: string
    ) {
        //console.log(apiUrl);
        //console.log(bodyContent);

        // let connectOK = false; // Trạng thái connect
        // let httpStatus = -1; // Giá trị trả về

        let header = {};
        if (includeToken) {
            header = {
                Accept: "application/json",
                "Content-Type": "application/json",
                Flex_ActionCode: actionCode,
                Authorization: "Bearer " + GlobalCache.UserToken,
            };
        } else {
            header = {
                Accept: "application/json",
                "Content-Type": "application/json",
                Flex_ActionCode: actionCode,
            };
        }
        //console.log("REQUEST HEADER");
        //console.log(header);

        var httpStatus!: number;

        let response = await fetch(apiUrl, {
            method: "POST",
            headers: header,
            body: bodyContent,
        })
            .then((res) => {
                //console.log("RESPONSE RAW: \r\n" + JSON.stringify(res));
                httpStatus = res.status;

                return res.json();
            })
            .then((data) => {
                //console.log("RESPONSE DATA:");
                //console.log(data);
                return data;
            })
            .catch((err) => {
                //console.log("Exception:");
                //console.log(err);

                // Không kết nối được server, chuyển status về 404
                httpStatus = 404;

                // Nếu kết nối thất bại thì báo message và show ở client
                let ex = new SMXException();
                if (actionType === "POST") {
                    ex.Type = ExceptionType.PostFailed;
                    ex.Message = "Kết nối máy chủ thất bại, vui lòng kiểm tra internet";
                } else {
                    ex.Type = ExceptionType.GetFailed;
                    ex.Message = "Kết nối máy chủ thất bại, vui lòng kiểm tra internet";
                }
                throw ex;                
            });
        if (httpStatus === 200) {
            return response as T;
        } else {
            console.log(response);

            let ex = new SMXException();
            if (response.StatusCode === 400) {
                // Lỗi nghiệp vụ, trả về trang đang hiển thị
                // throw response.Message;
                ex.Type = ExceptionType.BadRequest;
                ex.Message = response.Message;
            } else if (response.StatusCode === 401) {
                // Lỗi chưa đăng nhập
                //throw "Jumb to login page";
                //ex.Type = ExceptionType.Unauthorized;
                navigate("SrcLogin", null);
            } else if (response.StatusCode === 405) {
                // Lỗi không có quyền truy cập
                //throw "Jumb to home page";
                JumToErrorPage(response.Message);
            } else {
                // 400: Các lỗi khác
                ex.Type = ExceptionType.NotAcceptable;
                ex.Message = response.Message;
            }
            throw ex;
        }
    }
}
