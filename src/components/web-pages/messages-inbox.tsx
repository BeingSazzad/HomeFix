"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { useRoleAccess } from "@/hooks/use-role-access";
import { threads as seedThreads } from "@/Mockdata";
import type { ChatMessage, MessageThread } from "@/types";

type PendingFile = {
  name: string;
  size: string;
  type: string;
  url?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function previewLine(thread: MessageThread, role: "homeowner" | "pro") {
  const mine = role === "homeowner" ? "homeowner" : "pro";
  const who = thread.lastSender === mine ? "You" : role === "homeowner" ? thread.otherParty : "Maya Chen";
  return `${who}: ${thread.lastMessage}`;
}

export function MessagesInbox({ role = "homeowner" }: { role?: "homeowner" | "pro" }) {
  const { access } = useRoleAccess();
  const fileInput = useRef<HTMLInputElement>(null);
  const [threads, setThreads] = useState(() =>
    role === "pro"
      ? seedThreads.map((thread) => ({
          ...thread,
          otherParty: "Maya Chen",
          unread: thread.lastSender === "homeowner" ? Math.max(thread.unread, 1) : 0,
        }))
      : seedThreads,
  );
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<PendingFile | null>(null);
  const [fileError, setFileError] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const jobBase = role === "pro" ? "/pro/jobs" : "/account/jobs";
  const mySender = role === "pro" ? "pro" : "homeowner";
  const myName = role === "pro" ? "Ortega Plumbing" : "Maya Chen";
  const canSend = role === "homeowner" ? access.canHomeownerMessage : access.canProMessage;

  const active = useMemo(
    () => threads.find((thread) => thread.id === activeId) ?? null,
    [activeId, threads],
  );

  function openThread(id: string) {
    setActiveId(id);
    setMobileChat(true);
    setFile(null);
    setFileError("");
    setThreads((list) =>
      list.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              unread: 0,
              messages: thread.messages.map((message) => ({ ...message, read: true })),
            }
          : thread,
      ),
    );
  }

  function onFilePick(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    if (picked.size > 10 * 1024 * 1024) {
      setFileError("Keep files under 10 MB.");
      return;
    }
    setFileError("");
    const pending: PendingFile = {
      name: picked.name,
      size: formatSize(picked.size),
      type: picked.type || "file",
    };
    if (picked.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFile({ ...pending, url: reader.result });
        }
      };
      reader.readAsDataURL(picked);
      return;
    }
    setFile(pending);
  }

  function sendReply(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) {
      setFileError(access.blockedReason ?? "Messaging is locked for this role state.");
      return;
    }
    const body = draft.trim();
    if ((!body && !file) || !active) return;

    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: mySender,
      senderName: myName,
      body: body || (file ? `Sent ${file.name}` : ""),
      sentAt: "Just now",
      read: false,
      attachment: file
        ? { name: file.name, size: file.size, type: file.type, url: file.url }
        : undefined,
    };

    setThreads((list) =>
      list.map((thread) => {
        if (thread.id !== active.id) return thread;
        return {
          ...thread,
          messages: [...thread.messages, message],
          lastMessage: file && !body ? `Attachment: ${file.name}` : body,
          lastSender: mySender,
          updatedAt: "Just now",
          unread: 0,
        };
      }),
    );
    setDraft("");
    setFile(null);
    setFileError("");
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px]">Messages</h1>
        <p className="mt-1 text-sm text-copy">
          {role === "pro" && !canSend
            ? access.blockedReason ?? "Send locked until clearance and membership."
            : "Tied to each request."}
        </p>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <div className="grid min-h-[520px] lg:grid-cols-[320px_1fr]">
          <aside
            className={cn(
              "border-line lg:border-r",
              mobileChat ? "hidden lg:block" : "block",
            )}
          >
            <div className="border-b border-line px-4 py-3">
              <p className="font-display text-sm font-bold text-title">Inbox</p>
              <p className="text-xs text-muted">{threads.length} conversations</p>
            </div>
            <ul className="divide-y divide-line">
              {threads.map((thread) => {
                const selected = thread.id === activeId;
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => openThread(thread.id)}
                      className={cn(
                        "flex w-full gap-3 px-4 py-4 text-left transition-colors",
                        selected ? "bg-smoke" : "hover:bg-smoke/70",
                      )}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                        {initials(thread.otherParty)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="truncate font-display text-sm font-bold text-title">
                            {thread.otherParty}
                          </span>
                          <span className="shrink-0 text-[12px] text-muted">{thread.updatedAt}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-primary">
                          {thread.jobTitle}
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          <span className="truncate text-sm text-copy">{previewLine(thread, role)}</span>
                          {thread.unread > 0 ? (
                            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 font-display text-[12px] font-bold text-white">
                              {thread.unread}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section
            className={cn(
              "flex min-h-[520px] flex-col",
              mobileChat ? "flex" : "hidden lg:flex",
            )}
          >
            {active ? (
              <>
                <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:px-5">
                  <button
                    type="button"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line text-title lg:hidden"
                    onClick={() => setMobileChat(false)}
                    aria-label="Back to inbox"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                    {initials(active.otherParty)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <p className="truncate font-display text-sm font-bold text-title">{active.otherParty}</p>
                      <Link
                        href={`${jobBase}/${active.jobId}`}
                        className="shrink-0 text-xs font-semibold text-primary"
                      >
                        View request
                      </Link>
                    </div>
                    <p className="truncate text-sm text-copy">{active.jobTitle}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto bg-surface/60 px-4 py-5 md:px-5">
                  {active.messages.map((message) => {
                    const mine = message.sender === mySender;
                    return (
                      <div
                        key={message.id}
                        className={cn("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-[14px] px-4 py-3 md:max-w-[70%]",
                            mine ? "bg-primary text-white" : "bg-white text-title soft-shadow",
                          )}
                        >
                          <p
                            className={cn(
                              "font-display text-xs font-bold",
                              mine ? "text-white/80" : "text-primary",
                            )}
                          >
                            {mine ? "You" : message.senderName}
                          </p>
                          {message.body ? (
                            <p className={cn("mt-1 text-sm leading-6", mine ? "text-white" : "text-copy")}>
                              {message.body}
                            </p>
                          ) : null}
                          {message.attachment ? (
                            <div
                              className={cn(
                                "mt-2 overflow-hidden rounded-[10px]",
                                mine ? "bg-white/15" : "bg-smoke",
                              )}
                            >
                              {message.attachment.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={message.attachment.url}
                                  alt={message.attachment.name}
                                  className="max-h-48 w-full object-cover"
                                />
                              ) : null}
                              <div className="flex items-center gap-2 px-3 py-2">
                                <FileText className={cn("h-4 w-4 shrink-0", mine ? "text-white" : "text-primary")} />
                                <div className="min-w-0">
                                  <p className={cn("truncate text-sm font-semibold", mine ? "text-white" : "text-title")}>
                                    {message.attachment.name}
                                  </p>
                                  <p className={cn("text-[12px]", mine ? "text-white/70" : "text-muted")}>
                                    {message.attachment.size}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <p className={cn("mt-2 text-[12px]", mine ? "text-white/65" : "text-muted")}>
                            {message.sentAt}
                            {mine ? ` · ${message.read ? "Seen" : "Sent"}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={sendReply} className="border-t border-line bg-white p-4 md:p-5">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx"
                    className="hidden"
                    onChange={onFilePick}
                  />
                  <TextArea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={canSend ? `Reply to ${active.otherParty}…` : "Messaging locked for this membership state"}
                    className="min-h-[88px]"
                    disabled={!canSend}
                  />
                  {file ? (
                    <div className="mt-3 flex items-center gap-3 rounded-[10px] border border-line bg-smoke px-3 py-2">
                      {file.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.url} alt="" className="h-10 w-10 rounded-[8px] object-cover" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-primary">
                          <FileText className="h-4 w-4" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-title">{file.name}</p>
                        <p className="text-[12px] text-muted">{file.size}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove file"
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-muted hover:bg-white hover:text-title"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                  {fileError ? <p className="mt-2 text-sm text-error">{fileError}</p> : null}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!canSend}
                      onClick={() => fileInput.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach file
                    </Button>
                    <Button type="submit" size="sm" disabled={!canSend || (!draft.trim() && !file)}>
                      <Send className="h-4 w-4" />
                      {canSend ? "Send reply" : "Locked"}
                    </Button>
                  </div>
                  <p className="mt-2 text-[12px] text-muted">JPG, PNG, PDF, or DOC · max 10 MB</p>
                </form>
              </>
            ) : (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-title">No conversation selected</p>
                  <p className="mt-1 text-sm text-copy">Pick a thread from the inbox.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
