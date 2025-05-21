
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface AuthFormProps {
  onLogin: (username: string, password: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "trivily2025") {
      onLogin(username, password);
      toast.success("Prihlásenie úspešné");
    } else {
      toast.error("Nesprávne prihlasovacie údaje");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-center h-20 bg-booking-primary px-6">
        <Logo white />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Admin prihlásenie</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Používateľské meno</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Heslo</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">Prihlásiť sa</Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
