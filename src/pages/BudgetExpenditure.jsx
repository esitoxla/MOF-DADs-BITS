import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";

export default function BudgetExpenditure() {

  const activities = [
   {value: "1", label: "Activity 1"},
   {value: "2", label: "Activity 2"},
   {value: "3", label: "Activity 3"},
   {value: "4", label: "Activity 4"},
   {value: "5", label: "Activity 5"},
   {value: "6", label: "Activity 6"},
   {value: "7", label: "Activity 7"},
   {value: "8", label: "Activity 8"},
   {value: "9", label: "Activity 9"},
   {value: "10", label: "Activity 10"},
   {value: "11", label: "Activity 11"},
   {value: "12", label: "Activity 12"},
   {value: "13", label: "Activity 13"},
   {value: "14", label: "Activity 14"},
   {value: "15", label: "Activity 15"},
   {value: "16", label: "Activity 16"},
   {value: "17", label: "Activity 17"},
   {value: "18", label: "Activity 18"},
   {value: "19", label: "Activity 19"},
   {value: "20", label: "Activity 20"},
  ]

  

  return (
    <div className="flex justify-center lg:px-10 ">
      <div className="min-h-screen w-full p-4 sm:p-6">
        <div className=" flex items-center text-2xl font-bold text-green-800 mb-8 border-0 shadow bg-white px-4 py-4 w-full">
          <label className="text-center w-8/9">ACTIVITIES</label>
          <select className="">
            <option value="1">Activity 1</option>
            <option value="2">Activity 2</option>
            <option value="3">Activity 3</option>
            <option value="4">Activity 4</option>
            <option value="5">Activity 5</option>
            <option value="6">Activity 6</option>
            <option value="7">Activity 7</option>
            <option value="8">Activity 8</option>
            <option value="9">Activity 9</option>
            <option value="10">Activity 10</option>
            <option value="11">Activity 11</option>
            <option value="12">Activity 12</option>
            <option value="13">Activity 13</option>
            <option value="14">Activity 14</option>
            <option value="15">Activity 15</option>
            <option value="16">Activity 16</option>
            <option value="17">Activity 17</option>
            <option value="18">Activity 18</option>
            <option value="19">Activity 19</option>
            <option value="20">Activity 20</option>
          </select>
        </div>

        <div className="font-semibold cursor-pointer">
          <div className="grid grid-cols-3 gap-4 bg-white border-4 border-green-500 w-full px-4 mb-8">
            <div className=" border-r-4 border-green-500 flex items-center justify-center py-8">
              DATE
            </div>
            <div className=" flex items-center justify-center gap-4 border-r-4 border-green-500">
              <p> ECONOMIC CLASSIFICATION</p>
              <span className="text-4xl">
                <IoMdArrowDropdown />
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <p>NATURAL ACCOUNT</p>
              <span className="text-4xl">
                <IoMdArrowDropdown />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white border-4 border-green-500 w-full px-4 mb-8">
            <div className=" border-r-4 border-green-500 flex items-center justify-center py-10">
              DESCRIPTION
            </div>
            <div className="flex items-center justify-center gap-4 border-r-4 border-green-500">
              <p>SOURCE OF FUNDING</p>
              <span className="text-4xl">
                <IoMdArrowDropdown />
              </span>
            </div>
            <div className="flex items-center justify-center">
              APPROPRIATION
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white border-4 border-green-500 w-full px-4 mb-8">
            <div className="border-r-4 border-green-500 flex items-center justify-center py-10">
              RELEASES
            </div>
            <div className="flex items-center justify-center border-r-4 border-green-500">
              ACTUAL EXPENDITURE
            </div>
            <div className="flex items-center justify-center">
              ACTUAL PAYMENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
