import React from 'react'
import { useState } from 'react'
import ActivityTab from '../components/ActivityTab'
import ActivityUpload from '../components/ActivityUpload'
import ActivitySingleForm from '../components/ActivitySingleForm'

export default function ActivityLoading() {

  const [activeTab, setActiveTab] = useState("single")

  return (
   <div className=" min-h-screen lg:p-8 p-4 sm:p-6 w-full">
      
            <ActivityTab activeTab={activeTab} changeTab={setActiveTab} />
      
            <div className="mt-6 h-full">
              {activeTab === "single" ? <ActivitySingleForm/> : <ActivityUpload/>}
            </div>
          </div>
  )
}
