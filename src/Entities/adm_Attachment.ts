class adm_Attachment{

    public  AttachmentID?: number;

    public FileName?: string;

    public RefID?: number;

    public RefType?: number;

    public Status?: number;

    public Description?: string;

    public CreatedBy?: string;

    public CreatedDTG?: Date;

    public UpdatedBy?: string;

    public UpdatedDTG?: Date;

    public RefCode?: string;

    public FileSize?: number;

    public DisplayName?: string;

    public ContentType?: string;

    public ECMItemID?: string;

    public CustomerIDCard?: string;

    public DocumentCode?: string;

    public DocumentName?: string;

    public ActionValidateValuationDocumentDetailID?: number;

    public IsDocumentTypeRequestedAddDoc?: boolean;

    public IsUploaded?: boolean;

    public RequireLevel?: number;

    public ListMortgageAssetID?: Array<number>;

    public FullNameCreateBy?: string;

    public MortgageAssetCode?: string;

    public MortgageAssetID?: number;

    public MortgageAssetSpecification?: string;

    public MortgageAssetCode1Code?: string;

    public MortgegAssetOwnerIDCard?: string;

    public FileURL?: string;

    public IsAllowDelete?: boolean;

    public ValuationDocumentID?: number;

    public ProcessValuationDocumentID?: number;

    public LevelName?: string;

    public CreateDTGString?: string;

    public AttachmentURL: string;
    
    public SummaryName: string;

    public ImageBase64String: string;
    
}
export default adm_Attachment;