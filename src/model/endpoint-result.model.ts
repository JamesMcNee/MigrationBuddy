export interface EndpointResult {
  status: IndividualResult<number>;
  responseTime: IndividualResult<number>;
  diff: any;
}

export interface IndividualResult<T> {
  pretty?: string;
  candidate: T;
  control: T;
  metadata?: { [key: string]: any };
}
