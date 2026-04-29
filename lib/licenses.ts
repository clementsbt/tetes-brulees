// Valid FFVL licenses - add codes via VALID_LICENSES env var (comma separated)
// Format: VALID_LICENSES=licence1,licence2,licence3
const VALID_LICENSES = process.env.VALID_LICENSES?.split(',').map(s => s.trim()).filter(Boolean) || [];

export function isLicenseValid(licenseNumber: string): boolean {
  return VALID_LICENSES.includes(licenseNumber);
}