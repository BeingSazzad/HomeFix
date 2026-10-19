"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QuoteComparePanel } from "@/components/shared/quote-compare-panel";
import { QuoteCard } from "@/components/shared/quote-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusTracker } from "@/components/shared/status-tracker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { useRoleAccess } from "@/hooks/use-role-access";
import {
  selectBooking,
  selectChangeRequests,
  selectCompletion,
  selectJob,
  selectQuotesForJob,
} from "@/lib/marketplace";
import {
  getCategory,
  getPro,
  professionals,
  propertyTypeLabels,
  threadsForJob,
  urgencyLabels,
} from "@/Mockdata";
import {
  addChangeRequest,
  homeownerConfirmComplete,
  proMarkComplete,
  requestReschedule,
  resolveChangeRequest,
} from "@/redux/slices/marketplaceSlice";
import {
  addNotification,
  addReview,
  invitePro,
  setJobStatus,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function RequestDetail({
  id,
  backHref,
  backLabel,
  inboxHref,
  canHire = false,
  viewer = "homeowner",
}: {
  id: string;
  backHref: string;
  backLabel: string;
  inboxHref?: string;
  canHire?: boolean;
  viewer?: "homeowner" | "pro";
}) {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const job = useAppSelector((state) => selectJob(state, id));
  const quotes = useAppSelector((state) => selectQuotesForJob(state, id));
  const booking = useAppSelector((state) => selectBooking(state, id));
  const changeRequests = useAppSelector((state) => selectChangeRequests(state, id));
  const completion = useAppSelector((state) => selectCompletion(state, id));
  const photosForJob = useAppSelector((state) => state.features.jobPhotos[id] ?? []);
  const invited = useAppSelector((state) => state.features.invitedPros[id] ?? []);
  const favorites = useAppSelector((state) => state.features.favorites);
  const isProView = viewer === "pro";
  const marketplaceReady = useAppSelector((state) => state.marketplace.hydrated);
  const hiredQuoteId = useAppSelector((state) => state.marketplace.hiredByJob[id]);
  const hiredQuote = quotes.find((quote) => quote.id === hiredQuoteId);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewBody, setReviewBody] = useState("");
  const [disputeNote, setDisputeNote] = useState("");
  const [inviteId, setInviteId] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("10:00");
  const [changeAmount, setChangeAmount] = useState("");
  const [changeReason, setChangeReason] = useState("");

  const sortedQuotes = useMemo(
    () =>
      [...quotes].sort((a, b) => {
        const rank = (s: string) =>
          s === "accepted" ? 0 : s === "countered" ? 1 : s === "pending" ? 2 : 3;
        return rank(a.status) - rank(b.status) || a.amount - b.amount;
      }),
    [quotes],
  );

  const compareSet = sortedQuotes.filter((q) => compareIds.includes(q.id));

  if (!marketplaceReady) {
    return (
      <div className="rounded-[16px] border border-line bg-white p-6">
        <p className="text-sm text-muted">Loading request…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
        <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
          ← {backLabel}
        </Link>
        <div className="rounded-[16px] border border-line bg-white p-6 md:p-8">
          <h1 className="text-[28px]">Request not found</h1>
          <p className="mt-2 text-[16px] leading-7 text-copy">
            This job is missing or was cleared from this browser. Posted requests stay on this device only in the demo.
          </p>
          <div className="mt-5">
            <Button href={backHref} size="sm">
              {backLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const homeownerLabel = isProView
    ? access.canSeeContact
      ? job.homeownerName
      : "Homeowner · contact locked"
    : job.homeownerName;
  const category = getCategory(job.categorySlug);
  const messages = threadsForJob(job.id);
  const hiredPro = hiredQuote ? getPro(hiredQuote.proId) : null;
  const meta = [
    category?.name,
    isProView ? `${job.city}, ${job.state} · ZIP ${job.zip}` : `${job.city}, ${job.state} ${job.zip}`,
    urgencyLabels[job.urgency],
    job.budget,
    job.propertyType ? propertyTypeLabels[job.propertyType] : null,
    `Posted ${job.postedAt}`,
  ].filter(Boolean);
  const invitePool = professionals.filter(
    (pro) =>
      pro.clearance === "cleared" &&
      (favorites.includes(pro.id) || pro.categorySlug === job.categorySlug),
  );

  const workActive =
    job.status === "hired" ||
    job.status === "scheduled" ||
    job.status === "in_progress" ||
    job.status === "awaiting_confirm";

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
        ← {backLabel}
      </Link>

      <div className="rounded-[16px] border border-line bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[28px]">{job.title}</h1>
            <p className="mt-2 text-sm text-muted">{meta.join(" · ")}</p>
            {isProView ? <p className="mt-1 text-sm text-copy">Posted by {homeownerLabel}</p> : null}
          </div>
          <StatusBadge status={job.status} />
        </div>
        <div className="mt-4">
          <StatusTracker status={job.status} />
        </div>
        <p className="mt-4 text-[16px] leading-7 text-copy">{job.description}</p>
        {photosForJob.length ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photosForJob.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="h-20 w-full rounded-[10px] object-cover" />
            ))}
          </div>
        ) : null}

        {canHire ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.status !== "cancelled" && job.status !== "completed" && job.status !== "disputed" ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "cancelled" }));
                    setSavedMsg("Request closed.");
                  }}
                >
                  Cancel request
                </Button>
                {!hiredQuoteId ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      dispatch(setJobStatus({ jobId: id, status: "getting_quotes" }));
                      setSavedMsg("Reposted for new offers.");
                    }}
                  >
                    Repost
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
        {savedMsg ? <p className="mt-3 text-sm text-success">{savedMsg}</p> : null}
      </div>

      {/* Booking panel */}
      {booking && workActive ? (
        <Card>
          <h2 className="text-lg">Booking</h2>
          <dl className="mt-3 grid gap-2 text-sm text-copy sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Pro</dt>
              <dd className="font-semibold text-title">{hiredPro?.businessName ?? "Professional"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Agreed price</dt>
              <dd className="font-semibold text-title">${booking.agreedPrice}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Schedule</dt>
              <dd>
                {booking.scheduledDate} · {booking.scheduledTime}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Payment</dt>
              <dd>Pay the pro directly — not through LocalHomeFix</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-6 text-copy">{booking.scopeSnapshot}</p>

          {(canHire || isProView) && job.status !== "awaiting_confirm" && job.status !== "completed" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Field label="New date">
                <TextField
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </Field>
              <Field label="New time">
                <TextField
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!rescheduleDate}
                  onClick={() => {
                    dispatch(
                      requestReschedule({
                        jobId: id,
                        scheduledDate: rescheduleDate,
                        scheduledTime: rescheduleTime,
                      }),
                    );
                    setSavedMsg("Schedule updated.");
                  }}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {isProView && (job.status === "scheduled" || job.status === "hired") ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(setJobStatus({ jobId: id, status: "in_progress" }));
                  setSavedMsg("Marked in progress.");
                }}
              >
                Start work
              </Button>
            ) : null}
            {isProView && (job.status === "in_progress" || job.status === "scheduled") && !completion?.proMarkedAt ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(proMarkComplete({ jobId: id }));
                  dispatch(setJobStatus({ jobId: id, status: "awaiting_confirm" }));
                  dispatch(
                    addNotification({
                      title: "Work marked complete",
                      body: "Confirm completion when you’re satisfied, then pay the pro directly.",
                      href: `/account/jobs/${id}`,
                      createdAt: "Just now",
                      role: "homeowner",
                    }),
                  );
                  setSavedMsg("Waiting for homeowner confirmation.");
                }}
              >
                Mark work complete
              </Button>
            ) : null}
            {canHire && job.status === "awaiting_confirm" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(homeownerConfirmComplete({ jobId: id }));
                  dispatch(setJobStatus({ jobId: id, status: "completed" }));
                  setSavedMsg("Completion confirmed. Leave a review when ready.");
                }}
              >
                Confirm completion
              </Button>
            ) : null}
          </div>
          {completion?.proMarkedAt && !completion.homeownerConfirmedAt ? (
            <p className="mt-3 text-sm text-amber-800">
              Pro marked complete. Homeowner confirmation unlocks the review step.
            </p>
          ) : null}
        </Card>
      ) : null}

      {/* Change requests */}
      {(isProView || canHire) && hiredQuoteId && workActive ? (
        <Card>
          <h2 className="text-lg">Change requests</h2>
          <p className="mt-1 text-sm text-copy">
            Extra work or price changes need homeowner approval before the agreed total updates.
          </p>
          {isProView ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr_auto]">
              <Field label="Extra ($)">
                <TextField
                  type="number"
                  min={1}
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="75"
                />
              </Field>
              <Field label="Why">
                <TextField
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Corroded shutoff valve needs replace"
                />
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  size="sm"
                  disabled={!changeAmount || changeReason.trim().length < 6}
                  onClick={() => {
                    dispatch(
                      addChangeRequest({
                        jobId: id,
                        amount: Number(changeAmount),
                        reason: changeReason.trim(),
                      }),
                    );
                    dispatch(
                      addNotification({
                        title: "Change request",
                        body: `Pro requested +$${changeAmount} — review on your job.`,
                        href: `/account/jobs/${id}`,
                        createdAt: "Just now",
                        role: "homeowner",
                      }),
                    );
                    setChangeAmount("");
                    setChangeReason("");
                    setSavedMsg("Change request sent.");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : null}
          <ul className="mt-4 space-y-2">
            {changeRequests.length === 0 ? (
              <li className="text-sm text-muted">No change requests yet.</li>
            ) : (
              changeRequests.map((cr) => (
                <li
                  key={cr.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-semibold text-title">+${cr.amount}</span> — {cr.reason}
                    <span className="ml-2 text-muted">({cr.status})</span>
                  </span>
                  {canHire && cr.status === "pending" ? (
                    <span className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          dispatch(resolveChangeRequest({ id: cr.id, status: "approved" }));
                          setSavedMsg("Change approved — agreed price updated.");
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => dispatch(resolveChangeRequest({ id: cr.id, status: "rejected" }))}
                      >
                        Reject
                      </Button>
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </Card>
      ) : null}

      {canHire && job.status !== "cancelled" && job.status !== "completed" && !hiredQuoteId ? (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Invite a pro" className="min-w-[220px] flex-1">
            <NativeSelect value={inviteId} onChange={(event) => setInviteId(event.target.value)}>
              <option value="">Select</option>
              {invitePool.map((pro) => (
                <option key={pro.id} value={pro.id}>
                  {pro.businessName}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Button
            type="button"
            size="sm"
            disabled={!inviteId}
            onClick={() => {
              dispatch(invitePro({ jobId: id, proId: inviteId }));
              dispatch(
                addNotification({
                  title: "Pro invited",
                  body: "Invite sent.",
                  href: `/account/jobs/${id}`,
                  createdAt: "Just now",
                  role: "homeowner",
                }),
              );
              setInviteId("");
              setSavedMsg("Invite sent.");
            }}
          >
            Invite
          </Button>
          {invited.length ? <p className="text-sm text-muted">Invited: {invited.length}</p> : null}
        </div>
      ) : null}

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl">Offers</h2>
          <p className="text-sm text-muted">
            {quotes.length} · compare side by side before you hire
          </p>
        </div>
        {/* New: proper compare modal — replaces old inline table */}
        {compareSet.length >= 2 ? (
          <QuoteComparePanel
            quotes={compareSet}
            jobId={id}
            onClose={() => setCompareIds([])}
          />
        ) : null}
        {sortedQuotes.length === 0 ? (
          <p className="mt-2 text-sm text-copy">No offers yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {sortedQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                canHire={canHire && job.status !== "cancelled" && job.status !== "disputed"}
                compareMode={canHire && !hiredQuoteId}
                selected={compareIds.includes(quote.id)}
                onToggleCompare={() =>
                  setCompareIds((ids) =>
                    ids.includes(quote.id)
                      ? ids.filter((x) => x !== quote.id)
                      : ids.length >= 3
                        ? ids
                        : [...ids, quote.id],
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl">Messages</h2>
          {inboxHref ? (
            <Link href={inboxHref} className="font-display text-sm font-bold text-primary">
              Open inbox
            </Link>
          ) : null}
        </div>
        {messages.length === 0 ? (
          <p className="mt-2 text-sm text-copy">No messages yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {messages.map((thread) => (
              <li key={thread.id} className="py-3">
                <p className="font-display text-sm font-bold text-title">{thread.otherParty}</p>
                <p className="mt-1 text-sm text-copy">
                  {thread.lastSender === "homeowner" ? "You" : thread.otherParty}: {thread.lastMessage}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canHire && job.status === "completed" ? (
        <Card>
          <h2 className="text-lg">Leave a review</h2>
          <div className="mt-3 space-y-3">
            <Field label="Rating">
              <NativeSelect value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Okay</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Bad</option>
              </NativeSelect>
            </Field>
            <Field label="Review">
              <TextArea
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                placeholder="Quality, communication, and overall experience…"
              />
            </Field>
            <Button
              type="button"
              size="sm"
              disabled={reviewBody.trim().length < 8}
              onClick={() => {
                dispatch(
                  addReview({
                    jobId: id,
                    proId: hiredQuote?.proId ?? "pro-1",
                    author: job.homeownerName,
                    rating: Number(reviewRating),
                    body: reviewBody.trim(),
                    createdAt: "Just now",
                  }),
                );
                setReviewBody("");
                setSavedMsg("Review posted.");
              }}
            >
              Submit review
            </Button>
          </div>
        </Card>
      ) : null}

      {canHire && job.status !== "cancelled" ? (
        <details className="rounded-[12px] border border-line bg-white p-4">
          <summary className="cursor-pointer font-display text-sm font-bold text-title">
            Report a problem / open dispute
          </summary>
          <p className="mt-2 text-sm text-copy">
            Use this for safety issues, no-shows, or unresolved quality problems. Opens a disputed status on this job.
          </p>
          <TextArea
            className="mt-3"
            value={disputeNote}
            onChange={(event) => setDisputeNote(event.target.value)}
            placeholder="What happened?"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-3"
            disabled={disputeNote.trim().length < 8}
            onClick={() => {
              dispatch(setJobStatus({ jobId: id, status: "disputed" }));
              dispatch(
                addNotification({
                  title: "Dispute opened",
                  body: "Support will review. Keep messages and photos for context.",
                  href: `/account/jobs/${id}`,
                  createdAt: "Just now",
                  role: "homeowner",
                }),
              );
              setDisputeNote("");
              setSavedMsg("Dispute opened.");
            }}
          >
            Open dispute
          </Button>
        </details>
      ) : null}
    </div>
  );
}
