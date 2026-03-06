export type CaseStudy = {
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
};

export type CaseStudiesData = { [key: string]: CaseStudy[] };

export const caseStudies: CaseStudiesData = {
  HOSPITALITY: [
    {
      title: "Hospitality Business",
      subtitle: "A well-established hospitality business in Bulgaria",
      image: "/1_Icon_Hospitality_Business.svg",
      description:
        "A well-established hospitality business in Bulgaria sought new avenues for expansion and strategic growth. With a strong foundation, the goal was to uncover actionable insights to inform future development.",
      challenge:
        "Despite a solid market presence, the business needed fresh strategies to navigate an evolving, competitive hospitality landscape.",
      solution:
        "We launched a comprehensive research initiative to guide decision-making:\n\n• Research: Conducted in-depth analysis of the competitive landscape, including trend scanning and forecasting, to uncover emerging opportunities.\n• Bespoke Strategy Creation: Developed a tailored, actionable strategy aligned with the business's strengths and market insights.",
      results:
        "Our efforts identified high-potential growth areas based on current trends. The bespoke strategy offered clear direction, enabling informed expansion decisions.",
    },
  ],
  "ITALIAN CONCEPT": [
    {
      title: "Italian Concept Store",
      subtitle: "A specialty retailer introducing Italian lifestyle products",
      image: "/2_Icon_Italian Concept Store.svg",
      description:
        "A specialty retailer introducing Italian lifestyle products to the Bulgarian market aimed to deepen customer engagement and strengthen brand recognition.",
      challenge:
        "While offering high-quality products, the store struggled to establish a cohesive brand presence and connect meaningfully with customers.",
      solution:
        "We undertook a strategic repositioning process:\n\n• Research: Conducted an in-depth analysis of the local retail landscape, exploring customer preferences, market trends, and opportunities for differentiation.\n• Marketing Plan Development: Crafted a targeted marketing strategy aligned with the store's offerings and audience, defining clear objectives, channels, and engagement steps.",
      results:
        "Our work revealed the store's unique market position, enabling stronger customer connection. A clear, research-based marketing strategy laid a foundation for lasting success.",
    },
  ],
  "WELLNESS PRACTICE": [
    {
      title: "Wellness Practice",
      subtitle: "A newly established somatic therapist",
      image: "/3_Icon_Wellness Practice.svg",
      description:
        "A newly established somatic therapist sought to define her distinctive healing approach and attract aligned clients through a strong, resonant presence.",
      challenge:
        "Launching in a niche market required communicating the unique value of her services and creating a brand identity capable of building trust.",
      solution:
        "We guided the practice's development across key areas:\n\n• Research: Analyzed the local wellness landscape to uncover gaps and opportunities.\n• Business Architecture: Designed and positioned her service offerings to reflect her methodology.\n• Branding: Developed a visual and verbal identity capturing the practice's essence and authenticity.\n• Marketing Strategy: Crafted a marketing plan focused on resonant channels and messaging.",
      results:
        "The new brand identity and strategic plan allowed her to connect meaningfully with clients, positioning her practice for growth and sustainability.",
    },
  ],
  "International Cosmetics Brand": [
    {
      title: "International Cosmetics Brand",
      subtitle:
        "An international cosmetics company with a growing global presence.",
      image: "/4_Icon_International Cosmetics Brand.svg",
      description:
        "An international cosmetics company with a growing global presence was looking to evaluate the effectiveness of its internal employee programs and benefits—seeking to understand how they were received across the organization and what could be improved.",
      challenge:
        "Despite continued business growth, several employee loyalty initiatives and internal benefits programs were underperforming. Engagement and perceived value varied across departments, making it difficult to assess impact or guide future improvements.",
      solution:
        "Research: Conducted in-depth, one-to-one interviews with employees across different levels and departments to uncover honest perspectives, unmet needs, and areas of friction within existing programs.",
      results:
        "The research surfaced key disconnects in perception, communication, and relevance. Sotrixa provided actionable recommendations to refine current initiatives and introduce strategic adjustments—leading to stronger alignment between employee expectations and company offerings.",
    },
  ],
};
