export const sum = (...props: number[]) => {
  return props.reduce((sum: number, num: number) => sum + num, 0)
}
