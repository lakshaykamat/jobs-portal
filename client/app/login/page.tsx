"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterComponent from "./RegisterComponent";
import LoginComponent from "./LoginComponent";

const LoginPage = () => {
  return (
    <div className="container mx-auto my-12 px-4">
      <Tabs defaultValue="login" className=" sm:mx-auto max-w-md mx-4">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="signup">
            Sign Up
          </TabsTrigger>
          <TabsTrigger className="w-full" value="login">
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <RegisterComponent />
        </TabsContent>
        <TabsContent value="login">
          <LoginComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
