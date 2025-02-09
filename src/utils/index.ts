export function startsWith(str: string, phrase: string) {
  return dcr(str).startsWith(phrase);
}

export function getArrayFromString(str: string, separator: string) {
  return dcr(str).split(separator);
}

// Delete Carriage Return
export function dcr(str: string) {
  return str.replace('\r', '');
}
