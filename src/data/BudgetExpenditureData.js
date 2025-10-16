export const goodsAndServicesAccounts = [
    { value: "2210101", label: "2210101 - Printed Material and Stationery" },
    {
      value: "2210102",
      label: "2210102 - Office Facilities, Supplies and Accessories",
    },
    { value: "2210103", label: "2210103 - Refreshment Items" },
    { value: "2210104", label: "2210104 - Medical Supplies" },
    { value: "2210105", label: "2210105 - Drugs" },
  ];

export const capitalExpenditureAccounts = [
    { value: "3111102 ", label: "3111102 - Destitute Homes" },
    { value: "3111103", label: "3111103 - Bungalows/Flats" },
    { value: "3111104", label: "3111104 - Homes of Aged" },
    { value: "3111105", label: "3111105 - Palace" },
    { value: "3111106", label: "3111106 - Barracks" },
  ];

 export const dataMap = {
    "goods & services": {
      IGF: { appropriation: 120000, allotment: 10000 },
      DPF: { appropriation: 150000, allotment: 12000 },
      GOG: { appropriation: 200000, allotment: 17000 },
    },
    "capital expenditure": {
      IGF: { appropriation: 250000, allotment: 20000 },
      DPF: { appropriation: 300000, allotment: 25000 },
      GOG: { appropriation: 400000, allotment: 35000 },
    },
  };

  //
 export const economicClassOptions = [
    { value: "goods & services", label: "Use of goods & services" },
    { value: "capital expenditure", label: "Capital expenditure" },
  ];

export const sourceOfFundingOptions = [
    { value: "GOG", label: "GOG" },
    { value: "DPF", label: "DPF" },
    { value: "IGF", label: "IGF" },
  ];