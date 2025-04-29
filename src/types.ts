export interface AsyncWorkerClient {
  rst2html(rst: string): Promise<string>
  close(): void
}
