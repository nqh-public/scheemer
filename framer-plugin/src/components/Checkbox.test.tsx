import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', () => {
    const handleChange = vi.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    const checkbox = screen.getByRole('checkbox')
    checkbox.click()
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('handles checked state', () => {
    render(<Checkbox checked readOnly />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
