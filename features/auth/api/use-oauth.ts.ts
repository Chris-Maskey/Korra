import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";

export const useOAuth = () => {
  const supabase = createClient();

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/`,
      },
    });

    if (error) {
      console.error("OAuth Sign-In Error:", error.message);
    }
  };

  return { signInWithProvider };
};
