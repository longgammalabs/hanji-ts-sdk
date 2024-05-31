export interface Subscription<TData = unknown> {
  readonly id: number;
  readonly data: TData;
  readonly serializedData: string;

  subscribersCount: number;
}
