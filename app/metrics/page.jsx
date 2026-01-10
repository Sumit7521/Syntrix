import AccuracyBar from '@/components/Charts/AccuracyBar'
import MetricsLine from '@/components/Charts/MetricsLine'
import React from 'react'

const matrix = () => {
  return (
    <>
      <h1>Model Metrics</h1>
      <AccuracyBar />
      <MetricsLine />
    </>
  )
}

export default matrix