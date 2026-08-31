import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hello() {
  return <h1>Growixa</h1>;
}

describe('test harness', () => {
  it('renders a component and finds it by role', () => {
    render(<Hello />);
    expect(screen.getByRole('heading', { name: 'Growixa' })).toBeInTheDocument();
  });
});
