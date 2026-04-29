// Hardcoded valid licenses for the Têtes Brûlées club
const VALID_LICENSES = ['1234567A', '1234567B', '1234567C'];

export function isLicenseValid(licenseNumber: string): boolean {
  return VALID_LICENSES.includes(licenseNumber);
}