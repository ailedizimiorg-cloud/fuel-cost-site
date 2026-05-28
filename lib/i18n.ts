// lib/i18n.ts

export const countryToLanguage: { [key: string]: string } = {
  TR: 'tr',
  DE: 'de',
  FR: 'fr',
  ES: 'es',
  IT: 'it',
};

export const translations: { [key: string]: any } = {
  en: {
    title: "Current Fuel Prices in {city}, {country} - Guide",
    description: "In {city}, the current price of gasoline is {currency}{price}. For a standard car consuming {consumption}L/100km, driving 1km costs {currency}{costPerKm}. This guide provides real-time updates and cost analysis for drivers in the region.",
    priceComparisons: "Price Comparisons",
    comparisonTable: "Fuel Eco-Comparison & Efficiency",
    ecoScore: "Eco-Score",
    co2Emission: "CO2 Emission",
    forDistance: "For {distance} km",
    location: "Location",
    price: "Price",
    selectFuelType: "Select Fuel Type",
    notAvailable: "Not Available",
    dataSource: "Data Source",
    verified: "Verified",
    dataSourceDescription: "Prices are updated continuously using our automated multi-source pipeline. Active integration utilizes direct-feed parameters for this city to ensure calculation accuracy.",
    costEstimator: "Cost Estimator",
    pricePerUnit: "Price per {unit} ({currency})",
    consumptionLabel: "Consumption ({cons})",
    calculateDistance: "Calculate for distance (km)",
    costPerKm: "Cost per KM",
    totalCost: "Total Cost ({distance} km)",
    question: "How much does it cost to drive 1km in {city}?",
    fuelTypes: {
      gasoline_price: "Gasoline",
      diesel_price: "Diesel",
      lpg_price: "LPG",
      electric_price: "Electricity"
    },
    units: {
      Liter: "Liter",
      kWh: "kWh"
    }
  },
  tr: {
    title: "{city}, {country} Güncel Akaryakıt Fiyatları - Rehber",
    description: "{city} şehrinde güncel benzin fiyatı {currency}{price}. 100 km'de {consumption} litre tüketen standart bir araçla 1 km yol gitmek {currency}{costPerKm} maliyetindedir. Bu rehber, bölgedeki sürücüler için gerçek zamanlı güncellemeler ve maliyet analizi sunar.",
    priceComparisons: "Fiyat Karşılaştırmaları",
    comparisonTable: "Yakıt Eko-Karşılaştırma ve Verimlilik",
    ecoScore: "Eko-Skor",
    co2Emission: "CO2 Salınımı",
    forDistance: "{distance} km için",
    location: "Konum",
    price: "Fiyat",
    selectFuelType: "Yakıt Türü Seçin",
    notAvailable: "Mevcut Değil",
    dataSource: "Veri Kaynağı",
    verified: "Doğrulanmış",
    dataSourceDescription: "Fiyatlar, otomatik çok kaynaklı veri akışımız kullanılarak sürekli olarak güncellenmektedir. Bu şehir için doğrudan veri akışı parametreleri hesaplama doğruluğunu garanti eder.",
    costEstimator: "Maliyet Hesaplayıcı",
    pricePerUnit: "{unit} başına fiyat ({currency})",
    consumptionLabel: "Tüketim ({cons})",
    calculateDistance: "Hesaplanacak mesafe (km)",
    costPerKm: "KM başına maliyet",
    totalCost: "Toplam Maliyet ({distance} km)",
    question: "{city} şehrinde 1 km gitmenin maliyeti nedir?",
    fuelTypes: {
      gasoline_price: "Benzin",
      diesel_price: "Motorin",
      lpg_price: "LPG",
      electric_price: "Elektrik"
    },
    units: {
      Liter: "Litre",
      kWh: "kWh"
    }
  },
  de: {
    title: "Aktuelle Kraftstoffpreise in {city}, {country} - Ratgeber",
    description: "In {city} beträgt der aktuelle Benzinpreis {currency}{price}. Für ein Standardauto mit einem Verbrauch von {consumption} l/100 km kostet die Fahrt von 1 km {currency}{costPerKm}. Dieser Leitfaden bietet Echtzeit-Updates und Kostenanalysen für Autofahrer in der Region.",
    priceComparisons: "Preisvergleiche",
    comparisonTable: "Öko-Vergleich & Kraftstoffeffizienz",
    ecoScore: "Öko-Bewertung",
    co2Emission: "CO2-Emissionen",
    forDistance: "Für {distance} km",
    location: "Standort",
    price: "Preis",
    selectFuelType: "Kraftstoffart auswählen",
    notAvailable: "Nicht verfügbar",
    dataSource: "Datenquelle",
    verified: "Verifiziert",
    dataSourceDescription: "Die Preise werden kontinuierlich über unsere automatisierte Pipeline aus mehreren Quellen aktualisiert. Die aktive Integration nutzt Direktübertragungsdaten für diese Stadt, um die Genauigkeit zu gewährleisten.",
    costEstimator: "Kostenrechner",
    pricePerUnit: "Preis pro {unit} ({currency})",
    consumptionLabel: "Verbrauch ({cons})",
    calculateDistance: "Berechnen für Strecke (km)",
    costPerKm: "Kosten pro KM",
    totalCost: "Gesamtkosten ({distance} km)",
    question: "Wie viel kostet es, 1 km in {city} zu fahren?",
    fuelTypes: {
      gasoline_price: "Benzin",
      diesel_price: "Diesel",
      lpg_price: "LPG",
      electric_price: "Elektrizität"
    },
    units: {
      Liter: "Liter",
      kWh: "kWh"
    }
  },
  fr: {
    title: "Prix actuels des carburants à {city}, {country} - Guide",
    description: "À {city}, le prix actuel de l'essence est de {currency}{price}. Pour une voiture standard consommant {consumption}L/100km, parcourir 1km coûte {currency}{costPerKm}. Ce guide fournit des mises à jour en temps réel et des analyses de coûts pour les conducteurs de la région.",
    priceComparisons: "Comparaisons de prix",
    comparisonTable: "Éco-Comparatif et Efficacité Énergétique",
    ecoScore: "Éco-Score",
    co2Emission: "Émissions CO2",
    forDistance: "Pour {distance} km",
    location: "Emplacement",
    price: "Prix",
    selectFuelType: "Sélectionnez le type de carburant",
    notAvailable: "Non disponible",
    dataSource: "Source de données",
    verified: "Vérifié",
    dataSourceDescription: "Les prix sont mis à jour en continu à l'aide de notre pipeline automatisé multi-sources. L'intégration active utilise les données directes de cette ville pour garantir l'exactitude des calculs.",
    costEstimator: "Estimateur de coûts",
    pricePerUnit: "Prix par {unit} ({currency})",
    consumptionLabel: "Consommation ({cons})",
    calculateDistance: "Calculer pour la distance (km)",
    costPerKm: "Coût par KM",
    totalCost: "Coût Total ({distance} km)",
    question: "Combien coûte un trajet de 1 km à {city} ?",
    fuelTypes: {
      gasoline_price: "Essence",
      diesel_price: "Gazole",
      lpg_price: "GPL",
      electric_price: "Électricité"
    },
    units: {
      Liter: "Litre",
      kWh: "kWh"
    }
  },
  es: {
    title: "Precios actuales del combustible en {city}, {country} - Guía",
    description: "En {city}, el precio actual de la gasolina es de {currency}{price}. Para un coche estándar que consume {consumption}L/100km, conducir 1km cuesta {currency}{costPerKm}. Esta guía proporciona actualizaciones en tiempo real y análisis de costes para los conductores de la región.",
    priceComparisons: "Comparaciones de precios",
    comparisonTable: "Eco-Comparación y Eficiencia de Combustible",
    ecoScore: "Eco-Puntuación",
    co2Emission: "Emisión de CO2",
    forDistance: "Para {distance} km",
    location: "Ubicación",
    price: "Precio",
    selectFuelType: "Seleccione el tipo de combustible",
    notAvailable: "No disponible",
    dataSource: "Fuente de datos",
    verified: "Verificado",
    dataSourceDescription: "Los precios se actualizan continuamente mediante nuestro canal automatizado de fuentes múltiples. La integración activa utiliza parámetros de alimentación directa para esta ciudad para garantizar la precisión de los cálculos.",
    costEstimator: "Estimador de costes",
    pricePerUnit: "Precio por {unit} ({currency})",
    consumptionLabel: "Consumo ({cons})",
    calculateDistance: "Calcular para distancia (km)",
    costPerKm: "Coste por KM",
    totalCost: "Coste Total ({distance} km)",
    question: "¿Cuánto cuesta conducir 1 km en {city}?",
    fuelTypes: {
      gasoline_price: "Gasolina",
      diesel_price: "Diésel",
      lpg_price: "GLP",
      electric_price: "Electricidad"
    },
    units: {
      Liter: "Litro",
      kWh: "kWh"
    }
  },
  it: {
    title: "Prezzi attuali del carburante a {city}, {country} - Guida",
    description: "A {city}, il prezzo attuale della benzina è di {currency}{price}. Per un'auto standard che consuma {consumption}L/100km, percorrere 1km costa {currency}{costPerKm}. Questa guida fornisce aggiornamenti in tempo reale e analisi dei costi per i conducenti della regione.",
    priceComparisons: "Confronti di prezzo",
    comparisonTable: "Eco-Confronto e Efficienza del Carburante",
    ecoScore: "Eco-Punteggio",
    co2Emission: "Emissioni di CO2",
    forDistance: "Per {distance} km",
    location: "Posizione",
    price: "Prezzo",
    selectFuelType: "Seleziona il tipo di carburante",
    notAvailable: "Non disponibile",
    dataSource: "Fonte dei dati",
    verified: "Verificato",
    dataSourceDescription: "I prezzi vengono aggiornati continuamente utilizzando la nostra pipeline automatizzata multi-fonte. L'integration attiva utilizza parametri di alimentazione diretta per questa città per garantire l'accuratezza dei calcoli.",
    costEstimator: "Calcolatore dei costi",
    pricePerUnit: "Prezzo per {unit} ({currency})",
    consumptionLabel: "Consumo ({cons})",
    calculateDistance: "Calcola per distanza (km)",
    costPerKm: "Costo per KM",
    totalCost: "Costo Totale ({distance} km)",
    question: "Quanto costa percorrere 1 km a {city}?",
    fuelTypes: {
      gasoline_price: "Benzina",
      diesel_price: "Diesel",
      lpg_price: "GPL",
      electric_price: "Elettricità"
    },
    units: {
      Liter: "Litro",
      kWh: "kWh"
    }
  }
};

export function getLanguage(countryCodeOrLang: string): string {
  if (!countryCodeOrLang) return 'en';
  const lower = countryCodeOrLang.toLowerCase();
  if (translations[lower]) {
    return lower;
  }
  const code = countryCodeOrLang.toUpperCase();
  return countryToLanguage[code] || 'en';
}

export function translate(countryCode: string, key: string, placeholders: { [key: string]: string | number } = {}): string {
  const lang = getLanguage(countryCode);
  const dict = translations[lang] || translations['en'];
  
  // Handle nested keys (like fuelTypes.gasoline_price)
  const parts = key.split('.');
  let value = dict;
  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      // Fallback to English dict
      let fallbackValue = translations['en'];
      for (const fPart of parts) {
        if (fallbackValue && fallbackValue[fPart] !== undefined) {
          fallbackValue = fallbackValue[fPart];
        } else {
          return key; // return key as fallback
        }
      }
      value = fallbackValue;
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  let result = value;
  for (const placeholder in placeholders) {
    result = result.replace(new RegExp(`{${placeholder}}`, 'g'), String(placeholders[placeholder]));
  }
  return result;
}
