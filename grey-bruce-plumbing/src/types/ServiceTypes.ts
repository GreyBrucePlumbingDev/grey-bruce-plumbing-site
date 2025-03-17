// src/types/serviceTypes.ts

export interface ServiceContent {
    id: string;
    slug: string;
    title: string;
    overview: string;
    benefits: Benefit[];
    commonProblems: Problem[];
    process: ProcessStep[];
    relatedServices: RelatedService[];
    imageUrl: string;
  }
  
  export interface Benefit {
    id: string;
    title: string;
    description: string;
    iconName?: string;
  }
  
  export interface Problem {
    id: string;
    title: string;
    description: string;
    solution?: string;
  }
  
  export interface ProcessStep {
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    imageUrl?: string;
  }
  
  export interface RelatedService {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
  }