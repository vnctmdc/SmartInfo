import Comment from "../Entities/Comment";
import { BaseParam, BaseFilter } from "./BaseParam";

class CommentDto extends BaseParam {
    public LstComment?: Comment[];
    public Filter?: CommentFilter;
    public Comment?: Comment;
    public CommentID?: number;

}

class CommentFilter extends BaseFilter {
    public RefID?: number;
    public RefType?: number;
    public Comment?: Comment;

}

export { CommentDto, CommentFilter }