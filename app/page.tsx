import homeDefault from "@/data/home-default";
import { globalData } from "@/data/global";
import HomeTemplate from "@/templates/home";

export const runtime = "edge";

type NestedRecord = {
  __version?: number;
  [key: string]: unknown;
};

function isRecord(value: unknown): value is NestedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T extends NestedRecord>(target: T, source: NestedRecord): T {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      mergeDeep(targetValue, sourceValue);
      continue;
    }

    target[key] = sourceValue;
  }

  return target;
}

function resolveHomeData<T extends NestedRecord>(data: T): T {
  const servicesBlock = data.content;

  if (!isRecord(servicesBlock)) {
    return data;
  }

  const services = servicesBlock.services;

  if (!isRecord(services) || services.source !== "global.services") {
    return data;
  }

  const limit =
    typeof services.limit === "number"
      ? services.limit
      : globalData.services.length;

  services.items = globalData.services.slice(0, limit);

  return data;
}

async function getOverrideData(): Promise<NestedRecord> {
  let overrideData: NestedRecord = {};

  try {
    const res = await fetch("https://dev.papago.workers.dev/api/page", {
      cache: "no-store",
    });

    if (!res.ok) {
      return overrideData;
    }

    overrideData = (await res.json()) as NestedRecord;
  } catch (e) {
    console.log("API failed, using default data");
    overrideData = {};
  }

  return overrideData;
}

export default async function Page() {
  const overrideData = await getOverrideData();
  const baseData = structuredClone(homeDefault);
  const shouldMigrate =
    (overrideData.__version ?? 0) < (homeDefault.__version ?? 0);

  const mergedData = mergeDeep(baseData, overrideData);

  if (shouldMigrate) {
    mergedData.__version = homeDefault.__version;
    console.log("Data migrated to latest version");
  }

  const finalData = resolveHomeData(mergedData);

  return <HomeTemplate data={finalData} />;
}
