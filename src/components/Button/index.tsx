import React from 'react'

import styles from './styles.module.css'

export const Button: React.FC<{
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}> = ({ children, ...props }) => (
  <button className={styles.buttonPrimary} {...props}>
    {children}
  </button>
)
