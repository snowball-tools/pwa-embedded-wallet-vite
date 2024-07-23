import * as BufferGlobal from 'buffer';

declare global {
  var Buffer: typeof BufferGlobal.Buffer;
}

export {};