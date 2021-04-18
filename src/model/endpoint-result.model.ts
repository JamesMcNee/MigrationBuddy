export interface EndpointResult {
  actualPath: IndividualResult<string>;
  status: IndividualResult<number>;
  responseTime: IndividualResult<number>;
  responseBody: IndividualResult<any>;
}

export interface IndividualResult<T> {
  pretty?: string;
  control: T;
  candidate: T;
  match: boolean;
  metadata?: { [key: string]: any };
}
