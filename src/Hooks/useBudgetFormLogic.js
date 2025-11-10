// src/hooks/useBudgetFormLogic.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  goodsAndServicesAccounts,
  capitalExpenditureAccounts,
  dataMap,
} from "../data/BudgetExpenditureData";

export const useBudgetForm = (isEditing, formValues, records) => {
  // --- STATES ---
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fundingSource, setFundingSource] = useState(null);
  const [description, setDescription] = useState("");
  const [appropriation, setAppropriation] = useState("");
  const [allotment, setAllotment] = useState("");
  const [releases, setReleases] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [payment, setPayment] = useState("");
  const [allotmentBalance, setAllotmentBalance] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);
  const [showReleasesAlert, setShowReleasesAlert] = useState(false);
  const [showExpenditureAlert, setShowExpenditureAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  

  // --- EFFECT 1: reset invalid natural account when economic class changes ---
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

  // --- EFFECT 2: auto-fill appropriation + allotment ---
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

  // --- EFFECT 3: populate when editing ---
  useEffect(() => {
    if (!isEditing || !formValues) return;

    setSelectedActivity(
      formValues.activity
        ? { label: formValues.activity, value: formValues.activity }
        : null
    );
    setSelectedDate(formValues.date || "");
    setEconomicClass(
      formValues.economicClassification
        ? {
            label: formValues.economicClassification,
            value: formValues.economicClassification,
          }
        : null
    );
    setFundingSource(
      formValues.sourceOfFunding
        ? {
            label: formValues.sourceOfFunding,
            value: formValues.sourceOfFunding,
          }
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
    setAppropriation(formValues.appropriation || "");
    setAllotment(formValues.allotment || "");
    setAllotmentBalance(formValues.allotmentBalance || "");
    setReleases(formValues.releases || "");
    setExpenditure(formValues.actualExpenditure || "");
    setPayment(formValues.actualPayment || "");
  }, [isEditing, formValues]);

  // --- EFFECT 4: calculate dynamic balance ---
  useEffect(() => {
    if (isEditing) return;
    const releaseNum = parseFloat(releases) || 0;
    const expNum = parseFloat(expenditure) || 0;
    const payNum = parseFloat(payment) || 0;

    const ecoValue = economicClass?.value?.toLowerCase();
    const fundValue = fundingSource?.value?.toUpperCase();

    const baseAllotment =
      ecoValue && fundValue && dataMap[ecoValue]?.[fundValue]
        ? dataMap[ecoValue][fundValue].allotment
        : "";

    if (baseAllotment === "") {
      setAllotmentBalance("");
      return;
    }

    let newBalance = baseAllotment;
    const matchingRecords = records.filter(
      (rec) =>
        rec.economicClassification.toLowerCase() ===
          (economicClass?.label?.toLowerCase() || "") &&
        rec.sourceOfFunding.toUpperCase() ===
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

  useEffect(() => {
    if (
      economicClass?.value === "compensation of employees" &&
      fundingSource?.value === "DPF"
    ) {
      setFundingSource(null);
    }
  }, [economicClass, fundingSource]);

  return {
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
    allotment,
    releases,
    expenditure,
    payment,
    allotmentBalance,
    setReleases,
    setExpenditure,
    setPayment,
    isFormValid,
    showReleasesAlert,
    showExpenditureAlert,
    showPaymentAlert,
    naturalAccountOptions,
  };
};
