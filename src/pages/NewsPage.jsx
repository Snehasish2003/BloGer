import React from 'react'
import Navbar from '../components/Navbar'
import Blog from '../components/Blog'

const NewsPage = () => {
  return (
    <>
        <Navbar />
        <Blog category={"News"} ClassName={"mt-20"} />
    </>
  )
}

export default NewsPage
