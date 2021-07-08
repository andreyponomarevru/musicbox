import { Request, Response, NextFunction } from "express";

export function sendPaginated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  //
  // Prepare JSON response
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
    (item: { JSON: () => Record<string, unknown> }) => item.JSON,
  );

  const r = {
    pageNumber: pageNumber,
    totalPages: totalPages,
    totalCount: totalCount,
    previousPage: prevPage ? `/${link}?page=${prevPage}` : null,
    nextPage: nextPage ? `/${link}?page=${nextPage}` : null,
    firstPage: firstPage ? `/${link}?page=${firstPage}` : null,
    lastPage: lastPage ? `/${link}?page=${lastPage}` : null,
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
