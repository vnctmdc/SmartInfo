import EnvConfig from "../Utils/EnvConfig";

class ApiUrl {
    // Service dùng chung mức hệ thống
    static Global_GetVersion_Api = EnvConfig.getApiHost() + "/api/Global/GetAppInfomation";

    // Authentication
    static Authentication_Login = EnvConfig.getApiHost() + "/api/Authentication/Login";
    static Authentication_Logout = EnvConfig.getApiHost() + "/api/Authentication/Logout";

    //StorePriceStandardREResidential
    static StorePriceStandardREResidential_ExecuteStorePriceStandardREResidential =
        EnvConfig.getApiHost() + "/api/StorePriceStandardREResidential/ExecuteStorePriceStandardREResidential";

    // google api
    static GoogleApiKey = "AIzaSyBH9asRxO8HBTrQZfcc5iQHUAaxbCqLl3U";
    static GoogleApiKeyAndroid = "AIzaSyDTGz8M-Sci70UL8RpnUfrWpbbr6rZY_As";
    static GoogleApiKeyIos = "AIzaSyBLceFu9fgncT-AOiopiNDD0IKnFPguCms";
    static GoogleGeocodeApi = "https://maps.googleapis.com/maps/api/geocode/json";

    // SystemParameter
    static Global_GetSystemParamNameByID = EnvConfig.getApiHost() + "/api/Global/GetSystemParamNameByID";
    static Global_GetSystemParam = EnvConfig.getApiHost() + "/api/Global/GetSystemParam";
    static Global_GetByFeatureID = EnvConfig.getApiHost() + "/api/Global/GetByFeatureID";
    static Global_GetByFeatureIDAndExt1i = EnvConfig.getApiHost() + "/api/Global/GetByFeatureIDAndExt1i";
    static Global_LogError = EnvConfig.getApiHost() + "/api/Global/LogError";

    static Attachment_ImagePreview = EnvConfig.getApiHost() + "/AttachmentImageViewer.ashx";

    static Common_ExecuteAttachment = EnvConfig.getApiHost() + "/api/AttachmentController/ExecuteAttachment";

    // chart
    static Home_ChartPiePVD = EnvConfig.getApiHost() + "/Chart/Home.aspx";

    static PDFViewer = EnvConfig.getApiHost() + "/ProcessValuationDocumentPdfViewer.ashx";

    static News_ExecuteNews = EnvConfig.getApiHost() + "/api/News/ExecuteNews";
    static NegativeNews_ExecuteNegativeNews = EnvConfig.getApiHost() + "/api/NegativeNews/ExecuteNegativeNews";
    static PressAgency_ExecutePressAgency = EnvConfig.getApiHost() + "/api/PressAgency/ExecutePressAgency";
    static NegativeNewsResearched_ExecuteNegativeNewsResearched =
        EnvConfig.getApiHost() + "/api/NegativeNewsResearched/ExecuteNegativeNewsResearched";

    static PostExpoNotificationToken = EnvConfig.getApiHost() + "/api/devicetoken/ExecuteDeviceToken";

    static Notification_ExecuteNotification = EnvConfig.getApiHost() + "/api/notification/ExecuteNotification";

    static Comment_ExecuteComment = EnvConfig.getApiHost() + "/api/comment/Execute";
}

export default ApiUrl;
