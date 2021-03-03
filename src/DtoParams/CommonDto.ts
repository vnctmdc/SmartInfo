import adm_Attachment from '../Entities/adm_Attachment';
import { BaseParam } from './BaseParam';

class CommonDto extends BaseParam {
    public Attachment?: adm_Attachment;
    public Attachments?: adm_Attachment[];
    public Filter?: Filter;
}

class Filter {
    public RefID?: number;
    public RefType?: number;
}

export { CommonDto, Filter }