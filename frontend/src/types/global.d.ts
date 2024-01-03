export {};

declare global {
  type Nullable<T> = T | null;

  type ValueOf<T> = { [K in keyof T]: T[K] }[keyof T];

  type KeyOf<T> = keyof T;

  type Primitive = string | boolean | number;

  type ApiDataResponse<T> = { data: T };

  type ApiDataNestedResponse<T> = { data: { data: T } };
}
