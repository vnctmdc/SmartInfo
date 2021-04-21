import adm_Attachment from "./adm_Attachment";

export default class News {
    public NewsID?: number;

    public IncurredDTG?: Date;

    public IncurredText?: string;

    public Name?: string;

    public RatedLevel?: string;

    public Concluded?: string;

    public Status?: number;

    public Type?: number;

    public NegativeType?: number;

    public Classification?: number;

    public Content?: string;

    public OtherNote?: string;

    public CatalogID?: number;

    public AttachmentID?: number;

    public ECMItemID?: string;

    public NumberOfPublish?: number;

    public CatalogName?: string;

    public FileName?: string;

    public ListAttachment?: adm_Attachment[];
    public Attachment?: adm_Attachment;

    public PressAgency?: string;
    public Resolution?: string;
    public ResolutionContent?: string;
    public FromIncurredDTG?: Date;
    public ToIncurredDTG?: Date;
    public SearchText?: string;
}
