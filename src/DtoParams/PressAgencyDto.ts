import agency_PressAgency from "../Entities/agency_PressAgency";
import { BaseFilter, BaseParam } from "./BaseParam";
import agency_PressAgencyHR from "../Entities/agency_PressAgencyHR";
import agency_PressAgencyHRHistory from "../Entities/agency_PressAgencyHRHistory";
import agency_PressAgencyHRRelatives from "../Entities/agency_PressAgencyHRRelatives";
import agency_PressAgencyMeeting from "../Entities/agency_PressAgencyMeeting";
import agency_PressAgencyHistory from "../Entities/agency_PressAgencyHistory";
import agency_RelationsPressAgency from "../Entities/agency_RelationsPressAgency";
import agency_PressAgencyHRAlert from "../Entities/agency_PressAgencyHRAlert";
import adm_Attachment from "../Entities/adm_Attachment";
import agency_RelationshipWithMB from "../Entities/agency_RelationshipWithMB";

export class PressAgencyDto extends BaseParam {
    public Filter?: PressAgencyFilter;
    public Agencies?: agency_PressAgency[];

    public Agency?: agency_PressAgency;

    public LstPressAgencyHR?: agency_PressAgencyHR[];

    public LstPressAgencyHRHistory?: agency_PressAgencyHRHistory[];

    public LstPressAgencyHRRelatives?: agency_PressAgencyHRRelatives[];

    public LstPressAgencyMeeting?: agency_PressAgencyMeeting[];

    public LstAgencyHistory?: agency_PressAgencyHistory[];

    public LstRelationalAgency?: agency_RelationsPressAgency[];

    public LstAgencyHRAlert?: agency_PressAgencyHRAlert[];

    public AgencyHR?: agency_PressAgencyHR;

    public LstOrtherImage?: adm_Attachment[];

    public LstRelationshipWithMB?: agency_RelationshipWithMB[];
}

export class PressAgencyFilter extends BaseFilter {
    public PressAgencyID?: number;
    public PressAgencyHRID?: number;

    public AgencyName?: string;
}
