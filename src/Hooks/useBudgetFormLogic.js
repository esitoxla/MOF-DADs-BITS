// src/hooks/useBudgetFormLogic.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRecord,
  cancelEditing,
  addExpenditure,
} from "../store/features/budgetSlice";
import {
  goodsAndServicesAccounts,
  capitalExpenditureAccounts,
  compensatingEmployeesAccounts,
  dataMap,
  economicClassOptions,
  sourceOfFundingOptions,
} from "../data/BudgetExpenditureData";

export function useBudgetFormLogic() {
  const dispatch = useDispatch();
  const { isEditing, formValues, editingIndex, loading, error } = useSelector(
    (state) => state.budget
  );

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fundingSource, setFundingSource] = useState(null);
  const [description, setDescription] = useState("");
  const [appropriation, setAppropriation] = useState("");
  const [allotment, setAllotment] = useState("");
  const [releases, setReleases] = useState("");
  const [payment, setPayment] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [allotmentBalance, setAllotmentBalance] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  const [showExpenditureAlert, setShowExpenditureAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showReleasesAlert, setShowReleasesAlert] = useState(false);

  // BudgetTable local state
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Create activities 1–20 as options for react-select
  const activityOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `Activity ${i + 1}`,
  }));

  // Determine available funding options based on selected economic class
  const filteredFundingOptions =
    economicClass?.value === "compensation of employees"
      ? sourceOfFundingOptions.filter(
          (opt) => opt.value === "GOG" || opt.value === "IGF"
        )
      : sourceOfFundingOptions;

  // Dynamically switch accounts based on selected economic class
  let naturalAccountOptions = [];
  switch (economicClass?.value) {
    case "goods & services":
      naturalAccountOptions = goodsAndServicesAccounts;
      break;
    case "capital expenditure":
      naturalAccountOptions = capitalExpenditureAccounts;
      break;
    case "compensation of employees":
      naturalAccountOptions = compensatingEmployeesAccounts;
      break;
    default:
      naturalAccountOptions = [];
  }

  // if user starts editing, populate form with formValues
  //handles populating fields that are dependent on each other(natural account, allotment, appropriation, allotment balance)
  // Handles populating fields when editing a record
  useEffect(() => {
    if (isEditing && formValues) {
      setSelectedActivity(
        formValues.activity
          ? { label: formValues.activity, value: formValues.activity }
          : null
      );
      setSelectedDate(formValues.date || "");
      setEconomicClass(
        formValues.economicClass
          ? { label: formValues.economicClass, value: formValues.economicClass }
          : null
      );
      setFundingSource(
        formValues.fundingSource
          ? { label: formValues.fundingSource, value: formValues.fundingSource }
          : null
      );
      setSelectedAccount(
        formValues.naturalAccount
          ? {
              label: formValues.naturalAccount,
              value: formValues.naturalAccount,
            }
          : null
      );
      setDescription(formValues.description || "");

      //restore appropriation and allotment if they exist
      if (formValues.appropriation) setAppropriation(formValues.appropriation);
      if (formValues.allotment) setAllotment(formValues.allotment);

      setAllotmentBalance(formValues.allotmentBalance || "");
      setReleases(formValues.releases || "");
      setExpenditure(formValues.expenditure || "");
      setPayment(formValues.payment || "");
    }
  }, [isEditing, formValues]);

  // Ensure natural account is valid for the selected economic class
  //this handles the logic behind the relationship between economic classification and the natural account
  useEffect(() => {
    if (isEditing) {
      return;
    } else if (!economicClass) {
      return;
    }

    const validOptions =
      economicClass.value === "goods & services"
        ? goodsAndServicesAccounts
        : capitalExpenditureAccounts;

    const isStillValid = validOptions.some(
      (opt) => opt.value === selectedAccount?.value
    );

    //if natural account selected does not correspond to that of the economic classification, set it to its default
    if (!isStillValid) {
      setSelectedAccount(null);
    }
  }, [economicClass]);

  // Auto-fill based on both selected fields for allotment, appropriation and allotment balance depending on economic classification and source of funding
  useEffect(() => {
    // Get the actual selected values from your dropdowns
    const ecoValue = economicClass?.value;
    const fundValue = fundingSource?.value;

    // Only run if both are selected
    if (!ecoValue || !fundValue) return;

    // Lookup from your dataMap directly (no case conversion)
    const selectedData = dataMap[ecoValue]?.[fundValue];

    // If a valid combination exists, update the state fields
    if (selectedData) {
      setAppropriation(selectedData.appropriation);
      setAllotment(selectedData.allotment);
      setAllotmentBalance(selectedData.allotment);
    }
  }, [economicClass, fundingSource]);

  // Disallow DPF when compensation of employees is selected
  useEffect(() => {
    if (
      economicClass?.value === "compensation of employees" &&
      fundingSource?.value === "DPF"
    ) {
      setFundingSource(null);
    }
  }, [economicClass, fundingSource]);

  //This ensures your Allotment Balance updates automatically when releases, allotment, or the previous records change.
  useEffect(() => {
    if (isEditing) return;

    const releaseNum = parseFloat(releases) || 0;
    const expNum = parseFloat(expenditure) || 0;
    const payNum = parseFloat(payment) || 0;

    const ecoValue = economicClass?.value?.toLowerCase();
    const fundValue = fundingSource?.value?.toUpperCase();

    // make sure this matches your keys (IGF, DPF, GOG)

    // --- Get the correct base allotment for the selected combo ---

    const baseAllotment =
      ecoValue && fundValue && dataMap[ecoValue]?.[fundValue]
        ? dataMap[ecoValue][fundValue].allotment
        : "";

    // If nothing is selected, clear the field
    if (baseAllotment === "") {
      setAllotmentBalance("");
      return;
    }

    let newBalance = baseAllotment;

    // --- Find existing records for the same category ---
    const matchingRecords = records.filter(
      (rec) =>
        rec.economicClass.toLowerCase() ===
          (economicClass?.label?.toLowerCase() || "") &&
        rec.fundingSource.toUpperCase() ===
          (fundingSource?.label?.toUpperCase() || "")
    );

    if (matchingRecords.length > 0) {
      const lastBalance =
        parseFloat(
          matchingRecords[matchingRecords.length - 1].allotmentBalance
        ) || baseAllotment;
      newBalance = lastBalance - releaseNum;
    } else {
      newBalance = baseAllotment - releaseNum;
    }

    setAllotmentBalance(newBalance);

    // --- Validate relationships ---
    const exceedsAllotment = releaseNum > baseAllotment;
    const exceedsReleases = expNum > releaseNum;
    const exceedsExpenditure = payNum > expNum;

    setShowReleasesAlert(exceedsAllotment);
    setShowExpenditureAlert(exceedsReleases);
    setShowPaymentAlert(exceedsExpenditure);

    setIsFormValid(
      !exceedsAllotment && !exceedsReleases && !exceedsExpenditure
    );
  }, [releases, expenditure, payment, economicClass, fundingSource, records]);

  // TRANSACTION HANDLERS

  // Handle releases input
  const handleReleasesChange = (e) => {
    const value = e.target.value;
    setReleases(value);

    const releaseNum = parseFloat(value) || 0;
    const balanceNum = parseFloat(allotmentBalance || 0);

    if (releaseNum > balanceNum) {
      toast.error("Releases cannot exceed the current allotment balance.");
      setShowReleasesAlert(true);
    } else {
      setShowReleasesAlert(false);
    }

    setShowExpenditureAlert(false);
  };

  // Handle expenditure input
  const handleExpenditureChange = (e) => {
    const value = e.target.value;
    setExpenditure(value);

    if (parseFloat(value) > parseFloat(releases || 0)) {
      toast.error("Actual expenditure cannot exceed releases.");
      setShowExpenditureAlert(true);
    } else {
      setShowExpenditureAlert(false);
    }
  };

  // Handle payment input
  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setPayment(value);

    if (parseFloat(value) > parseFloat(expenditure || 0)) {
      toast.error("Actual payment cannot exceed actual expenditure.");
      setShowPaymentAlert(true);
    } else {
      setShowPaymentAlert(false);
    }
  };

  // submit logic (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedActivity) {
      toast.error("Activity is required!");
      return;
    }

    if (!selectedDate) {
      toast.error("Date is required!");
      return;
    }

    if (!economicClass) {
      toast.error("Economic Classification is required!");
      return;
    }

    if (!fundingSource) {
      toast.error("Source of funding must not be empty!");
      return;
    }

    if (!selectedAccount) {
      toast.error("Natural Account must not be empty!");
      return;
    }

    if (!description) {
      toast.error("Description is required!");
      return;
    }

    if (!isFormValid) {
      toast.error("Cannot add record — please fix input errors!");
      return;
    }

    // build the record to match backend field names
    const newRecord = {
      activity: selectedActivity?.value || selectedActivity?.label || "",
      date: selectedDate,
      economicClassification: economicClass?.label || "",
      sourceOfFunding: fundingSource?.label || "",
      naturalAccount: selectedAccount?.label || "",
      description,
      appropriation,
      allotment,
      allotmentBalance,
      releases,
      actualExpenditure: expenditure,
      actualPayment: payment,
    };

    // add or update it to the table
    if (isEditing) {
      dispatch(updateRecord({ index: editingIndex, updatedRecord: newRecord }));
      toast.success("Record updated successfully!");
      dispatch(cancelEditing());
    } else {
      // setRecords([...records, newRecord]);
      // but also dispatch to redux so the table updates
      dispatch(addExpenditure(newRecord));
      toast.success("Record added successfully!");
    }

    // clear fields
    setSelectedActivity(null);
    setSelectedDate("");
    setEconomicClass(null);
    setFundingSource(null);
    setSelectedAccount(null);
    setDescription("");
    setAppropriation("");
    setAllotment("");
    setReleases("");
    setExpenditure("");
    setPayment("");
    setAllotmentBalance("");
  };

  //handles the submission of the edited record
  const handleEditRecord = (record) => {
    setSelectedActivity({ label: record.activity, value: record.activity });
    setSelectedDate(record.date);
    setEconomicClass({
      label: record.economicClass,
      value: record.economicClass,
    });
    setFundingSource({
      label: record.fundingSource,
      value: record.fundingSource,
    });
    setSelectedAccount({
      label: record.naturalAccount,
      value: record.naturalAccount,
    });
    setDescription(record.description);
    setAppropriation(record.appropriation);
    setAllotment(record.allotment);
    setAllotmentBalance(record.allotmentBalance);
    setReleases(record.releases);
    setExpenditure(record.expenditure);
    setPayment(record.payment);
  };

  return {
    // state
    selectedActivity,
    setSelectedActivity,
    selectedDate,
    setSelectedDate,
    economicClass,
    setEconomicClass,
    selectedAccount,
    setSelectedAccount,
    fundingSource,
    setFundingSource,
    description,
    setDescription,
    appropriation,
    setAppropriation,
    allotment,
    setAllotment,
    releases,
    setReleases,
    payment,
    setPayment,
    expenditure,
    setExpenditure,
    allotmentBalance,
    setAllotmentBalance,
    isFormValid,
    setIsFormValid,
    showExpenditureAlert,
    showPaymentAlert,
    showReleasesAlert,

    // options & helpers
    activityOptions,
    economicClassOptions,
    sourceOfFundingOptions,
    filteredFundingOptions,
    naturalAccountOptions,

    // table
    records,
    setRecords,
    searchQuery,
    setSearchQuery,

    // handlers and actions
    handleReleasesChange,
    handleExpenditureChange,
    handlePaymentChange,
    handleSubmit,
    handleEditRecord,

    // redux meta
    isEditing,
    editingIndex,
    loading,
    error,
  };
}
