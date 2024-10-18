import React from 'react'
import Navbar from '../components/Navbar'
import Blog from '../components/Blog'

const HealthPage = () => {
  return (
    <>
        <Navbar />
        <Blog category={"Health"} ClassName={"mt-20"} />
    </>
  )
}

export default HealthPage
