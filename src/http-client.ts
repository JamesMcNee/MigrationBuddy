export interface HttpClient {
  get(
    url: string,
    headers: { [key: string]: string } | undefined
  ): Promise<{ status: number; response: { body: { value: any; isJson: boolean } }; responseTime: number }>;
}
