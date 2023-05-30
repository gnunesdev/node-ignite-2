import http from "node:http";
import { Transform } from "node:stream";

class InverseStream extends Transform {
  _transform(chunk, encoding, callback) {
    const inverse = Number(chunk.toString() * -1);

    console.log(inverse);

    callback(null, Buffer.from(String(inverse)));
  }
}

const server = http.createServer(async (req, res) => {
  const buffer = [];

  for await (const chunk of req) {
    buffer.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buffer).toString();

  console.log(fullStreamContent);

  return res.end(fullStreamContent);
});

server.listen(3334);
