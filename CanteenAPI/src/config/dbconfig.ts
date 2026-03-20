import * as sql from "mssql";
import {
  ConnectionPool,
  config as SqlConfig,
  IResult,
  IProcedureResult,
} from "mssql";

/* =====================================================
   MSSQL CONFIG
===================================================== */

const sqlConfig: SqlConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PWD as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_HOST as string,  
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,               // true for Azure
    trustServerCertificate: true // true for local dev
  },
};

/* =====================================================
   CONNECTION POOL (SINGLETON)
===================================================== */

let poolPromise: Promise<ConnectionPool> | null = null;

/**
 * Get or create MSSQL connection pool
 */
export async function getDbPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql
      .connect(sqlConfig)
      .then((pool: ConnectionPool) => {
        //console.log("✅ MSSQL database connected");
        return pool;
      })
      .catch((err: unknown) => {
        console.error("❌ MSSQL connection failed:", err);
        poolPromise = null;
        throw err;
      });
  }

  return poolPromise;
}

/* =====================================================
   TYPES
===================================================== */

export interface SqlParam {
  name: string;
  value: any;
}

/* =====================================================
   EXECUTE RAW QUERY
===================================================== */

export async function executeQuery<T = any>(
  query: string,
  params: SqlParam[] = []
): Promise<T[]> {
  const pool = await getDbPool();
  const request = pool.request();

  params.forEach((param) => {
    request.input(param.name, param.value);
  });

  const result: IResult<T> = await request.query(query);
  return result.recordset;
}

/* =====================================================
   EXECUTE STORED PROCEDURE (SINGLE RESULT SET)
===================================================== */

export async function executeStoredProcedure<T = any>(
  spName: string,
  params: SqlParam[] = []
): Promise<T[]> {
  const pool = await getDbPool();
  const request = pool.request();

  params.forEach((param) => {
    request.input(param.name, param.value);
  });

  const result: IProcedureResult<T> =
    await request.execute(spName);

  return result.recordset;
}

/* =====================================================
   EXECUTE STORED PROCEDURE (MULTIPLE RESULT SETS)
===================================================== */

export async function executeStoredProcedureMultipleResult<T = any>(
  spName: string,
  params: SqlParam[] = []
): Promise<T[][]> {
  const pool = await getDbPool();
  const request = pool.request();

  params.forEach((param) => {
    request.input(param.name, param.value);
  });

  const result: IProcedureResult<T> =
    await request.execute(spName);

  return result.recordsets as T[][];
}
