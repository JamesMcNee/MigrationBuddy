export interface HttpClient {
    get(url: string, headers: { [key: string]: string } | undefined): Promise<{ status: number, body: any, responseTime: number }>;
}