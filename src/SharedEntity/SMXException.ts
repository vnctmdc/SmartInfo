class SMXException {
    public Type?: ExceptionType;
    public Message?: string;
}

enum ExceptionType {
    PostFailed = 1,
    GetFailed = 2,
    BadRequest = 3,
    Unauthorized = 4,
    NotAcceptable = 5,
}

const ClientMessage = (mess) => {
    let ex = new SMXException();
    ex.Type = ExceptionType.BadRequest;
    ex.Message = mess;
    return ex;
};

export { SMXException, ExceptionType, ClientMessage };
