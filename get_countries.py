from postgrest import SyncPostgrestClient
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    print("❌ .env file is missing or does not contain SUPABASE_URL and SUPABASE_SERVICE_KEY")
    exit()

try:
    client = SyncPostgrestClient(f"{SUPABASE_URL}/rest/v1", headers={"apikey": SUPABASE_SERVICE_KEY})
    response = client.from_("cities").select("country_code").not_.is_("gasoline_price", "null").execute()
    
    if response.data:
        country_codes = sorted(list(set(item['country_code'] for item in response.data)))
        print("Countries with available fuel price data:")
        for code in country_codes:
            print(f"- {code}")
    else:
        print("No countries with fuel price data found.")
except Exception as e:
    print(f"An error occurred: {e}")
