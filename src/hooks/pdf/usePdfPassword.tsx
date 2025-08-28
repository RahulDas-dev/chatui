import { useState, useEffect, useCallback } from 'react';

interface UsePdfPasswordProps {
  isPasswordProtected?: boolean;
  savedPassword?: string;
  onPasswordSaved?: (password: string) => void;
}

export const usePdfPassword = ({
  isPasswordProtected,
  savedPassword,
  onPasswordSaved,
}: UsePdfPasswordProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(savedPassword || '');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordAttempts, setPasswordAttempts] = useState<number>(0);
  const [isPasswordValidated, setIsPasswordValidated] = useState<boolean>(!!savedPassword);

  // Check if the file is password protected when component mounts
  useEffect(() => {
    if (isPasswordProtected && !savedPassword) {
      // If password protected and no saved password, show dialog
      setShowPasswordDialog(true);
    } else if (isPasswordProtected && savedPassword) {
      // If we have a saved password, use it
      setPassword(savedPassword);
    }
  }, [isPasswordProtected, savedPassword]);

  const handlePasswordSubmit = useCallback((enteredPassword: string) => {
    setPassword(enteredPassword);
    setShowPasswordDialog(false);
    setPasswordAttempts((prev) => prev + 1);
    setPasswordError(null);
    // Reset validation status when trying a new password
    setIsPasswordValidated(false);
  }, []);

  const handlePasswordCancel = useCallback(() => {
    setShowPasswordDialog(false);
    setPassword('');
  }, []);

  const onDocumentLoadSuccess = useCallback(() => {
    setPasswordError(null);

    // Mark password as validated on successful load
    if (isPasswordProtected && password) {
      setIsPasswordValidated(true);
    }

    // If we successfully loaded with a password, save it
    if (isPasswordProtected && password && onPasswordSaved) {
      onPasswordSaved(password);
    }
  }, [isPasswordProtected, password, onPasswordSaved]);

  return {
    password,
    passwordAttempts,
    isPasswordValidated,
    showPasswordDialog,
    passwordError,
    setShowPasswordDialog,
    setPasswordError,
    handlePasswordSubmit,
    handlePasswordCancel,
    onDocumentLoadSuccess,
  };
};
