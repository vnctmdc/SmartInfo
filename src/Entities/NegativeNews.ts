import adm_Attachment from "./adm_Attachment";

export default class NegativeNews {
    public NegativeNewsID?: number;
    public NewsID?: number;
    public IncurredDTG?: Date;
    public PressAgencyID?: number;
    public OtherChannelName?: string;
    public Content?: string;
    public Judged?: string;
    public MethodHandle?: string;
    public Result?: string;
    public Status?: number;
    public Url?: string;
    public ReporterInformation?: string;
    public PressAgencyReview?: string;
    public Question?: string;
    public QuestionDetail?: string;
    public Resolution?: string;
    public ResolutionContent?: string;
    public Note?: string;
    public Place?: string;
    public Type?: number;
    public Name?: string;
    public Title?: string;
    public PressAgencyName?: string;
    public Attachment: adm_Attachment;
    public AttachmentID: number;
    public ECMItemID: number;
    public FileName: string;
    public FromIncurredDTG?: Date;
    public ToIncurredDTG?: Date;
    public SearchText?: string;

}