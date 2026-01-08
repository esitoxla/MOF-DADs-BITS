import { organizationOptions } from "../data/BudgetExpenditureData";


export function getOrganizationLabel(value) {
  const org = organizationOptions.find((o) => o.value === value);
  return org ? org.label : value;
}