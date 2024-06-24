import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export const AssetPlanData = [
  {
    id: 1,
    name: TypeOfPlan.RENT,
    description: 'I want to find tenants',
    icon: 'home-search',
  },
  {
    id: 2,
    name: TypeOfPlan.SELL,
    description: 'I want to sell my property',
    icon: 'home-calculus',
  },
  {
    id: 3,
    name: TypeOfPlan.MANAGE,
    description: 'I already have found a tenant',
    icon: 'home-person',
  },
];
