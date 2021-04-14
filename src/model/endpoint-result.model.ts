export interface EndpointResult {
  status: IndividualResult<number>;
  responseTime: IndividualResult<number>;
  responseBody: IndividualResult<any>;
}

export interface IndividualResult<T> {
  pretty?: string;
  candidate: T;
  control: T;
  match: boolean;
  metadata?: { [key: string]: any };
}
