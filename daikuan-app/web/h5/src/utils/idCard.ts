const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

export function isValidChineseIdCard(value: string) {
  const idCardNo = value.trim().toUpperCase()
  if (!/^\d{17}[\dX]$/.test(idCardNo) || idCardNo.startsWith('00')) return false

  const birth = idCardNo.slice(6, 14)
  const year = Number(birth.slice(0, 4))
  const month = Number(birth.slice(4, 6))
  const day = Number(birth.slice(6, 8))
  const birthDate = new Date(year, month - 1, day)
  if (
    year < 1800 ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date()
  ) return false

  const sum = WEIGHTS.reduce((total, weight, index) => total + Number(idCardNo[index]) * weight, 0)
  return CHECK_CODES[sum % 11] === idCardNo[17]
}
