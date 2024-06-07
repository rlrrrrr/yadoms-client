import { KeywordEntity } from '../slices/keywords.slice';

export interface Paging {
  currentPage: number;
  totalPage: number;
  pageSize: number;
}
export interface KeywordsResponse {
  keywords: KeywordEntity[];
  paging: Paging;
}
