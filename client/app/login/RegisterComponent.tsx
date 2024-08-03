import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
const RegisterComponent = () => {
  const { toast } = useToast();
  const { register } = useUser();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    if (password !== confirmPass) {
      toast({
        variant: "destructive",
        description: "Password didn't match",
      });
      setErrorMessage("Password didn't match");
      return;
    }

    setErrorMessage("");

    try {
      await register(name, email, password);
      console.log("Registration successful");
      toast({
        title: "Sign up successfull",
        description: "Enjoy your journey of jobs",
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
      <h1 className="text-2xl font-bold mt-4 mb-2">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            required
            placeholder="Enter name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="flex flex-col gap-2">
          <Label>Confirm Password</Label>
          <Input
            required
            placeholder="Confirm password"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
};

export default RegisterComponent;
