import { getCurrentUser } from "@/lib/appwrite";
import { CustomModels } from "@/lib/customtypes";
import { FC, createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: CustomModels.User | null;
  isLoading: any;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: CustomModels.User) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a Global Provider");
  }
  return context;
};

export const GlobalProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CustomModels.User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        setIsLoggedIn,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
