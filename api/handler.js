import { server } from "../dist/server.js";

export default function handler(request, response) {
  const forwarded = new URL(request.url || "/", "https://portfolio.invalid");
  const path = forwarded.searchParams.get("__portfolio_path") || "/";
  forwarded.searchParams.delete("__portfolio_path");
  request.url = `${path}${forwarded.search}`;
  server.emit("request", request, response);
}
