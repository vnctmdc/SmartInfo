import NegativeNews from "../Entities/NegativeNews";
import News from "../Entities/News";
import adm_Attachment from "../Entities/adm_Attachment";
import NegativeNewsResearched from "../Entities/NegativeNewsResearched";
import { BaseFilter } from "./BaseParam";
import { NewsResearched } from "../Entities/NewsResearched";

export default class NegativeNewsDto {

    public NewsID?: number;

    public NegativeNewsID?: number;

    public LstNews?: News[];

    public LstNegativeNews?: NegativeNews[];

    public NegativeNews?: NegativeNews;

    public ListAttachment?: adm_Attachment[];

    public ListResearched?: NegativeNewsResearched[];

    public ListNewsResearched?: NewsResearched[];

    public Filter?: NegativeNewsFilter;

}

export class NegativeNewsFilter extends BaseFilter {
    
}