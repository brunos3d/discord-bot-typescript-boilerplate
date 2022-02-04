export function convertArrayToObject<
  T extends { [prop in string | number]: any },
  K extends keyof Pick<
    T,
    {
      [Key in keyof T]: T[Key] extends string | number ? Key : never;
    }[keyof T]
  > = keyof Pick<
    T,
    {
      [Key in keyof T]: T[Key] extends string | number ? Key : never;
    }[keyof T]
  >,
  A extends T[] = T[]
>(array: readonly T[], key: K) {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue) as { [propkey in A[number][K]]: A[number] };
}
