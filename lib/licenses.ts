// Valid FFVL licenses - add new codes here or use environment variable
const VALID_LICENSES = process.env.VALID_LICENSES 
  ? process.env.VALID_LICENSES.split(',')
  : [];

// Also track used licenses in memory (for this session)
// In production, use a database or environment variable
const usedLicenses = new Set<string>();

export function isLicenseValid(licenseNumber: string): boolean {
  // Check if it's in VALID_LICENSES env var and not used yet
  return VALID_LICENSES.includes(licenseNumber) && !usedLicenses.has(licenseNumber);
}

export function markLicenseUsed(licenseNumber: string): void {
  usedLicenses.add(licenseNumber);
}

export function addValidLicense(licenseNumber: string): void {
  if (!VALID_LICENSES.includes(licenseNumber)) {
    VALID_LICENSES.push(licenseNumber);
  }
}

export function isLicenseUsed(licenseNumber: string): boolean {
  return usedLicenses.has(licenseNumber);
}