import NegativeNewsResearched from "../Entities/NegativeNewsResearched";
import adm_Attachment from "../Entities/adm_Attachment";

export default class NegativeNewsResearchedDto {

    public NegativeNewsID?: number;

    public ListResearched?: NegativeNewsResearched[];

    public ListAttachment?: adm_Attachment[];

}