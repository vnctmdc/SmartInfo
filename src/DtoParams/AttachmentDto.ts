import adm_Attachment from "../Entities/adm_Attachment";

export class AttachmentDto {
    public AttachmentID?: number;
    public Attachment?: adm_Attachment;
    public Attachments?: adm_Attachment[];
    public Filter?: Filter;
}

export class Filter {
    public RefID?: number;
    public RefType?: number;
}
