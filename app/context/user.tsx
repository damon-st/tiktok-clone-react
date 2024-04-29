"use client";

import { account, ID } from "@/libs/AppWriteClient";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, type UserContextTypes } from "../types";
import userGetProfileByUserId from "../hooks/userGetProfileByUserId";
import userCreateProfile from "../hooks/useCreateProfile";

const UserContext = createContext<UserContextTypes | null>(null);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const checkUser = async () => {
    try {
      const currentSession = await account.getSession("current");
      if (!currentSession) return;
      const promise = (await account.get()) as any;
      const profile = await userGetProfileByUserId(promise?.$id);
      const userTemp: User = {
        id: promise.$id,
        name: promise.name,
        bio: profile.bio,
        image: profile.image,
      };
      setUser(userTemp);
    } catch (error) {
      console.log(error);

      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const promise = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await userCreateProfile(
        promise.$id,
        name,
        String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID!),
        ""
      );
      await checkUser();
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, pasword: string) => {
    try {
      await account.createEmailPasswordSession(email, pasword);
      await checkUser();
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const values = { user, register, login, logout, checkUser };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
