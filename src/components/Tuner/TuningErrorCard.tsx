'use client'

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

/**
 * Props for TuningErrorCard component.
 */
interface TuningErrorCardProps {
  /** The title of the error. */
  title: string
  /** The description of the error. */
  description: string
  /** A list of suggestions to resolve the error. */
  suggestions: string[]
  /** Callback to retry the action that caused the error. */
  onRetry: () => void
}

/**
 * TuningErrorCard component displays an error message with suggestions and a retry button.
 * @param {TuningErrorCardProps} props - The props for the TuningErrorCard component.
 * @returns The TuningErrorCard component.
 */
function TuningErrorCard(props: TuningErrorCardProps): JSX.Element {
  const { title, description, suggestions, onRetry } = props
  const [showDetails, setShowDetails] = useState(false)

  /**
   * Toggles the display of the error details.
   */
  function toggleDetails(): void {
    setShowDetails(!showDetails)
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
    >
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ErrorOutlineIcon
              color="error"
              sx={{ mr: 1 }}
              aria-label="error icon"
            />
            <Typography variant="h5" component="div">
              {title}
            </Typography>
          </Box>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
          {showDetails && (
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <Typography variant="body2">
                    {`${index + 1}. ${suggestion}`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
        <CardActions>
          <IconButton
            onClick={toggleDetails}
            color="primary"
            aria-label={showDetails ? 'Hide Details' : 'Show Details'}
          >
            {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Button
            variant="text"
            color="primary"
            onClick={onRetry}
            sx={{ ml: 'auto' }}
          >
            Try Again
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export { TuningErrorCard }
