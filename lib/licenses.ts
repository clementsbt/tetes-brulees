// Valid FFVL licenses for the club
// To add more licenses, edit this file or set VALID_LICENSES env var

const DEFAULT_LICENSES = ['1234567A', '1234567B'];

function getValidLicenses(): string[] {
  const env = process.env.VALID_LICENSES;
  if (env) {
    return env.split(',').map(s => s.trim()).filter(Boolean);
  }
  return DEFAULT_LICENSES;
}

let validLicenses: string[] | null = null;

export function isLicenseValid(licenseNumber: string): boolean {
  if (!validLicenses) {
    validLicenses = getValidLicenses();
  }
  return validLicenses.includes(licenseNumber);
}