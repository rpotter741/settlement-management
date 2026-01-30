export interface AttributeCard {
  name: string;
  icon: {
    d: string;
    color: string;
    fill: string;
    viewBox: string;
  };
  description: string;
  balance: {
    maxPerLevel: number;
    costPerLevel: number;
    healthPerLevel: number;
  };
  [key: string]: any;
}
