import { useState, useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite = <T>(fn: () => Promise<T[]>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const posts = await fn();
      setData(posts);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { isLoading, data, refetch };
};

export default useAppwrite;
