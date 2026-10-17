"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { useRoleAccess } from "@/hooks/use-role-access";
import { getPro, threads as seedThreads } from "@/Mockdata";
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

/** Same rules for sent + received (iMessage/WhatsApp-style ~75% max). */
const BUBBLE =
  "inline-block w-fit max-w-[75%] rounded-[12px] px-3 py-2 text-left text-sm leading-5 [overflow-wrap:anywhere]";

export function MessagesInbox({ role = "homeowner" }: { role?: "homeowner" | "pro" }) {
  const { access } = useRoleAccess();
  const searchParams = useSearchParams();
  const dmProId = searchParams.get("dm");
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

  useEffect(() => {
    if (role !== "homeowner" || !dmProId) return;
    const pro = getPro(dmProId);
    if (!pro) return;
    const threadId = `dm-${pro.id}`;
    setThreads((list) => {
      if (list.some((t) => t.id === threadId)) return list;
      const thread: MessageThread = {
        id: threadId,
        jobId: `dm:${pro.id}`,
        jobTitle: `Chat with ${pro.businessName}`,
        otherParty: pro.businessName,
        proId: pro.id,
        unread: 0,
        lastMessage: "Say hello and share photos of the job.",
        lastSender: "homeowner",
        updatedAt: "Just now",
        isDirect: true,
        messages: [
          {
            id: `${threadId}-0`,
            sender: "pro",
            senderName: pro.businessName,
            body: `Hi — thanks for reaching out to ${pro.businessName}. Share a few details or photos and I’ll follow up.`,
            sentAt: "Just now",
            read: true,
          },
        ],
      };
      return [thread, ...list];
    });
    setActiveId(threadId);
    setMobileChat(true);
  }, [dmProId, role]);

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
    <div className="flex h-[calc(100dvh-11.5rem)] w-full min-w-0 flex-col md:h-[calc(100dvh-12.5rem)]">
      <div className="mb-3 shrink-0">
        <h1 className="text-[24px] md:text-[28px]">Messages</h1>
        <p className="mt-0.5 text-sm text-copy">
          {role === "pro" && !canSend
            ? access.blockedReason ?? "Send locked until clearance and membership."
            : "Tied to each request."}
        </p>
      </div>

      <div className="min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-[14px] border border-line bg-white">
        <div className="flex h-full w-full min-w-0">
          <aside
            className={cn(
              "flex min-h-0 w-full min-w-0 flex-col border-line lg:w-[340px] lg:shrink-0 lg:border-r",
              mobileChat ? "hidden lg:flex" : "flex",
            )}
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-3">
              <p className="font-display text-sm font-bold text-title">Inbox</p>
              <p className="text-[11px] text-muted">{threads.length}</p>
            </div>
            <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
              {threads.map((thread) => {
                const selected = thread.id === activeId;
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => openThread(thread.id)}
                      className={cn(
                        "flex h-[76px] w-full items-center gap-3 px-3 text-left transition-colors",
                        selected ? "bg-smoke" : "hover:bg-smoke/70",
                      )}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display text-xs font-bold text-white">
                        {initials(thread.otherParty)}
                      </span>
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="min-w-0 truncate font-display text-sm font-bold text-title">
                            {thread.otherParty}
                          </span>
                          <span className="shrink-0 whitespace-nowrap text-[11px] text-muted">
                            {thread.updatedAt}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-primary">{thread.jobTitle}</span>
                        <span className="mt-0.5 flex min-w-0 items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-[13px] text-copy">
                            {previewLine(thread, role)}
                          </span>
                          {thread.unread > 0 ? (
                            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1 font-display text-[11px] font-bold text-white">
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
              "min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
              mobileChat ? "flex" : "hidden lg:flex",
            )}
          >
            {active ? (
              <>
                <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-3 md:px-4">
                  <button
                    type="button"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-line text-title lg:hidden"
                    onClick={() => setMobileChat(false)}
                    aria-label="Back to inbox"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-xs font-bold text-white">
                    {initials(active.otherParty)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-sm font-bold text-title">{active.otherParty}</p>
                      {active.isDirect || active.jobId.startsWith("dm:") ? (
                        <Link
                          href={active.proId ? `/browse-pros/${active.proId}` : "/browse-pros"}
                          className="shrink-0 text-[12px] font-semibold text-primary"
                        >
                          View profile
                        </Link>
                      ) : (
                        <Link
                          href={`${jobBase}/${active.jobId}`}
                          className="shrink-0 text-[12px] font-semibold text-primary"
                        >
                          View request
                        </Link>
                      )}
                    </div>
                    <p className="truncate text-[13px] text-copy">{active.jobTitle}</p>
                  </div>
                </div>

                <div className="min-h-0 w-full min-w-0 flex-1 space-y-2 overflow-y-auto bg-surface/50 px-3 py-4 md:px-4">
                  {active.messages.map((message) => {
                    const mine = message.sender === mySender;
                    return (
                      <div
                        key={message.id}
                        className={cn("flex w-full min-w-0", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            BUBBLE,
                            mine ? "bg-primary text-white" : "border border-line bg-white text-copy",
                          )}
                        >
                          {message.body ? <p>{message.body}</p> : null}
                          {message.attachment ? (
                            <div
                              className={cn(
                                "mt-2 max-w-[240px] overflow-hidden rounded-[8px]",
                                mine ? "bg-white/15" : "bg-smoke",
                              )}
                            >
                              {message.attachment.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={message.attachment.url}
                                  alt={message.attachment.name}
                                  className="h-32 w-full object-cover"
                                />
                              ) : null}
                              <div className="flex items-center gap-2 px-2 py-1.5">
                                <FileText className={cn("h-3.5 w-3.5 shrink-0", mine ? "text-white" : "text-primary")} />
                                <div className="min-w-0">
                                  <p className={cn("truncate text-[12px] font-semibold", mine ? "text-white" : "text-title")}>
                                    {message.attachment.name}
                                  </p>
                                  <p className={cn("text-[11px]", mine ? "text-white/70" : "text-muted")}>
                                    {message.attachment.size}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <p className={cn("mt-1 text-[11px] leading-none", mine ? "text-white/70" : "text-muted")}>
                            {message.sentAt}
                            {mine ? ` · ${message.read ? "Seen" : "Sent"}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={sendReply} className="shrink-0 border-t border-line bg-white p-3">
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
                    placeholder={canSend ? `Reply to ${active.otherParty}…` : "Messaging locked"}
                    className="min-h-[64px]"
                    rows={2}
                    disabled={!canSend}
                  />
                  {file ? (
                    <div className="mt-2 flex items-center gap-2 rounded-[8px] border border-line bg-smoke px-2.5 py-1.5">
                      {file.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.url} alt="" className="h-8 w-8 rounded-[6px] object-cover" />
                      ) : (
                        <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-white text-primary">
                          <FileText className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-title">{file.name}</p>
                        <p className="text-[11px] text-muted">{file.size}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove file"
                        className="grid h-7 w-7 place-items-center text-muted hover:text-title"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                  {fileError ? <p className="mt-2 text-sm text-error">{fileError}</p> : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!canSend}
                      onClick={() => fileInput.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach
                    </Button>
                    <Button type="submit" size="sm" disabled={!canSend || (!draft.trim() && !file)}>
                      <Send className="h-4 w-4" />
                      {canSend ? "Send" : "Locked"}
                    </Button>
                  </div>
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
