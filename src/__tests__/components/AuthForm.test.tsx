import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../components/AuthForm';
import { BrowserRouter } from 'react-router-dom';
import * as auth from '../../firebase/auth';

jest.mock('../../firebase/auth', () => ({
  signIn: jest.fn(),
  registerUser: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
  });

  it('switches to registration form', () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Register'));

    expect(screen.getByText('Join Learning League')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (auth.signIn as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(auth.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles successful registration', async () => {
    (auth.registerUser as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Register'));
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(auth.registerUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    (auth.signIn as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});