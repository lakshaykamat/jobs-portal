import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "../context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const LoginComponent = () => {
  const { login } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        description: "Please fill in all fields",
      });
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");

    try {
      await login(email, password);
      console.log("Login successful");
      toast({
        title: "Login successful",
        description: "Enjoy your journey :)",
      });
      router.replace("/jobs");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-secondary px-7 pt-5 pb-10 rounded flex flex-col gap-3">
      <h1 className="text-2xl font-bold mt-4 mb-2">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            required
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            required
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
};

export default LoginComponent;
