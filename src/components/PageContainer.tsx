import React from 'react'
import { Box } from 'rebass'

const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box display="flex" flexDirection="column" style={{ height: '100vh' }}>
      {children}
    </Box>
  )
}

export default PageContainer
