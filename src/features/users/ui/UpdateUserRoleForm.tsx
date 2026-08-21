"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import {
  ADMIN_LABEL,
  ADMIN_SECTION_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import { updateUserRoleAction } from "@/features/users/application/update-user";
import {
  USER_ROLES,
  type UserRole,
} from "@/features/users/domain/user-lifecycle";

type UpdateUserRoleFormProps = {
  locale: string;
  userId: string;
  currentRole: UserRole;
  disabled?: boolean;
};

export function UpdateUserRoleForm({
  locale,
  userId,
  currentRole,
  disabled = false,
}: UpdateUserRoleFormProps) {
  const router = useRouter();
  const copy = getAdminCopy(locale).users;
  const common = getAdminCopy(locale).common;
  const [error, setError] = useState<string | null>(null);
  const roleOptions = USER_ROLES.filter((role) => role !== currentRole);
  const [role, setRole] = useState(roleOptions[0] ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();

          startTransition(async () => {
            setError(null);
            const result = await updateUserRoleAction(locale, {
              userId,
              role: role as UserRole,
            });
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            router.refresh();
          });
        }}
      >
        <h3 className={ADMIN_SECTION_TITLE}>{copy.role}</h3>
        <p className="text-sm text-gray-700">
          {formatAdminMessage(copy.current, { value: currentRole })}
        </p>
        <div>
          <span className={ADMIN_LABEL}>{copy.newRole}</span>
          <SelectDropdown
            name="role"
            ariaLabel={copy.newRole}
            value={role}
            options={roleOptions.map((item) => ({
              label: item,
              value: item,
            }))}
            disabled={disabled || isPending}
            deferChange={false}
            className="mt-1"
            onValueChange={setRole}
          />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="sm" disabled={disabled || isPending}>
          {isPending ? common.updating : copy.updateRole}
        </Button>
      </form>
    </Card>
  );
}
