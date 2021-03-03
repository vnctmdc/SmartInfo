import { observable, action, runInAction, computed, IObservableValue } from "mobx";
import { SMXException } from "../SharedEntity/SMXException";

export default class GlobalStore {
    @observable Exception?: SMXException;

    @observable IsLoading?: boolean;

    @observable UpdatedStatusTrigger?: any;

    @observable UpdatedStatusTriggerDSAll?: any;

    @observable ProcessValuationDocumentID?: number;

    @observable IsHasNotification?: any;

    @observable UpdateImageTrigger?: any;

    // Bật loading
    @action ShowLoading() {
        this.IsLoading = true;
    }

    // Tắt loading
    @action HideLoading() {
        this.IsLoading = false;
    }

    @action HandleException = (ex?: SMXException) => {
        this.Exception = ex;
    };
}
