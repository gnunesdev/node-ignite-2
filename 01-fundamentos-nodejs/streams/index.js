import { Readable, Transform, Writable } from "node:stream";

//req -> ReadableStream
//res -> WritableStream

class OneToHundreadStream extends Readable {
  index = 1;

  _read() {
    setTimeout(() => {
      const i = this.index++;

      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 1000);
  }
}

class InverseStream extends Transform {
  _transform(chunk, encoding, callback) {
    const inverse = Number(chunk.toString() * -1);
    callback(null, Buffer.from(String(inverse)));
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundreadStream()
  .pipe(new InverseStream())
  .pipe(new MultiplyByTenStream());
