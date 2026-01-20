// Shared component props interfaces

// Section title props
export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

// Scroll path pagination props
export interface ScrollPathPaginationProps {
  sections: string[];
  activeSection?: number;
}

// Case study type
export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  tags?: string[];
  year?: string;
  client?: string;
}

// Case study detail props
export interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

// Case study detail mobile props
export interface CaseStudyDetailMobileProps {
  caseStudy: CaseStudy;
}

// Case studies data
export interface CaseStudiesData {
  [key: string]: CaseStudy[];
}
