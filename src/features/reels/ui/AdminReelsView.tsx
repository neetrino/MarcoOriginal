"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import {
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { ADMIN_BADGE } from "@/features/admin/ui/status-badge";
import { deleteReelAction } from "@/features/reels/application/manage-reels";
import type {
  AdminReelListItem,
  AdminReelsStats,
} from "@/features/reels/application/queries";
import { ReelDrawer } from "@/features/reels/ui/ReelDrawer";
import { ReelPreviewDialog } from "@/features/reels/ui/ReelPreviewDialog";

type AdminReelsViewProps = {
  locale: string;
  reels: AdminReelListItem[];
  stats: AdminReelsStats;
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-xl p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </Card>
  );
}

export function AdminReelsView({ locale, reels, stats }: AdminReelsViewProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewReel, setPreviewReel] = useState<AdminReelListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<AdminReelListItem | null>(
    null,
  );

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const reelId = pendingDelete.id;

    startTransition(async () => {
      setError(null);
      const result = await deleteReelAction(locale, { reelId });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setPendingDelete(null);
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>Reels management</h1>
        <Button
          type="button"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add reel
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Reels list" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="likes" value={stats.likes} />
        <StatCard label="views" value={stats.views} />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <Card className="rounded-xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">Reels list</h2>
          <p className="text-sm text-gray-500">
            {stats.total === 1 ? "1 reel" : `${stats.total} reels`}
          </p>
        </div>

        {reels.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-600">
            No reels yet. Add a video to show it below the homepage hero.
          </p>
        ) : (
          <ul className="space-y-3">
            {reels.map((reel) => (
              <li
                key={reel.id}
                className="rounded-xl border border-gray-200 p-3 sm:p-4"
              >
                <AdminReelRow
                  reel={reel}
                  disabled={isPending}
                  onPreview={() => setPreviewReel(reel)}
                  onDelete={() => setPendingDelete(reel)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {drawerOpen ? (
        <ReelDrawer
          locale={locale}
          open
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}

      <ReelPreviewDialog
        reel={previewReel}
        onClose={() => setPreviewReel(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete"
        description={
          pendingDelete
            ? deleteConfirmDescription("reel", pendingDelete.title)
            : ""
        }
        isPending={isPending}
        onClose={() => {
          if (!isPending) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

function AdminReelRow({
  reel,
  disabled,
  onPreview,
  onDelete,
}: {
  reel: AdminReelListItem;
  disabled: boolean;
  onPreview: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {reel.videoUrl ? (
            <video
              src={reel.videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              No video
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {reel.title}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">ID: {reel.shortId}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`${ADMIN_BADGE} bg-violet-100 text-violet-800`}>
              admin_upload
            </span>
            <span className={`${ADMIN_BADGE} bg-green-100 text-green-800`}>
              approved
            </span>
            {reel.isActive ? (
              <span className={`${ADMIN_BADGE} bg-teal-100 text-teal-800`}>
                active
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:items-end">
        <p className="text-sm text-gray-600">
          likes: {reel.likeCount} · views: {reel.viewCount}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !reel.videoUrl}
            onClick={onPreview}
          >
            Preview
          </Button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className="rounded-xl bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
