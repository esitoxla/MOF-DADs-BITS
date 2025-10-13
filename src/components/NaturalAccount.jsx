import React from "react";
import Select from "react-select";

export default function NaturalAccount() {
  const naturalAccountOptions = [
    { value: "2210101", label: "2210101 - Printed Material and Stationery" },
    {
      value: "2210102",
      label: "2210102 - Office Facilities, Supplies and Accessories",
    },
    { value: "2210103", label: "2210103 - Refreshment Items" },
    { value: "2210104", label: "2210104 - Medical Supplies" },
    { value: "2210105", label: "2210105 - Drugs" },
    
  ];

  return (
    <div className="mb-8">
      <label className="block text-2xl font-bold text-green-800 mb-2">
        NATURAL ACCOUNT
      </label>
      <Select
        options={naturalAccountOptions}
        value={selectedAccount}
        onChange={setSelectedAccount}
        placeholder="Search or select a natural account..."
        isSearchable
        filterOption={(option, inputValue) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#166534", // green-800
            boxShadow: "none",
            "&:hover": { borderColor: "#166534" },
            fontSize: "1.1rem",
          }),
        }}
      />
    </div>
  );
}
