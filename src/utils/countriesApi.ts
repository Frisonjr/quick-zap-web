export interface CountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  cca2: string;
  cca3: string;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
  flagSvg?: string;
  flagPng?: string;
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    
    const data: CountryApiResponse[] = await response.json();
    
    return data
      .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
      .map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: getCountryFlagEmoji(country.cca2),
        phoneCode: country.idd.root + (country.idd.suffixes[0] || ''),
        flagSvg: country.flags.svg,
        flagPng: country.flags.png,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return fallback data if API fails
    return getFallbackCountries();
  }
}

// Function to get flag emoji from country code
function getCountryFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Fallback countries data in case API fails
function getFallbackCountries(): Country[] {
  return [
    { name: "Afghanistan", code: "AF", flag: "🇦🇫", phoneCode: "+93" },
    { name: "Albania", code: "AL", flag: "🇦🇱", phoneCode: "+355" },
    { name: "Algeria", code: "DZ", flag: "🇩🇿", phoneCode: "+213" },
    { name: "Argentina", code: "AR", flag: "🇦🇷", phoneCode: "+54" },
    { name: "Armenia", code: "AM", flag: "🇦🇲", phoneCode: "+374" },
    { name: "Australia", code: "AU", flag: "🇦🇺", phoneCode: "+61" },
    { name: "Austria", code: "AT", flag: "🇦🇹", phoneCode: "+43" },
    { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", phoneCode: "+994" },
    { name: "Bahrain", code: "BH", flag: "🇧🇭", phoneCode: "+973" },
    { name: "Bangladesh", code: "BD", flag: "🇧🇩", phoneCode: "+880" },
    { name: "Belarus", code: "BY", flag: "🇧🇾", phoneCode: "+375" },
    { name: "Belgium", code: "BE", flag: "🇧🇪", phoneCode: "+32" },
    { name: "Bolivia", code: "BO", flag: "🇧🇴", phoneCode: "+591" },
    { name: "Brazil", code: "BR", flag: "🇧🇷", phoneCode: "+55" },
    { name: "Bulgaria", code: "BG", flag: "🇧🇬", phoneCode: "+359" },
    { name: "Cambodia", code: "KH", flag: "🇰🇭", phoneCode: "+855" },
    { name: "Canada", code: "CA", flag: "🇨🇦", phoneCode: "+1" },
    { name: "Chile", code: "CL", flag: "🇨🇱", phoneCode: "+56" },
    { name: "China", code: "CN", flag: "🇨🇳", phoneCode: "+86" },
    { name: "Colombia", code: "CO", flag: "🇨🇴", phoneCode: "+57" },
    { name: "Costa Rica", code: "CR", flag: "🇨🇷", phoneCode: "+506" },
    { name: "Croatia", code: "HR", flag: "🇭🇷", phoneCode: "+385" },
    { name: "Czech Republic", code: "CZ", flag: "🇨🇿", phoneCode: "+420" },
    { name: "Denmark", code: "DK", flag: "🇩🇰", phoneCode: "+45" },
    { name: "Dominican Republic", code: "DO", flag: "🇩🇴", phoneCode: "+1" },
    { name: "Ecuador", code: "EC", flag: "🇪🇨", phoneCode: "+593" },
    { name: "Egypt", code: "EG", flag: "🇪🇬", phoneCode: "+20" },
    { name: "El Salvador", code: "SV", flag: "🇸🇻", phoneCode: "+503" },
    { name: "Estonia", code: "EE", flag: "🇪🇪", phoneCode: "+372" },
    { name: "Finland", code: "FI", flag: "🇫🇮", phoneCode: "+358" },
    { name: "France", code: "FR", flag: "🇫🇷", phoneCode: "+33" },
    { name: "Georgia", code: "GE", flag: "🇬🇪", phoneCode: "+995" },
    { name: "Germany", code: "DE", flag: "🇩🇪", phoneCode: "+49" },
    { name: "Ghana", code: "GH", flag: "🇬🇭", phoneCode: "+233" },
    { name: "Greece", code: "GR", flag: "🇬🇷", phoneCode: "+30" },
    { name: "Guatemala", code: "GT", flag: "🇬🇹", phoneCode: "+502" },
    { name: "Honduras", code: "HN", flag: "🇭🇳", phoneCode: "+504" },
    { name: "Hong Kong", code: "HK", flag: "🇭🇰", phoneCode: "+852" },
    { name: "Hungary", code: "HU", flag: "🇭🇺", phoneCode: "+36" },
    { name: "Iceland", code: "IS", flag: "🇮🇸", phoneCode: "+354" },
    { name: "India", code: "IN", flag: "🇮🇳", phoneCode: "+91" },
    { name: "Indonesia", code: "ID", flag: "🇮🇩", phoneCode: "+62" },
    { name: "Ireland", code: "IE", flag: "🇮🇪", phoneCode: "+353" },
    { name: "Israel", code: "IL", flag: "🇮🇱", phoneCode: "+972" },
    { name: "Italy", code: "IT", flag: "🇮🇹", phoneCode: "+39" },
    { name: "Japan", code: "JP", flag: "🇯🇵", phoneCode: "+81" },
    { name: "Jordan", code: "JO", flag: "🇯🇴", phoneCode: "+962" },
    { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", phoneCode: "+7" },
    { name: "Kenya", code: "KE", flag: "🇰🇪", phoneCode: "+254" },
    { name: "Kuwait", code: "KW", flag: "🇰🇼", phoneCode: "+965" },
    { name: "Latvia", code: "LV", flag: "🇱🇻", phoneCode: "+371" },
    { name: "Lebanon", code: "LB", flag: "🇱🇧", phoneCode: "+961" },
    { name: "Lithuania", code: "LT", flag: "🇱🇹", phoneCode: "+370" },
    { name: "Luxembourg", code: "LU", flag: "🇱🇺", phoneCode: "+352" },
    { name: "Malaysia", code: "MY", flag: "🇲🇾", phoneCode: "+60" },
    { name: "Mexico", code: "MX", flag: "🇲🇽", phoneCode: "+52" },
    { name: "Morocco", code: "MA", flag: "🇲🇦", phoneCode: "+212" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱", phoneCode: "+31" },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿", phoneCode: "+64" },
    { name: "Nigeria", code: "NG", flag: "🇳🇬", phoneCode: "+234" },
    { name: "Norway", code: "NO", flag: "🇳🇴", phoneCode: "+47" },
    { name: "Pakistan", code: "PK", flag: "🇵🇰", phoneCode: "+92" },
    { name: "Panama", code: "PA", flag: "🇵🇦", phoneCode: "+507" },
    { name: "Paraguay", code: "PY", flag: "🇵🇾", phoneCode: "+595" },
    { name: "Peru", code: "PE", flag: "🇵🇪", phoneCode: "+51" },
    { name: "Philippines", code: "PH", flag: "🇵🇭", phoneCode: "+63" },
    { name: "Poland", code: "PL", flag: "🇵🇱", phoneCode: "+48" },
    { name: "Portugal", code: "PT", flag: "🇵🇹", phoneCode: "+351" },
    { name: "Qatar", code: "QA", flag: "🇶🇦", phoneCode: "+974" },
    { name: "Romania", code: "RO", flag: "🇷🇴", phoneCode: "+40" },
    { name: "Russia", code: "RU", flag: "🇷🇺", phoneCode: "+7" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", phoneCode: "+966" },
    { name: "Singapore", code: "SG", flag: "🇸🇬", phoneCode: "+65" },
    { name: "Slovakia", code: "SK", flag: "🇸🇰", phoneCode: "+421" },
    { name: "Slovenia", code: "SI", flag: "🇸🇮", phoneCode: "+386" },
    { name: "South Africa", code: "ZA", flag: "🇿🇦", phoneCode: "+27" },
    { name: "South Korea", code: "KR", flag: "🇰🇷", phoneCode: "+82" },
    { name: "Spain", code: "ES", flag: "🇪🇸", phoneCode: "+34" },
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰", phoneCode: "+94" },
    { name: "Sweden", code: "SE", flag: "🇸🇪", phoneCode: "+46" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭", phoneCode: "+41" },
    { name: "Taiwan", code: "TW", flag: "🇹🇼", phoneCode: "+886" },
    { name: "Thailand", code: "TH", flag: "🇹🇭", phoneCode: "+66" },
    { name: "Turkey", code: "TR", flag: "🇹🇷", phoneCode: "+90" },
    { name: "Ukraine", code: "UA", flag: "🇺🇦", phoneCode: "+380" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", phoneCode: "+971" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", phoneCode: "+44" },
    { name: "United States", code: "US", flag: "🇺🇸", phoneCode: "+1" },
    { name: "Uruguay", code: "UY", flag: "🇺🇾", phoneCode: "+598" },
    { name: "Venezuela", code: "VE", flag: "🇻🇪", phoneCode: "+58" },
    { name: "Vietnam", code: "VN", flag: "🇻🇳", phoneCode: "+84" },
  ];
}
