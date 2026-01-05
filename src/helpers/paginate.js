import { sql } from 'drizzle-orm';
import { db } from '../../db/db.js';

export async function paginate({
  table,
  select,
  orderBy,
  page = 1,
  page_size = 10,
}) {
  const limit = Number(page_size);
  const offset = (Number(page) - 1) * limit;

  const totalRows = await db
    .select({ count: sql`CAST(count(*) AS INTEGER)` })
    .from(table);

  const total = totalRows[0].count ?? 0;

  const data = await db
    .select(select)
    .from(table)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return {
    data,
    pagination: {
      page: Number(page),
      page_size: limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
}
