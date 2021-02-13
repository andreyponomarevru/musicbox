import { Request, Response, NextFunction } from "express";
import { Collection } from "./../../types";
import { ReleaseShort } from "./../../model/public/release/ReleaseShort";
import { Track } from "../../model/public/track/Track";

export function sendPaginated(req: Request, res: Response, next: NextFunction) {
  const collection: Collection = res.locals.collection;
  const linkName: string = res.locals.linkName;
  const itemsPerPage: number = res.locals.paginationParams.itemsPerPage;

  const totalPages = Math.ceil(collection.totalCount / itemsPerPage);
  const pageNumber =
    totalPages === 0 ? null : (res.locals.paginationParams.page as number);
  const totalCount = collection.totalCount;
  const prevPage =
    res.locals.paginationParams.page > 1 &&
    res.locals.paginationParams.page <= totalPages
      ? res.locals.paginationParams.page - 1
      : null;
  const nextPage =
    totalPages > res.locals.paginationParams.page
      ? res.locals.paginationParams.page + 1
      : null;
  const firstPage = totalPages > 0 ? 1 : null;
  const lastPage = totalPages > 0 ? totalPages : null;
  const results = (collection.items as []).map(
    (item: ReleaseShort | Track) => item.JSON,
  );

  const nextPageHeader = `</${linkName}?page=${nextPage}&per_page=${res.locals.paginationParams.itemsPerPage}>; rel='next'`;
  const prevPageHeader = `</${linkName}?page=${prevPage}&per_page=${res.locals.paginationParams.itemsPerPage}>; rel='previous'`;
  const lastPageHeader = `</${linkName}?page=${lastPage}&per_page=${res.locals.paginationParams.itemsPerPage}>; rel='last'`;
  const firstPageHeader = `</${linkName}?page=${firstPage}&per_page=${res.locals.paginationParams.itemsPerPage}>; rel='first'`;

  const r = {
    page_number: pageNumber,
    total_pages: totalPages,
    total_count: totalCount,
    previous_page: prevPage ? `/${linkName}?page=${prevPage}` : null,
    next_page: nextPage ? `/${linkName}?page=${nextPage}` : null,
    first_page: firstPage ? `/${linkName}?page=${firstPage}` : null,
    last_page: lastPage ? `/${linkName}?page=${lastPage}` : null,
    results,
  };

  res.set(
    "Link",
    `${nextPageHeader}, ${prevPageHeader}, ${firstPageHeader}, ${lastPageHeader}`,
  );
  res.set("X-Total-Count", `${totalCount}`);
  res.json(r);
}
