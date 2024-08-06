import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OTPComponent = ({ email }: { email: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [otp, setOTP] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const verifyYourOTP = async () => {
    try {
      setLoading(true);
      if (!otp) {
        toast({
          variant: "destructive",
          description: "Invalid OTP",
        });
        setErrorMessage("Invalid OTP");
        return;
      }

      const response = await axiosInstance.post("/api/v1/users/verify-otp", {
        email,
        otp,
      });
      toast({
        title: "Sign up successful",
        description: "Enjoy your journey of jobs",
      });
      setLoading(false);
      router.replace("/jobs");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message || error.message,
      });
      setErrorMessage(error.response.data.message || error.message);
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/v1/users/resend-otp", {
        email,
      });
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your email",
      });
      setLoading(false);
      setCountdown(60);
      setIsResendDisabled(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message || error.message,
      });
      setErrorMessage(error.response.data.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isLoading && "opacity-60"
      } text-center px-7 pt-5 pb-10 rounded items-center flex flex-col gap-10`}
    >
      <h1 className="text-2xl font-bold mt-4 mb-2">Enter OTP</h1>
      <InputOTP
        value={otp}
        onChange={(value) => setOTP(value)}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="flex flex-col gap-1">
        <span>Do you want to resend OTP? </span>
        {isResendDisabled ? (
          <span className="text-gray-500">
            Resend OTP in {countdown} seconds
          </span>
        ) : (
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={resendOTP}
          >
            Resend OTP
          </span>
        )}
      </p>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      <Button onClick={verifyYourOTP} className="w-full">
        Verify OTP
      </Button>
    </div>
  );
};

export default OTPComponent;
