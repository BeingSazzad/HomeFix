"use client";

import { useState } from "react";
import Link from "next/link";
import { QuoteCard } from "@/components/shared/quote-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusTracker } from "@/components/shared/status-tracker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea } from "@/components/ui/field";
import { useRoleAccess } from "@/hooks/use-role-access";
import { selectJob, selectQuotesForJob } from "@/lib/marketplace";
import {
  getCategory,
  professionals,
  propertyTypeLabels,
  threadsForJob,
  urgencyLabels,
} from "@/Mockdata";
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
            {job.status !== "cancelled" && job.status !== "completed" ? (
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
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "getting_quotes" }));
                    setSavedMsg("Reposted.");
                  }}
                >
                  Repost
                </Button>
              </>
            ) : null}
            {job.status === "hired" || job.status === "scheduled" || job.status === "in_progress" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(setJobStatus({ jobId: id, status: "completed" }));
                  setSavedMsg("Marked completed.");
                }}
              >
                Mark completed
              </Button>
            ) : null}
          </div>
        ) : null}
        {savedMsg ? <p className="mt-3 text-sm text-success">{savedMsg}</p> : null}
      </div>

      {canHire && job.status !== "cancelled" && job.status !== "completed" ? (
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
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl">Quotes</h2>
          <p className="text-sm text-muted">{quotes.length}</p>
        </div>
        {quotes.length === 0 ? (
          <p className="mt-2 text-sm text-copy">No quotes yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} canHire={canHire && job.status !== "cancelled"} />
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
                placeholder="How did the work go?"
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

      {canHire ? (
        <details className="rounded-[12px] border border-line bg-white p-4">
          <summary className="cursor-pointer font-display text-sm font-bold text-title">Report a problem</summary>
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
              dispatch(
                addNotification({
                  title: "Report submitted",
                  body: "Support will review.",
                  href: `/account/jobs/${id}`,
                  createdAt: "Just now",
                  role: "homeowner",
                }),
              );
              setDisputeNote("");
              setSavedMsg("Report submitted.");
            }}
          >
            Submit report
          </Button>
        </details>
      ) : null}
    </div>
  );
}
