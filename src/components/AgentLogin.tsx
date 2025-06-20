import { useState } from 'react';

interface Props {
  onLogin: (key: string) => void;
}

export default function AgentLogin({ onLogin }: Props) {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(key);
  };

  return (
    <div className="bg-[#F4F7FB] p-4 min-h-screen">
      <div className="login-card mt-20">
        <h2 className="text-xl font-bold mb-4 text-[#1A2233] text-center">Agent Login</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="login-input"
            required
            placeholder="Enter API Key"
          />
          <button
            type="submit"
            className="btn-primary w-full py-3 text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}