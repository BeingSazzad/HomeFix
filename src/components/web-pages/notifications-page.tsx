"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { markAllNotificationsRead, markNotificationRead } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function NotificationsPage({ role }: { role: "homeowner" | "pro" }) {
  const dispatch = useAppDispatch();
  const notes = useAppSelector((state) =>
    state.features.notifications.filter((item) => item.role === role || item.role === "all"),
  );
  const unread = notes.filter((item) => !item.read).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Notifications</h1>
          <p className="mt-1 text-sm text-copy">{unread ? `${unread} unread` : "All caught up"}</p>
        </div>
        {unread ? (
          <button
            type="button"
            onClick={() => dispatch(markAllNotificationsRead(role))}
            className="font-display text-sm font-bold text-primary hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {notes.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No notifications" description="Quotes, messages, and membership updates show up here." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {notes.map((note) => (
            <li
              key={note.id}
              className={cn("flex gap-3 py-4", note.read ? "opacity-70" : "bg-white")}
            >
              <span
                className={cn(
                  "mt-2 h-2 w-2 shrink-0 rounded-full",
                  note.read ? "bg-transparent" : "bg-primary",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={note.href}
                    onClick={() => {
                      if (!note.read) dispatch(markNotificationRead(note.id));
                    }}
                    className="font-display text-sm font-bold text-title hover:text-primary"
                  >
                    {note.title}
                  </Link>
                  <time className="text-[12px] text-muted">{note.createdAt}</time>
                </div>
                <p className="mt-1 text-sm leading-6 text-copy">{note.body}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <Link href={note.href} className="font-semibold text-primary">
                    Open
                  </Link>
                  {!note.read ? (
                    <button
                      type="button"
                      onClick={() => dispatch(markNotificationRead(note.id))}
                      className="font-semibold text-muted hover:text-title"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
