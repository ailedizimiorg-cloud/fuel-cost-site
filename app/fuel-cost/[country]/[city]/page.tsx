import { getFuelPrice } from "@/lib/fuel-api";
import { generateDescription, getComparisonData } from "@/lib/seo-utils";
import Calculator from "@/components/Calculator";

export default async function FuelPage({ params }: { params: { country: string; city: string } }) {
  const { country, city } = await params;
  const price = await getFuelPrice(city, country);
  const description = generateDescription(city, price);
  const comparisons = getComparisonData(city);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'FuelCost Tracker',
    'applicationCategory': 'UtilitiesApplication',
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How much does it cost to drive 1km in ${city}?',
          'acceptedAnswer': { '@type': 'Answer', 'text': description }
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <h1 className="text-5xl font-semibold tracking-[-2.4px] mb-8">Current Fuel Prices in {city.toUpperCase()}, {country.toUpperCase()} - Guide</h1>
      
      <p className="text-lg text-[#4d4d4d] mb-10">{description}</p>

      <Calculator initialPrice={price} />

      <h2 className="text-2xl font-semibold mt-12 mb-6">Price Comparisons</h2>
      <table className="w-full text-left shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden">
        <thead className="bg-[#fafafa]">
          <tr>
            <th className="p-4">Location</th>
            <th className="p-4">Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.city} className="border-t border-[#ebebeb]">
              <td className="p-4">{c.city}</td>
              <td className="p-4">${c.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
