import { BaseFilter } from "./BaseParam";
import ntf_Notification from "../Entities/ntf_Notification";

export class NotifyDto {
    public To?: string;

    public Title?: string;

    public Body?: string;

    public Data: NotifyData = new NotifyData();

    public Filter?: NotifyFilter;

    public LstNotification?: ntf_Notification[];
}

export class NotifyFilter extends BaseFilter {
    public DayNotify?: Date;
    public Take?: number;
}

export class NotifyData {}
