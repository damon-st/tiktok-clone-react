"use client";

import { type ShoErrorObjet } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import TextInput from "../TextInput";
import { useUser } from "@/app/context/user";
import { useGeneralStore } from "@/app/stores/general";

export default function Register() {
  const conextUser = useUser();
  const { setIsLoginOpen } = useGeneralStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!name) {
      setError({ type: "name", message: "A Name is required" });
      isError = true;
    } else if (!email) {
      setError({ type: "email", message: "An Email is required" });
      isError = true;
    } else if (!reg.test(email)) {
      setError({ type: "email", message: "The Email is not valid" });
      isError = true;
    } else if (!password) {
      setError({ type: "password", message: "A Password is required" });
      isError = true;
    } else if (password.length < 8) {
      setError({
        type: "password",
        message: "The password needs to be longer",
      });
      isError = true;
    }
    return isError;
  };

  const register = async () => {
    let isError = validate();
    if (isError) return;
    if (!conextUser) return;
    try {
      setLoading(true);
      await conextUser.register(name, email, password);
      setLoading(false);
      setIsLoginOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center text-[28px] mb-4 font-bold">Register</h1>
        <div className="px-6 pb-2">
          <TextInput
            string={name}
            placeHolder="Name"
            onUpdate={setName}
            inputType="text"
            error={showError("name")}
          />
        </div>
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
        <div className="px-6 pb-2">
          <TextInput
            string={confirmPassword}
            placeHolder="Confirm Password"
            onUpdate={setConfirmPassword}
            inputType="password"
            error={showError("confirmPassword")}
          />
        </div>

        <div className="px-6 pb-2 mt-6">
          <button
            disabled={loading}
            onClick={register}
            className={clsx(
              "flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm",
              !email || !password || !name || !confirmPassword
                ? "bg-gray-200"
                : "bg-[#F02C56]"
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
