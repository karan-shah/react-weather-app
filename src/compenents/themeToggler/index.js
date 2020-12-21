import React from 'react'
import Toggle from 'react-toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import "react-toggle/style.css"
import './styles.scss'

const ThemeToggler = ({ theme, toggleTheme }) => {
  return (
    <Toggle checked={theme === 'light'} icons={{
      checked: <p><FontAwesomeIcon icon={faSun} size='lg' /></p>,
      unchecked: <p><FontAwesomeIcon icon={faMoon} size='lg' /></p>
    }}
      onChange={toggleTheme} />
  );
};

export default ThemeToggler;
