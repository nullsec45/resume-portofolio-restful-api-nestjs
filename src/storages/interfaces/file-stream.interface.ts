import * as stream from 'stream';

export interface FileStream {
  stream: stream.Readable;
  contentType: string;
  contentLength: string;
}
