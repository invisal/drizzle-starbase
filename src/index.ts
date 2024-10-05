import {
  type RemoteCallback,
  type AsyncBatchRemoteCallback,
} from "drizzle-orm/sqlite-proxy";

export function starbase(
  url: string,
  token: string
): [RemoteCallback, AsyncBatchRemoteCallback] {
  const singleQueryHandler: RemoteCallback = async (sql, params, method) => {
    const rawResponse = await fetch(`${url}/query/raw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!rawResponse.ok) {
      throw new Error("Unexpected error");
    }

    const result: { result: { rows: unknown[][] } } = await rawResponse.json();

    return {
      rows: method === "get" ? result.result.rows[0] : result.result.rows,
    };
  };

  const batchQueryHandler: AsyncBatchRemoteCallback = async (
    queries: {
      sql: string;
      params: any[];
      method: "all" | "run" | "get" | "values";
    }[]
  ) => {
    const rawResponse = await fetch(`${url}/query/raw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transaction: queries }),
    });

    if (!rawResponse.ok) {
      throw new Error("Unexpected error");
    }

    const result: { result: { rows: unknown[][] }[] } =
      await rawResponse.json();

    return queries.map(({ method }, queryIdx) => {
      return {
        rows:
          method === "get"
            ? result.result[queryIdx].rows[0]
            : result.result[queryIdx].rows,
      };
    });
  };

  return [singleQueryHandler, batchQueryHandler];
}
