import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TuningErrorCard } from './TuningErrorCard'

describe('TuningErrorCard', () => {
  const props = {
    title: 'Test Error',
    description: 'This is a test error description.',
    suggestions: [
      'Check your connection.',
      'Restart your device.',
      'Try again later.',
    ],
    onRetry: jest.fn(),
  }

  test('renders the title and description', () => {
    render(<TuningErrorCard {...props} />)
    expect(screen.getByText(props.title)).toBeTruthy()
    expect(screen.getByText(props.description)).toBeTruthy()
  })

  test('renders the retry button and handles click', () => {
    render(<TuningErrorCard {...props} />)
    const retryButton = screen.getByText('Try Again')
    expect(retryButton).toBeTruthy()
    fireEvent.click(retryButton)
    expect(props.onRetry).toHaveBeenCalled()
  })

  test('toggles the details when the expand button is clicked', () => {
    render(<TuningErrorCard {...props} />)
    const expandButton = screen.getByLabelText(/show details/i)
    expect(expandButton).toBeTruthy()

    // Ensure suggestions are not visible initially
    props.suggestions.forEach((suggestion, index) => {
      expect(screen.queryByText(`${index + 1}. ${suggestion}`)).toBeNull()
    })

    // Click to expand details
    fireEvent.click(expandButton)
    props.suggestions.forEach((suggestion, index) => {
      expect(screen.queryByText(`${index + 1}. ${suggestion}`)).toBeTruthy()
    })

    // Click to hide details
    fireEvent.click(expandButton)
    props.suggestions.forEach((suggestion, index) => {
      expect(screen.queryByText(`${index + 1}. ${suggestion}`)).toBeNull()
    })
  })
})
