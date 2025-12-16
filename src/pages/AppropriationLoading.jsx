import React from 'react'
import { useState } from 'react';
import AppropriationTab from '../components/AppropriationTab';
import AppropriationSingleForm from '../components/AppropriationSingleForm';
import AppropriationUpload from '../components/AppropriationUpload';

export default function AppropriationLoading() {
    const [activeTab, setActiveTab] = useState("single");

  return (
   <div className=" min-h-screen lg:p-8 p-4 sm:p-6 w-full">
   
         <AppropriationTab activeTab={activeTab} changeTab={setActiveTab} />
   
         <div className="mt-6 h-full">
           {activeTab === "single" ? <AppropriationSingleForm/> : <AppropriationUpload/>}
         </div>
       </div>
  )
}
