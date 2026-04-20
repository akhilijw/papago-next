import { getCloudflareContext } from "@opennextjs/cloudflare";
import homeDefault from "@/data/home-default";
import { globalData } from "@/data/global";
import HomeTemplate from "@/templates/home";

export const dynamic = "force-dynamic";

type NestedRecord = {
  __version?: number;
  [key: string]: unknown;
};

type KvEnv = {
  PAGES: {
    get(key: string): Promise<string | null>;
  };
};

function isRecord(value: unknown): value is NestedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep(target: NestedRecord, source: NestedRecord): NestedRecord {
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

function resolveHomeData(data: NestedRecord): NestedRecord {
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
    const { env } = getCloudflareContext();
    const data = await (env as KvEnv).PAGES.get("home");
    overrideData = data ? (JSON.parse(data) as NestedRecord) : {};
  } catch {
    console.log("KV read failed");
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

  return <HomeTemplate data={finalData as Parameters<typeof HomeTemplate>[0]["data"]} />;
}
