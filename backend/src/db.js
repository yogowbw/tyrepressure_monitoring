import mssql from "mssql";
import { appConfig } from "./config.js";

let poolPromise;

export async function getPool() {
  if (!poolPromise) {
    poolPromise = new mssql.ConnectionPool(appConfig.sql)
      .connect()
      .then((pool) => {
        console.log(
          `[db] Connected to ${appConfig.sql.server}:${appConfig.sql.port}/${appConfig.sql.database}`
        );
        return pool;
      })
      .catch((error) => {
        poolPromise = undefined;
        throw error;
      });
  }

  return poolPromise;
}

export function createRequest(pool, params = {}) {
  const request = pool.request();
  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });
  return request;
}

