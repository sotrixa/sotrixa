import type { Metadata } from "next";
import { OptimizedImage } from "@/app/lib/image-optimization";
import { generateBreadcrumbSchema } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "About Sotrixa - Strategic Design Agency for Visionary Thinkers",
  description:
    "Learn about Sotrixa, a strategic design agency that partners with visionary entrepreneurs and changemakers to transform bold ideas into aligned, authentic strategies.",
  keywords: [
    "about sotrixa",
    "strategic design agency",
    "visionary thinkers",
    "design agency story",
    "strategic consulting team",
  ],
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://sotrixa.com" },
    { name: "About", url: "https://sotrixa.com/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                We Are Sotrixa
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                A strategy lab for visionary thinkers
              </p>
            </header>

            <div className="aspect-video mb-12">
              <OptimizedImage
                src="/images/agence1.jpg"
                alt="Sotrixa Team - Strategic Design Agency"
                className="object-cover rounded-lg"
                fill
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2>Our Story</h2>
              <p>
                Through deep analysis and creative design, we shape strategic
                direction that moves ideas forward. We partner with visionary
                entrepreneurs, creatives, and changemakers—those building with
                purpose and seeking clarity along the way.
              </p>

              <h2>Our Approach</h2>
              <p>
                Every strategy has a rhythm <span className="text-sm">—</span>{" "}
                ours begins by listening. Each project becomes a living story,
                unfolding through research, structure, strategy, and
                design—shaping everything from your foundation to how
                you&apos;re seen and remembered.
              </p>

              <h3>The Way We Work</h3>
              <p>
                The way we work is layered, intentional, and deeply aligned. We
                move from insight to structure, strategy to story—building
                identities and experiences that hold together and move forward.
              </p>

              <h2>Our Mission</h2>
              <p>
                We build with purpose—and every outcome reflects the thinking
                behind it. Beyond client work, Sotrixa invests in artistic and
                educational initiatives, giving under-resourced children access
                to imagination, learning, and creative self-expression. Because
                the future needs more creators—and every child deserves a space
                to dream.
              </p>

              <h2>Ready to Work Together?</h2>
              <p>
                If you&apos;re a visionary thinker ready to transform your bold
                ideas into aligned, authentic strategies, we&apos;d love to hear
                from you. Let&apos;s shape strategic direction that moves your
                ideas forward.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
