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

export const compensatingEmployeesAccounts = [
  { value: "4111102 ", label: "4111102 - WIP-Harbour and Landing Sites" },
  { value: "4111103", label: "4111103 - WIP- Sea Wall" },
  { value: "4111104", label: "4111104 - Software" },
  { value: "4111105", label: "4111105 - Computer Software" },
  { value: "4111106", label: "4111106 - Copyright/Patent/Trademark" },
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
  "compensation of employees": {
    IGF: { appropriation: 300000, allotment: 30000 },
    GOG: { appropriation: 600000, allotment: 45000 },
  },
};

//
export const economicClassOptions = [
  { value: "Compensation of Employees", label: "Compensation of Employees" },
  { value: "Use of Goods and Services", label: "Use of Goods and Services" },
  { value: "Capital Expenditure", label: "Capital Expenditure" },
];

export const sourceOfFundingOptions = [
  { value: "GOG", label: "GOG" },
  { value: "DPF", label: "DPF" },
  { value: "IGF", label: "IGF" },
];

//DATA FOR REPORT
export const organizationOptions = [
  { value: "Finance Headquarters", label: "Finance Headquarters" },
  {
    value: "Controller and Acct. Generals Dept",
    label: "Controller and Acct. Generals Dept",
  },
  { value: "Statistical Service", label: "Statistical Service" },
  {
    value: "Public Procurement Authority",
    label: "Public Procurement Authority",
  },
  {
    value: "Institute of Accountancy Training",
    label: "Institute of Accountancy Training",
  },
  {
    value: "Securities and Exchange Commission",
    label: "Securities and Exchange Commission",
  },
  { value: "Ghana Revenue Authority", label: "Ghana Revenue Authority" },
  {
    value: "Independent Tax Appeals Board (ITAB)",
    label: "Independent Tax Appeals Board (ITAB)",
  },
  {
    value: "Financial Intelligence Centre",
    label: "Financial Intelligence Centre",
  },
  {
    value: "State Interest and Governance Authority",
    label: "State Interest and Governance Authority",
  },
  { value: "Internal Audit Agency", label: "Internal Audit Agency" },
  {
    value: "National Pensions and Regulatory Authority",
    label: "National Pensions and Regulatory Authority",
  },
  { value: "ALL", label: "All Organizations" },
];

export const fundingSourceOptions = [
  { value: "GOG", label: "GOG" },
  { value: "DPF", label: "DPF" },
  { value: "IGF", label: "IGF" },
  { value: "ALL", label: "ALL" },
];


export const reportTypeOptions = [
  {value: "EC", label: "Economic Classification"},
  {value: "IRP", label: "IGF Revenue Performance"},
  {value: "CP", label: "Cash Position"},
  {value: "R", label: "Reallocation"},
  {value: "NA", label: "Natural Account"}
]


//used for dropdown on report modal
export const quarterOptions = [
  { value: 1, label: "Q1 (Jan - Mar)" },
  { value: 2, label: "Q2 (Apr - Jun)" },
  { value: 3, label: "Q3 (Jul - Sep)" },
  { value: 4, label: "Q4 (Oct - Dec)" },
];


//used For header display in revenue and economic classification
export const quarterEndMonth = {
  1: "MARCH",
  2: "JUNE",
  3: "SEPTEMBER",
  4: "DECEMBER",
};


//used to connected as_at_date in cash report
export const quarterEndDate = {
  1: "03-31",
  2: "06-30",
  3: "09-30",
  4: "12-31",
};
