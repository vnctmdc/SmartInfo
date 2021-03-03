import News from "../Entities/News";
import { BaseParam, BaseFilter } from "./BaseParam";
import PositiveNews from "../Entities/PositiveNews";
import CampaignNews from "../Entities/CampaignNews";
import adm_Attachment from "../Entities/adm_Attachment";

export class NewsDto extends BaseParam {
    public LstNews?: News[];

    public NewsInfo?: News;

    public Filter?: NewsFilter;

    public PositiveNews?: News[];

    public NegativeNews?: News[];

    public LstPositiveNews?: PositiveNews[];

    public LstCampaignNews?: CampaignNews[];

    public LstAttachment?: adm_Attachment[];
}

export class NewsFilter extends BaseFilter {
    public NewsID?: number;
}
