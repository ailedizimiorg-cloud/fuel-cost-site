import { promises as fs } from 'fs';
import path from 'path';

const CACHE_PATH = path.join(process.cwd(), 'data', 'fuel-cache.json');

export async function getFuelPrice(city: string, country: string): Promise<number> {
  try {
    const response = await fetch(`https://gas-price.p.rapidapi.com/usaStateCode`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'gas-price.p.rapidapi.com',
        'x-rapidapi-key': '14462ac5e2msh2146af412781122p1e941ejsn0bd6671a8f03'
      }
    });

    if (!response.ok) throw new Error("API Failed");
    
    const data = await response.json();
    return parseFloat(data.gasPrice || data.price || 3.50);
  } catch (error) {
    console.error("API failed, falling back to cache:", error);
    const cache = await fs.readFile(CACHE_PATH, 'utf-8');
    const data = JSON.parse(cache);
    return data[city] || 3.50;
  }
}
