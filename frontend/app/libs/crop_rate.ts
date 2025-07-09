type CropPriceRecord = {
  state?: string | null;
  district?: string | null;
  market?: string | null;
  commodity?: string | null;
  variety?: string | null;
  arrival_date?: string | null;
  min_price?: string | null;
  max_price?: string | null;
  modal_price?: string | null;
  limit?: number
};

export async function fetchCropPrices({
  commodity,
  state,
  district,
  limit = 10,
}: CropPriceRecord/*{
  commodity: string;
  state: string;
  district?: string;
  limit?: number;
}*/): Promise<CropPriceRecord[] | null> {
  const API_KEY: string = process.env.EXPO_PUBLIC_GOV_API_KEY || "";
  const url = new URL("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070");

  url.searchParams.append("api-key", process.env.EXPO_PUBLIC_GOV_API_KEY || "");
  url.searchParams.append("format", "json");
  if (commodity) url.searchParams.append("filters[commodity]", commodity);
  if (state) url.searchParams.append("filters[state]", state);
  if (district) url.searchParams.append("filters[district]", district);
  if (limit) url.searchParams.append("limit", limit.toString());

  console.log(url.toString())
  try {
    const res = await fetch(url.toString());
    const json = await res.json();
    console.log(json)

    if (json?.records) {
      return json.records as CropPriceRecord[];
    } else {
      console.warn("No crop data found");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch crop prices:", error);
    return null;
  }
}