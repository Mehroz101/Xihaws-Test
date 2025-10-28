import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
    color: #1a202c;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    outline: none;
  }
`;

// Container Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

// Layout Components
export const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 20px;
`;

export const Main = styled.main`
  padding: 40px 0;
`;

// Card Components
export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const CardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
`;

export const CardBody = styled.div`
  padding: 20px;
`;

// Form Components
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// Button Components
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger'; size?: 'sm' | 'md' | 'lg' }>`
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '8px 16px';
      case 'lg': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  border-radius: 6px;
  font-weight: 500;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '14px';
      case 'lg': return '18px';
      default: return '16px';
    }
  }};
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
          
          &:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
          }
        `;
      case 'danger':
        return `
          background-color: #dc2626;
          color: white;
          
          &:hover {
            background-color: #b91c1c;
          }
        `;
      default:
        return `
          background-color: #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Grid Components
export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Text Components
export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
`;

export const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
`;

export const Text = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
`;

// Loading Component
export const LoadingSpinner = styled.div<{ size?: number }>`
  width: ${props => props.size || 32}px;
  height: ${props => props.size || 32}px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

// Utility Components
export const Flex = styled.div<{ direction?: 'row' | 'column'; justify?: string; align?: string; gap?: string }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
`;

export const Spacer = styled.div<{ size?: number }>`
  height: ${props => props.size || 20}px;
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;
