import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.local.css'

export default function Button({
  className, style, 
  disabled, children,
  color, type,
  ...props
}) {
  let baseClass = 'py1 px2 appearance-none outline-none rounded bold pointer ' + styles['button'] + ' ' + styles['button-' + type]
  if (type === 'flat') {
    baseClass += ' bg-transparent border-transparent '
    if (color === 'primary') baseClass += ' color1 '
  } else if (type === 'raised') {
    baseClass += ' white border-color1'
    if (color === 'primary') baseClass += ' bg-color1 '
  }
  
  return (
    <button
      className={baseClass + ' ' + className}
      style={style}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary']),
  type: PropTypes.oneOf(['flat', 'raised']),
  border: PropTypes.bool,
}

Button.defaultProps = {
  className: '',
  style: {},
  color: 'primary',
  type: 'flat',
}
