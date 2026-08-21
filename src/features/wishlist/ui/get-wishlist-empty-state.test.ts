import { describe, expect, it } from "vitest";

import { getWishlistEmptyState } from "@/features/wishlist/ui/get-wishlist-empty-state";

const copy = {
  title: "My Wishlist",
  empty: "Your wishlist is empty",
  emptyDescription: "Start adding products to your wishlist to save them for later.",
  totalCount: "Total items in wishlist",
  browseProducts: "Browse Products",
  signInPrompt: "Sign in to save products to your wishlist.",
} as const;

describe("getWishlistEmptyState", () => {
  it("sends guests to login with the sign-in prompt", () => {
    const state = getWishlistEmptyState({
      isSignedIn: false,
      locale: "hy",
      copy,
      loginLabel: "Login",
    });

    expect(state.heading).toBe(copy.empty);
    expect(state.description).toBe(copy.signInPrompt);
    expect(state.actionLabel).toBe("Login");
    expect(state.actionHref).toBe("/hy/login?next=%2Fhy%2Fwishlist");
  });

  it("sends signed-in users to the catalog from the empty wishlist", () => {
    const state = getWishlistEmptyState({
      isSignedIn: true,
      locale: "en",
      copy,
      loginLabel: "Login",
    });

    expect(state.description).toBe(copy.emptyDescription);
    expect(state.actionLabel).toBe(copy.browseProducts);
    expect(state.actionHref).toBe("/en/products");
  });
});
