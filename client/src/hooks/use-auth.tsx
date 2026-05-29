import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { Family, Kid } from "@shared/schema";

interface AuthData {
  family: Pick<Family, "id" | "email" | "name" | "isRegistered" | "createdAt">;
  kids: Kid[];
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AuthData | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  return {
    family: data?.family ?? null,
    kids: data?.kids ?? [],
    isLoading,
    isAuthenticated: !!data?.family,
    logout,
  };
}
