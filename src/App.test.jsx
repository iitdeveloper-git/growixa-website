import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

function renderAt(path) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRoutes />
    </MemoryRouter>
  );
}

describe('routing', () => {
  it('renders the home page at /', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /working while you sleep/i })
    ).toBeInTheDocument();
  });

  it('renders a not-found page for an unknown path', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument();
  });
});
