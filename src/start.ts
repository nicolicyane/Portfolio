import { server } from "./server.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

server.listen(port, host, () =>
  console.log(`Portfolio running at http://${host}:${port}`),
);
