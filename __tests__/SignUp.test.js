import { render, screen } from '@testing-library/react';

import SignUp from '../src/components/Auth/SignUp';

import { BrowserRouter } from 'react-router-dom';

const component = (
  <BrowserRouter>
    <SignUp />
  </BrowserRouter>
);

describe('Testing SignUp page', () => {
  test('Should render h1 tag with "SignUp" text', () => {
    render(component);

    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('Should render label with "Email" text', () => {
    render(component);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
