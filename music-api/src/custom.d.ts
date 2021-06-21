import { Pagination } from "./controller/middlewares/parse-pagination-params";
import { Sort } from "./controller/middlewares/parse-sort-params";
import { Release } from "./model/public/release/release";
import { TrackExtended } from "./model/public/track/track-extended";
import { Track } from "./model/public/track/track";

declare module "express" {
  export interface Response {
    locals: Pagination<Release | Track | TrackExtended> & Sort;
  }
}
