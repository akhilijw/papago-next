type ServiceItem = {
  title: string;
  desc: string;
};

type ServicesData = {
  title: string;
  desc: string;
  items: ServiceItem[];
};

type ServicesProps = {
  data: ServicesData;
};

export default function Services({ data }: ServicesProps) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            {data.title}
          </h2>
          <p className="mt-3 text-lg text-slate-600">{data.desc}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
