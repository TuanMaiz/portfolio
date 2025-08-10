interface HeroProps {
  name: string;
  title: string;
  description: string;
}

export default function Hero({ name, title, description }: HeroProps) {
  return (
    <section className="mb-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
          {name}
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 font-light">
          {title}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
    </section>
  );
}