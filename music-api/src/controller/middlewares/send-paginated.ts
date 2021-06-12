import { Request, Response, NextFunction } from "express";

import { Track } from "../../model/public/track/track";
import { TrackExtended } from "../../model/public/track/track-extended";
import { Release } from "../../model/public/release/release";

interface PaginatedAPIResponse<Results> {
  page_number: number | null;
  total_pages: number;
  total_count: number;
  previous_page: string | null;
  next_page: string | null;
  first_page: string | null;
  last_page: string | null;
  results: Results;
}

export function sendPaginated<Results = Track | TrackExtended | Release>(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //
  // Create JSON response
  //

  const collection = res.locals.collection;
  const link = res.locals.linkName;
  const { page, itemsPerPage } = res.locals.paginationParams;

  const totalPages = Math.ceil(collection.totalCount / itemsPerPage);
  const pageNumber = totalPages === 0 ? null : page;
  const totalCount = collection.totalCount;
  const prevPage = page > 1 && page <= totalPages ? page - 1 : null;
  const nextPage = totalPages > page ? page + 1 : null;
  const firstPage = totalPages > 0 ? 1 : null;
  const lastPage = totalPages > 0 ? totalPages : null;
  const results = collection.items.map(
    (item: Track | TrackExtended | Release) => item.JSON,
  );

  const r = {
    page_number: pageNumber,
    total_pages: totalPages,
    total_count: totalCount,
    previous_page: prevPage ? `/${link}?page=${prevPage}` : null,
    next_page: nextPage ? `/${link}?page=${nextPage}` : null,
    first_page: firstPage ? `/${link}?page=${firstPage}` : null,
    last_page: lastPage ? `/${link}?page=${lastPage}` : null,
    results,
  };

  //
  // Set Link header
  //

  const nextPagePath = `</${link}?page=${nextPage}&per_page=${itemsPerPage}>; rel='next'`;
  const prevPagePath = `</${link}?page=${prevPage}&per_page=${itemsPerPage}>; rel='previous'`;
  const lastPagePath = `</${link}?page=${lastPage}&per_page=${itemsPerPage}>; rel='last'`;
  const firstPagePath = `</${link}?page=${firstPage}&per_page=${itemsPerPage}>; rel='first'`;
  const linkHeader = `${nextPagePath}, ${prevPagePath}, ${firstPagePath}, ${lastPagePath}`;
  res.set("Link", linkHeader);
  res.set("X-Total-Count", `${totalCount}`);

  //

  res.json(r);
}
