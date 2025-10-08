import React from 'react'
import { Outlet } from 'react-router'

export default function ReportLayout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}
