import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, Typography, Divider } from '@mui/material';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  elevation = 1,
  ...props 
}) => {
  return (
    <MuiCard 
      elevation={elevation}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      className={className}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader
          title={
            title && (
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {title}
              </Typography>
            )
          }
          subheader={
            subtitle && (
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                {subtitle}
              </Typography>
            )
          }
          sx={{ pb: subtitle ? 1 : 2 }}
        />
      )}
      {(title || subtitle) && <Divider />}
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
