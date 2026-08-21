import {
  LayoutDashboard,
  Lock,
  MapPin,
  Package,
  Trash2,
  User,
} from "lucide-react";

import type { ProfileNavId } from "@/features/profile/ui/profile-nav-items";

const ICON_CLASS = "h-5 w-5";

export function ProfileNavIcon({ id }: { id: ProfileNavId }) {
  switch (id) {
    case "dashboard":
      return <LayoutDashboard className={ICON_CLASS} aria-hidden />;
    case "orders":
      return <Package className={ICON_CLASS} aria-hidden />;
    case "personal":
      return <User className={ICON_CLASS} aria-hidden />;
    case "addresses":
      return <MapPin className={ICON_CLASS} aria-hidden />;
    case "password":
      return <Lock className={ICON_CLASS} aria-hidden />;
    case "deleteAccount":
      return <Trash2 className={ICON_CLASS} aria-hidden />;
  }
}
