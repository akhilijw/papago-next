import Hero from "@/components/Hero";
import Services from "@/components/Services";

type HomeTemplateData = {
  content: {
    hero: {
      title: string;
      desc: string;
      cta: {
        text: string;
        link: string;
      };
    };
    services: {
      title: string;
      desc: string;
      items: {
        title: string;
        desc: string;
      }[];
    };
  };
};

type HomeTemplateProps = {
  data: HomeTemplateData;
};

export default function HomeTemplate({ data }: HomeTemplateProps) {
  return (
    <>
      <Hero data={data.content.hero} />
      <Services data={data.content.services} />
    </>
  );
}
