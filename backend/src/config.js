const DEFAULT_SERVER = "sqlmisis-prod.public.6273d55d722a.database.windows.net,3342";

function parseSqlServer(value) {
  const input = value?.trim() || DEFAULT_SERVER;
  if (!input.includes(",")) {
    return { host: input, port: 1433 };
  }

  const [host, rawPort] = input.split(",");
  const parsedPort = Number(rawPort);
  return {
    host: host.trim(),
    port: Number.isNaN(parsedPort) ? 1433 : parsedPort,
  };
}

const sqlServer = parseSqlServer(process.env.SQL_SERVER);

export const appConfig = {
  port: Number(process.env.API_PORT || 3001),
  allowedJobsites: [
    "ADMO Mining",
    "ADMO Hauling",
    "SERA",
    "MACO Mining",
    "MACO Hauling",
  ],
  sql: {
    user: process.env.SQL_USER || "dwread",
    password: process.env.SQL_PASSWORD || "dwsis123!",
    database: process.env.SQL_DATABASE || "dwstage",
    server: sqlServer.host,
    port: sqlServer.port,
    options: {
      encrypt: true,
      trustServerCertificate: false,
      enableArithAbort: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
};

