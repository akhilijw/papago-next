import Link from "next/link";

type HeroData = {
  title: string;
  desc: string;
  cta: {
    text: string;
    link: string;
  };
};

type HeroProps = {
  data: HeroData;
};

export default function Hero({ data }: HeroProps) {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {data.title}
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">{data.desc}</p>
        <Link
          href={data.cta.link}
          className="inline-flex rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {data.cta.text}
        </Link>
      </div>
    </section>
  );
}
