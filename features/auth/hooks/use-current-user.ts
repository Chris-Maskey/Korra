import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCurrentUser = () => {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        toast.error(error.message);
      }
      return user;
    },
  });

  return query;
};
