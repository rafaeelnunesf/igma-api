export default function generateCpf(withMask = true): string {
  const n1: number = Math.floor(Math.random() * 10);
  const n2: number = Math.floor(Math.random() * 10);
  const n3: number = Math.floor(Math.random() * 10);
  const n4: number = Math.floor(Math.random() * 10);
  const n5: number = Math.floor(Math.random() * 10);
  const n6: number = Math.floor(Math.random() * 10);
  const n7: number = Math.floor(Math.random() * 10);
  const n8: number = Math.floor(Math.random() * 10);
  const n9: number = Math.floor(Math.random() * 10);
  const d1: number =
    n9 * 2 +
    n8 * 3 +
    n7 * 4 +
    n6 * 5 +
    n5 * 6 +
    n4 * 7 +
    n3 * 8 +
    n2 * 9 +
    n1 * 10;
  const d1rest: number = d1 % 11;
  const digit1: number = d1rest < 2 ? 0 : 11 - d1rest;
  const d2: number =
    digit1 * 2 +
    n9 * 3 +
    n8 * 4 +
    n7 * 5 +
    n6 * 6 +
    n5 * 7 +
    n4 * 8 +
    n3 * 9 +
    n2 * 10 +
    n1 * 11;
  const d2rest: number = d2 % 11;
  const digit2: number = d2rest < 2 ? 0 : 11 - d2rest;
  const cpf = `${n1}${n2}${n3}${withMask ? '.' : ''}${n4}${n5}${n6}${
    withMask ? '.' : ''
  }${n7}${n8}${n9}${withMask ? '-' : ''}${digit1}${digit2}`;
  return cpf;
}
