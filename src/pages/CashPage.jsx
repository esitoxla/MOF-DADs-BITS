import React, { useState } from 'react'
import CashForm from '../components/CashForm'
import CashTableDetails from '../components/CashTableDetails';

export default function CashPage() {

    const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="lg:px-4 md:w-[90%] w-full md:mx-auto mt-4">
      <CashForm />

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center justify-between mb-4 w-full px-6">
        <input
          type="text"
          placeholder="Search any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full lg:w-1/3 md:w-1/2"
        />
      </div>

      <CashTableDetails searchQuery={searchQuery}/>
    </div>
  );
}
