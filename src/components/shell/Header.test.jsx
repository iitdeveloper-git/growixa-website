import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

function setup() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders a banner landmark', () => {
    setup();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('links the brand to home', () => {
    setup();
    expect(screen.getByRole('link', { name: /growixa/i })).toHaveAttribute('href', '/');
  });

  it('renders both disclosure menus collapsed', () => {
    setup();
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: /solutions/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders the direct nav links', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute('href', '/roadmap');
  });

  it('renders the primary call to action', () => {
    setup();
    expect(screen.getByRole('link', { name: /start free/i })).toBeInTheDocument();
  });
});
