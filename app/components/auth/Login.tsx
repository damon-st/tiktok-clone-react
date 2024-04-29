"use client";

import { type ShoErrorObjet } from "@/app/types";
import { useState } from "react";
import TextInput from "../TextInput";
import clsx from "clsx";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@/app/context/user";
import { useGeneralStore } from "@/app/stores/general";

export default function Login() {
  const { setIsLoginOpen } = useGeneralStore();
  const contextUser = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ShoErrorObjet | null>(null);
  const showError = (type: string) => {
    if (error && Object.entries(error).length > 0 && error?.type == type) {
      return error.message;
    }
    return "";
  };
  const validate = () => {
    setError(null);
    let isError = false;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) {
      setError({ type: "email", message: "An Email is required" });
      isError = true;
    } else if (!reg.test(email)) {
      setError({ type: "email", message: "The Email is not valid" });
      isError = true;
    }
    return isError;
  };
  const login = async () => {
    let isError = validate();
    if (isError) return;
    if (!contextUser) return;
    try {
      setLoading(true);
      await contextUser.login(email, password);
      setLoading(false);
      setIsLoginOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };
  return (
    <>
      <div>
        <h1 className="text-center text-[28px] mb-4 font-bold">Log in</h1>
        <div className="px-6 pb-2">
          <TextInput
            string={email}
            placeHolder="Email address"
            onUpdate={setEmail}
            inputType="email"
            error={showError("email")}
          />
        </div>
        <div className="px-6 pb-2">
          <TextInput
            string={password}
            placeHolder="Password"
            onUpdate={setPassword}
            inputType="password"
            error={showError("password")}
          />
        </div>

        <div className="px-6 pb-2 mt-6">
          <button
            disabled={loading}
            onClick={login}
            className={clsx(
              "flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm",
              !email || !password ? "bg-gray-200" : "bg-[#F02C56]"
            )}
          >
            {loading ? (
              <BiLoaderCircle
                className="animate-spin"
                color="#ffffff"
                size={25}
              />
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
