import React from 'react'
import Gingerbread from '../Components/Gingerbread.png'
const Header = () => {
  return (
    <header className='header'>
        <img src={Gingerbread} alt="Gingerbread icon" className='gingerbread'/>
        <h1 className='title'>Secret Santa</h1>
    </header>
  )
}

export default Header
