import adm_Attachment from "./adm_Attachment";

export default class agency_PressAgency {
    public PressAgencyID?: number;

    public Name?: string;

    public EstablishedDTG?: Date;

    public Agency?: string;

    public CertNo?: string;

    public ChiefEditor?: string;

    public Phone?: string;

    public Fax?: string;

    public Email?: string;

    public Address?: string;

    public Attachment: adm_Attachment = new adm_Attachment();
}
