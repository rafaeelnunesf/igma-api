export default function cpfValidation(cpf: string): boolean {
  // Remove all non-numeric characters from the input string
  const numbersCpf = cpf.replace(/\D/g, '');

  // CPF must be exactly 11 digits long
  if (numbersCpf.length !== 11) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(numbersCpf.charAt(i)) * (10 - i);

  let remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  if (parseInt(numbersCpf.charAt(9)) !== remainder) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(numbersCpf.charAt(i)) * (11 - i);

  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  if (parseInt(numbersCpf.charAt(10)) !== remainder) return false;

  return true;
}
