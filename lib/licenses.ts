// Hardcoded valid licenses for the Têtes Brûlées club
// To add more: edit this file and push

const VALID_LICENSES = ['1234567A', '1234567B'];

export function isLicenseValid(licenseNumber: string): boolean {
  return VALID_LICENSES.includes(licenseNumber);
}