// Valid FFVL licenses - comma separated in environment variable
// For production, set VALID_LICENSES in Vercel project settings

function getValidLicenses(): string[] {
  const env = process.env.VALID_LICENSES || '1234567A,1234567B';
  return env.split(',').map(s => s.trim()).filter(Boolean);
}

const validLicenses = getValidLicenses();

export function isLicenseValid(licenseNumber: string): boolean {
  return validLicenses.includes(licenseNumber);
}