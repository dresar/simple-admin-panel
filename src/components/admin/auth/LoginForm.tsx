import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { RefreshCw, Lock, User } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, getCaptcha } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    captcha: '',
  });
  
  const [captchaData, setCaptchaData] = useState({
    captcha: '',
    hash: '',
  });

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const data = await getCaptcha();
      setCaptchaData(data);
      setFormData(prev => ({ ...prev, captcha: '' }));
    } catch (err) {
      setError('Failed to load captcha');
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({
        identifier: formData.identifier,
        password: formData.password,
        captcha: formData.captcha,
        captchaHash: captchaData.hash,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      loadCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to access the dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Input
          label="Username or Email"
          name="identifier"
          type="text"
          value={formData.identifier}
          onChange={handleChange}
          placeholder="Enter username or email"
          required
          autoComplete="username"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          autoComplete="current-password"
        />

        <div className="space-y-1.5">
          <label className="admin-form-label">Captcha</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-14 bg-muted rounded-md flex items-center justify-center border border-border overflow-hidden">
              {captchaLoading ? (
                <RefreshCw className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : captchaData.captcha ? (
                <span className="text-2xl font-mono font-bold tracking-[0.5em] text-foreground select-none">
                  {captchaData.captcha}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={loadCaptcha}
              disabled={captchaLoading}
              className="h-14 px-3"
            >
              <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Input
          name="captcha"
          type="text"
          value={formData.captcha}
          onChange={handleChange}
          placeholder="Enter captcha code"
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          leftIcon={<User className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
}
