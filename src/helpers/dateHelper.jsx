import React from 'react'

export function getYearAndQuarter(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const quarter = Math.floor((month - 1) / 3) + 1; // 1-4
  return { year, quarter };
}
