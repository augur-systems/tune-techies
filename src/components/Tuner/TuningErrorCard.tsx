import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface TuningErrorCardProps {
  title: string;
  description: string;
  suggestions: string[];
  onRetry: () => void;
}

/**
 * @returns a card that displays an error message and suggestions for the user to resolve the error.
 */
export function TuningErrorCard({ title, description, suggestions, onRetry }: TuningErrorCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Box display="flex" height="100vh">
      <Card sx={{ minWidth: 275, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h5" color="error">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="black" gutterBottom>
            {description}
          </Typography>
          {showDetails && (
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">{`${index + 1}. ${suggestion}`}</Typography>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={onRetry}>
            Try Again
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
