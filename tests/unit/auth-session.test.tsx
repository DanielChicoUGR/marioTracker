import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => {
  const auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  };
  return { supabase: { auth } };
});

import { AuthProvider } from "@/features/auth/AuthProvider";

describe("AuthProvider", () => {
  it("expone estado de carga inicial", async () => {
    function Probe() {
      return <div data-testid="ready">ok</div>;
    }

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ready")).toBeInTheDocument();
    });
  });
});
