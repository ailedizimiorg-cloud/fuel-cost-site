import os
import time
import pandas as pd
import requests
from supabase import create_client, Client
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
import io

try:
    from eia import API as EIA_API
except ImportError:
    print("❌ 'eia-python' kütüphanesi eksik. Lütfen 'scraper/venv/bin/pip install eia-python' ile yükleyin.")
    exit()

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
EIA_API_KEY = os.getenv("EIA_API_KEY")

THEGLOBALEconomy_API_KEY = os.getenv("THEGLOBALEconomy_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    print("❌ .env dosyasında SUPABASE_URL veya SUPABASE_SERVICE_KEY eksik!")
    exit()

if not EIA_API_KEY:
    print("⚠️ EIA_API_KEY eksik! EIA entegrasyonu atlanacak.")

if not THEGLOBALEconomy_API_KEY:
    print("⚠️ THEGLOBALEconomy_API_KEY eksik! Simülasyon (Mock) modu aktif edilecek.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ISO Country Code to Currency Code Mapping Dictionary
country_to_currency = {
    'AD': 'EUR', 'AE': 'AED', 'AF': 'AFN', 'AG': 'XCD', 'AI': 'XCD', 'AL': 'ALL', 'AM': 'AMD', 'AO': 'AOA', 'AR': 'ARS', 'AS': 'USD', 'AT': 'EUR', 'AU': 'AUD', 'AW': 'AWG', 'AX': 'EUR', 'AZ': 'AZN',
    'BA': 'BAM', 'BB': 'BBD', 'BD': 'BDT', 'BE': 'EUR', 'BF': 'XOF', 'BG': 'BGN', 'BH': 'BHD', 'BI': 'BIF', 'BJ': 'XOF', 'BL': 'EUR', 'BM': 'BMD', 'BN': 'BND', 'BO': 'BOB', 'BQ': 'USD', 'BR': 'BRL',
    'BS': 'BSD', 'BT': 'BTN', 'BV': 'NOK', 'BW': 'BWP', 'BY': 'BYN', 'BZ': 'BZD', 'CA': 'CAD', 'CC': 'AUD', 'CD': 'CDF', 'CF': 'XAF', 'CG': 'XAF', 'CH': 'CHF', 'CI': 'XOF', 'CK': 'NZD', 'CL': 'CLP',
    'CM': 'XAF', 'CN': 'CNY', 'CO': 'COP', 'CR': 'CRC', 'CU': 'CUP', 'CV': 'CVE', 'CW': 'ANG', 'CX': 'AUD', 'CY': 'EUR', 'CZ': 'CZK', 'DE': 'EUR', 'DJ': 'DJF', 'DK': 'DKK', 'DM': 'XCD', 'DO': 'DOP',
    'DZ': 'DZD', 'EC': 'USD', 'EE': 'EUR', 'EG': 'EGP', 'EH': 'MAD', 'ER': 'ERN', 'ES': 'EUR', 'ET': 'ETB', 'FI': 'EUR', 'FJ': 'FJD', 'FK': 'FKP', 'FM': 'USD', 'FO': 'DKK', 'FR': 'EUR', 'GA': 'XAF',
    'GB': 'GBP', 'GD': 'XCD', 'GE': 'GEL', 'GF': 'EUR', 'GG': 'GBP', 'GH': 'GHS', 'GI': 'GIP', 'GL': 'DKK', 'GM': 'GMD', 'GN': 'GNF', 'GP': 'EUR', 'GQ': 'XAF', 'GR': 'EUR', 'GS': 'GBP', 'GT': 'GTQ',
    'GU': 'USD', 'GW': 'XOF', 'GY': 'GYD', 'HK': 'HKD', 'HM': 'AUD', 'HN': 'HNL', 'HR': 'EUR', 'HT': 'HTG', 'HU': 'HUF', 'ID': 'IDR', 'IE': 'EUR', 'IL': 'ILS', 'IM': 'GBP', 'IN': 'INR', 'IO': 'USD',
    'IQ': 'IQD', 'IR': 'IRR', 'IS': 'ISK', 'IT': 'EUR', 'JE': 'GBP', 'JM': 'JMD', 'JO': 'JOD', 'JP': 'JPY', 'KE': 'KES', 'KG': 'KGS', 'KH': 'KHR', 'KI': 'AUD', 'KM': 'KMF', 'KN': 'XCD', 'KP': 'KPW',
    'KR': 'KRW', 'KW': 'KWD', 'KY': 'KYD', 'KZ': 'KZT', 'LA': 'LAK', 'LB': 'LBP', 'LC': 'XCD', 'LI': 'CHF', 'LK': 'LKR', 'LR': 'LRD', 'LS': 'LSL', 'LT': 'EUR', 'LU': 'EUR', 'LV': 'EUR', 'LY': 'LYD',
    'MA': 'MAD', 'MC': 'EUR', 'MD': 'MDL', 'ME': 'EUR', 'MF': 'EUR', 'MG': 'MGA', 'MH': 'USD', 'MK': 'MKD', 'ML': 'XOF', 'MM': 'MMK', 'MN': 'MNT', 'MO': 'MOP', 'MP': 'USD', 'MQ': 'EUR', 'MR': 'MRU',
    'MS': 'XCD', 'MT': 'EUR', 'MU': 'MUR', 'MV': 'MVR', 'MW': 'MWK', 'MX': 'MXN', 'MY': 'MYR', 'MZ': 'MZN', 'NA': 'NAD', 'NC': 'XPF', 'NE': 'XOF', 'NF': 'AUD', 'NG': 'NGN', 'NI': 'NIO', 'NL': 'EUR',
    'NO': 'NOK', 'NP': 'NPR', 'NR': 'AUD', 'NU': 'NZD', 'NZ': 'NZD', 'OM': 'OMR', 'PA': 'PAB', 'PE': 'PEN', 'PF': 'XPF', 'PG': 'PGK', 'PH': 'PHP', 'PK': 'PKR', 'PL': 'PLN', 'PM': 'EUR', 'PN': 'NZD',
    'PR': 'USD', 'PS': 'ILS', 'PT': 'EUR', 'PW': 'USD', 'PY': 'PYG', 'QA': 'QAR', 'RE': 'EUR', 'RO': 'RON', 'RS': 'RSD', 'RU': 'RUB', 'RW': 'RWF', 'SA': 'SAR', 'SB': 'SBD', 'SC': 'SCR', 'SD': 'SDG',
    'SE': 'SEK', 'SG': 'SGD', 'SH': 'SHP', 'SI': 'EUR', 'SJ': 'NOK', 'SK': 'EUR', 'SL': 'SLL', 'SM': 'EUR', 'SN': 'XOF', 'SO': 'SOS', 'SR': 'SRD', 'SS': 'SSP', 'ST': 'STN', 'SV': 'USD', 'SX': 'ANG',
    'SY': 'SYP', 'SZ': 'SZL', 'TC': 'USD', 'TD': 'XAF', 'TF': 'EUR', 'TG': 'XOF', 'TH': 'THB', 'TJ': 'TJS', 'TK': 'NZD', 'TL': 'USD', 'TM': 'TMT', 'TN': 'TND', 'TO': 'TOP', 'TR': 'TRY', 'TT': 'TTD',
    'TV': 'AUD', 'TW': 'TWD', 'TZ': 'TZS', 'UA': 'UAH', 'UG': 'UGX', 'UM': 'USD', 'US': 'USD', 'UY': 'UYU', 'UZ': 'UZS', 'VA': 'EUR', 'VC': 'XCD', 'VE': 'VES', 'VG': 'USD', 'VI': 'USD', 'VN': 'VND',
    'VU': 'VUV', 'WF': 'XPF', 'WS': 'WST', 'YE': 'YER', 'YT': 'EUR', 'ZA': 'ZAR', 'ZM': 'ZMW', 'ZW': 'ZWL'
}

# Currency Code to Symbol Mapping Dictionary
currency_symbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥', 'TRY': '₺', 'RUB': '₽', 'INR': '₹', 'CAD': '$', 'AUD': '$', 'NZD': '$', 'CHF': 'CHF', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr',
    'BRL': 'R$', 'MXN': '$', 'ARS': '$', 'COP': '$', 'ZAR': 'R', 'PLN': 'zł', 'ZWL': '$', 'VND': '₫', 'THB': '฿', 'IDR': 'Rp', 'PHP': '₱', 'MYR': 'RM', 'SGD': '$', 'HKD': '$', 'TWD': '$',
    'KRW': '₩', 'ILS': '₪', 'AED': 'د.إ', 'SAR': 'ر.с', 'EGP': 'EGP', 'PKR': '₨', 'BDT': '৳', 'NGN': '₦', 'UAH': '₴', 'HUF': 'Ft', 'CZK': 'Kč', 'RON': 'lei', 'BGN': 'лв', 'HRK': 'kn'
}

def fetch_exchange_rates():
    print("💱 Döviz kurları çekiliyor (USD bazlı)...")
    try:
        response = requests.get("https://open.er-api.com/v6/latest/USD")
        response.raise_for_status()
        data = response.json()
        rates = data.get("rates", {})
        print(f"✅ {len(rates)} döviz kuru başarıyla alındı.")
        return rates
    except Exception as e:
        print(f"⚠️ Döviz kurları alınamadı, sabit kurlar kullanılacak: {e}")
        # Sabit/Fallback kurlar
        return {"TRY": 45.89, "EUR": 0.86, "GBP": 0.75, "USD": 1.0}

def fetch_eurostat_prices():
    print("🇪🇺 Eurostat (Avrupa) verileri çekiliyor...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto("https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en", wait_until="domcontentloaded", timeout=90000)
            if page.locator("text=Accept all cookies").is_visible(timeout=5000): page.locator("text=Accept all cookies").click()
            container = page.locator("div.ecl-file").filter(has_text="Prices with taxes latest prices")
            download_link = container.locator("a:has-text('Download')")
            with page.expect_download(timeout=30000) as download_info:
                download_link.click()
            download = download_info.value
            file_content = download.path().read_bytes()
            browser.close()
        
        df = pd.read_excel(io.BytesIO(file_content), sheet_name='Sheet1', skiprows=1, header=None, engine='openpyxl')
        df = df[[0, 1, 2]]
        df.columns = ['country_name', 'gasoline_price', 'diesel_price']
        df['gasoline_price'] = pd.to_numeric(df['gasoline_price'], errors='coerce') / 1000
        df['diesel_price'] = pd.to_numeric(df['diesel_price'], errors='coerce') / 1000
        country_map = {'Belgium': 'BE', 'Bulgaria': 'BG', 'Czechia': 'CZ', 'Denmark': 'DK', 'Germany': 'DE', 'Estonia': 'EE', 'Ireland': 'IE', 'Greece': 'EL', 'Spain': 'ES', 'France': 'FR', 'Croatia': 'HR', 'Italy': 'IT', 'Cyprus': 'CY', 'Latvia': 'LV', 'Lithuania': 'LT', 'Luxembourg': 'LU', 'Hungary': 'HU', 'Malta': 'MT', 'Netherlands': 'NL', 'Austria': 'AT', 'Poland': 'PL', 'Portugal': 'PT', 'Romania': 'RO', 'Slovenia': 'SI', 'Slovakia': 'SK', 'Finland': 'FI', 'Sweden': 'SE', 'Turkey': 'TR'}
        df['country_code'] = df['country_name'].map(country_map)
        df.dropna(subset=['country_code'], inplace=True)
        df['data_source'] = 'Eurostat'
        print(f"✅ Eurostat'tan {len(df)} ülke için veri işlendi.")
        return df[['country_code', 'gasoline_price', 'diesel_price', 'data_source']]
    except Exception as e:
        print(f"❌ Eurostat verisi çekilirken bir hata oluştu: {e}")
        return None

def fetch_fuel_data(fuel_type):
    """
    Fetches data for a specific fuel type from TheGlobalEconomy.com API.
    If API key is missing, returns simulated mock data for testing.
    Uses local file caching to prevent hitting the API repeatedly.
    """
    global THEGLOBALEconomy_API_KEY
    
    cache_path = f"{fuel_type}_cache.csv"
    cache_duration = 86400  # 24 saat önbellek süresi
    
    if THEGLOBALEconomy_API_KEY and os.path.exists(cache_path):
        mtime = os.path.getmtime(cache_path)
        if time.time() - mtime < cache_duration:
            print(f"ℹ️ {fuel_type} verisi yerel önbellekten (cache) yükleniyor...")
            with open(cache_path, "r", encoding="utf-8") as f:
                return f.read()

    if not THEGLOBALEconomy_API_KEY:
        print(f"⚠️ THEGLOBALEconomy_API_KEY eksik! {fuel_type} için SIMÜLASYON (MOCK) verisi üretiliyor...")
        if fuel_type == "gasoline_prices":
            return """Country,code,Gasoline prices
Turkey,TR,1.35
Germany,DE,1.85
United States,US,0.95"""
        elif fuel_type == "diesel_prices":
            return """Country,code,Diesel prices
Turkey,TR,1.25
Germany,DE,1.75
United States,US,1.05"""
        elif fuel_type == "lpg_prices":
            return """Country,code,LPG prices
Turkey,TR,0.72
Germany,DE,0.98
United States,US,0.65"""
        return None

    print(f"Fetching {fuel_type} data from TheGlobalEconomy.com...")
    api_url = f"https://www.theglobaleconomy.com/api/v1/{fuel_type}/?api_key={THEGLOBALEconomy_API_KEY}&format=csv"
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        # API'den başarıyla dönen veriyi yerel önbelleğe kaydet
        with open(cache_path, "w", encoding="utf-8") as f:
            f.write(response.text)
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching {fuel_type} data: {e}")
        return None

def update_supabase(all_prices_df, rates):
    if all_prices_df is None or all_prices_df.empty:
        print("ℹ️ Supabase'e yazılacak veri yok.")
        return
    for _, row in all_prices_df.iterrows():
        country_code = row['country_code']
        source = row['data_source']
        
        # Get local currency information
        currency_code = country_to_currency.get(country_code, 'USD')
        currency_symbol = currency_symbols.get(currency_code, '$')
        
        # Determine exchange rates
        rate_local = rates.get(currency_code, 1.0)
        rate_eur = rates.get('EUR', 1.0)
        
        def convert(val, src):
            if val is None or pd.isna(val):
                return None
            if src == 'TheGlobalEconomy.com':
                # Input is USD, convert to local currency
                return val * rate_local
            elif src == 'Eurostat':
                # Input is EUR, convert EUR to local currency via USD cross-rate
                return (val / rate_eur) * rate_local
            else:
                # Fallback assumes input is USD
                return val * rate_local

        payload = {}
        if pd.notna(row.get('gasoline_price')):
            conv_val = convert(row['gasoline_price'], source)
            if conv_val is not None:
                payload['gasoline_price'] = round(conv_val, 3)
                
        if pd.notna(row.get('diesel_price')):
            conv_val = convert(row['diesel_price'], source)
            if conv_val is not None:
                payload['diesel_price'] = round(conv_val, 3)
                
        if pd.notna(row.get('lpg_price')):
            conv_val = convert(row['lpg_price'], source)
            if conv_val is not None:
                payload['lpg_price'] = round(conv_val, 3)
                
        payload['currency'] = currency_symbol
        payload['currency_code'] = currency_code
        payload['currency_symbol'] = currency_symbol
        payload['data_source'] = source
        
        if len(payload) > 4:  # Has currency fields + at least one price
            try:
                print(f"💾 {country_code} verisi local currency ({currency_code}) olarak Supabase'e yazılıyor ({source})...")
                supabase.table("cities").update(payload).eq("country_code", country_code).execute()
                print(f"✅ [BAŞARILI] {country_code} güncellendi ({currency_symbol}{payload.get('gasoline_price', '-')}).")
            except Exception as e:
                print(f"❌ [DB HATASI] {country_code}: {e}")
            time.sleep(0.2)

def main():
    print("🚀 Master Scraper v16.0 (TheGlobalEconomy.com) Başlatılıyor...")
    
    rates = fetch_exchange_rates()
    
    fuel_types = {
        "gasoline_prices": "gasoline_price",
        "diesel_prices": "diesel_price",
        "lpg_prices": "lpg_price"
    }
    
    all_data = []

    for api_name, column_name in fuel_types.items():
        csv_data = fetch_fuel_data(api_name)
        if csv_data:
            df = pd.read_csv(io.StringIO(csv_data))
            df = df.rename(columns={"Country": "country_name", "code": "country_code", "Gasoline prices": column_name, "Diesel prices": column_name, "LPG prices": column_name})
            df = df[["country_name", "country_code", column_name]]
            df['data_source'] = 'TheGlobalEconomy.com'
            all_data.append(df)
            
    if all_data:
        # Merge all dataframes
        from functools import reduce
        merged_df = reduce(lambda left,right: pd.merge(left,right,on=['country_name', 'country_code', 'data_source'], how='outer'), all_data)
        update_supabase(merged_df, rates)

    print("🏁 Tüm işlemler tamamlandı.")

if __name__ == "__main__":
    main()
