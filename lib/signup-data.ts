/** Returns flag emoji for a 2-letter ISO country code (e.g. "us" → 🇺🇸). */
export function getCountryFlagEmoji(code: string): string {
  if (code.length !== 2) return "";
  const a = 0x1f1e6; // Regional Indicator A
  const c1 = code.toUpperCase().charCodeAt(0) - 65;
  const c2 = code.toUpperCase().charCodeAt(1) - 65;
  if (c1 < 0 || c1 > 25 || c2 < 0 || c2 > 25) return "";
  return String.fromCodePoint(a + c1, a + c2);
}

export const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "au", label: "Australia" },
  { value: "sg", label: "Singapore" },
  { value: "hk", label: "Hong Kong" },
  { value: "jp", label: "Japan" },
  { value: "unsupported", label: "Unsupported Country (demo)" },
] as const;

export const UNSUPPORTED_COUNTRY_VALUE = "unsupported";

export const USE_CASES = [
  {
    value: "treasury",
    label: "Treasury & cash management",
    description: "Manage cash, liquidity, and FX",
  },
  {
    value: "payments",
    label: "Payments & remittance",
    description: "Send and receive payments globally",
  },
  {
    value: "crypto",
    label: "Digital assets & crypto",
    description: "Custody, trading, and settlement",
  },
  {
    value: "other",
    label: "Other",
    description: "Explore use cases with our team",
  },
] as const;

export const INCORPORATION_ID_TYPES = [
  { value: "ein", label: "EIN (Employer Identification Number)" },
  { value: "tax_id", label: "Tax ID" },
  { value: "business_registration", label: "Business Registration Number" },
  { value: "company_number", label: "Company Number" },
  { value: "other", label: "Other" },
] as const;

export const BUSINESS_FUNCTIONS = [
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal" },
  { value: "finance", label: "Finance" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
] as const;
