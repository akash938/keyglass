import { AmbientBackdrop } from "@/presentation/components/layout/AmbientBackdrop";
import { KeyGlassApp } from "@/presentation/components/KeyGlassApp";
import { SeoContentSection } from "@/presentation/components/marketing/SeoContentSection";
import { buildStructuredData } from "@/infrastructure/seo/seo-metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://keyglass.app";

export default function HomePage() {
  const structuredData = buildStructuredData(SITE_URL);

  return (
    <>
      {/* JSON-LD Structured Data for Google Rich Results (WebApplication, FAQPage, HowTo) */}
      {structuredData.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <AmbientBackdrop />

      <main className="relative z-10 min-h-screen">
        <KeyGlassApp />
        <SeoContentSection />
      </main>
    </>
  );
}
