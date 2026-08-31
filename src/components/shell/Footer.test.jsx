import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

function setup() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('renders a contentinfo landmark', () => {
    setup();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('links all five engine stages', () => {
    setup();
    const group = screen.getByRole('navigation', { name: /the engine/i });
    ['Find', 'Qualify', 'Create', 'Send', 'Manage'].forEach((name) => {
      expect(within(group).getByRole('link', { name })).toBeInTheDocument();
    });
  });

  it('states the honest build status in the base row', () => {
    setup();
    expect(
      screen.getByText(
        'Campaigns and contacts are live. Find and Create are in beta. Qualify ships Q4.'
      )
    ).toBeInTheDocument();
  });
});
