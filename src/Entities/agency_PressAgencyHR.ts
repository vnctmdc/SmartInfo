import adm_Attachment from "./adm_Attachment";

export default class agency_PressAgencyHR {
    public PressAgencyHRID?: number;

    public PressAgencyID?: number;

    public FullName?: string;

    public Position?: string;

    public DOB?: Date;

    public Mobile?: string;

    public Email?: string;

    public Hobby?: string;

    public RelatedInformation?: string;

    public Attitude?: number;

    public Attachment: adm_Attachment = new adm_Attachment();
}
