import agency_PressAgencyHR from "../Entities/agency_PressAgencyHR";
import { BaseParam } from "./BaseParam";

export default class ContactsDto extends BaseParam {

    public ListPressAgencyHR?: agency_PressAgencyHR[];

    public PressAgencyHR?: agency_PressAgencyHR;

}