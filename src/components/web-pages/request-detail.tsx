"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { QuoteComparePanel } from "@/components/shared/quote-compare-panel";
import { QuoteCard } from "@/components/shared/quote-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusTracker } from "@/components/shared/status-tracker";
import { WorkOrderReceipt } from "@/components/shared/work-order-receipt";
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
  const [rescheduleWindow, setRescheduleWindow] = useState("10:00 AM – 12:00 PM (Late Morning)");
  const [changeAmount, setChangeAmount] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showProCompleteModal, setShowProCompleteModal] = useState(false);
  const [proCompletionNote, setProCompletionNote] = useState("");
  const [settlePaymentMethod, setSettlePaymentMethod] = useState<
    "zelle" | "card" | "cash" | "check" | "bank_transfer"
  >("zelle");
  const [settleInspected, setSettleInspected] = useState(true);
  const [selectedReviewTags, setSelectedReviewTags] = useState<string[]>([]);

  const sortedQuotes = useMemo(
    () =>
      [...quotes].sort((a, b) => {
        const rank = (s: string) =>
          s === "accepted" ? 0 : s === "pending" ? 1 : 2;
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
    job.status === "en_route" ||
    job.status === "in_progress" ||
    job.status === "awaiting_confirm";

  const arrivalWindowsList = [
    "8:00 AM – 10:00 AM (Early Morning)",
    "10:00 AM – 12:00 PM (Late Morning)",
    "1:00 PM – 3:00 PM (Early Afternoon)",
    "3:00 PM – 5:00 PM (Late Afternoon)",
    "Flexible (Anytime during business hours)",
  ];

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
        ← {backLabel}
      </Link>

      <div className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[26px] sm:text-[28px] font-bold text-title tracking-tight">{job.title}</h1>
            <p className="mt-2 text-sm text-muted">{meta.join(" · ")}</p>
            {isProView ? <p className="mt-1 text-sm text-copy font-medium">Posted by {homeownerLabel}</p> : null}
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
        {savedMsg ? <p className="mt-3 text-sm text-success font-medium">{savedMsg}</p> : null}
      </div>

      {/* LIVE OPERATIONAL STATUS CARDS */}
      {job.status === "en_route" ? (
        <div className="rounded-[20px] border border-primary/40 bg-gradient-to-r from-primary/10 via-blue-50/60 to-white p-5 shadow-xs flex items-start gap-4 animate-in fade-in">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-xs">
            <Truck className="h-5 w-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-title">
                {hiredPro?.name ?? hiredPro?.businessName ?? "Contractor"} is on the way (En Route)
              </h3>
              <span className="rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Live Tracking
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
              Your contractor has departed and is en route to your service address. Scheduled arrival window: <strong>{booking?.arrivalWindow || booking?.scheduledTime}</strong>. Please ensure the work area is clear.
            </p>
          </div>
        </div>
      ) : null}

      {job.status === "in_progress" ? (
        <div className="rounded-[20px] border border-amber-300 bg-amber-50/70 p-5 shadow-xs flex items-start gap-4 animate-in fade-in">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-600 text-white shadow-xs">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-title">
                Work in progress on-site
              </h3>
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Active Diagnostic &amp; Service
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
              Contractor is currently executing the agreed project scope. If any unexpected issues or replacement parts are discovered, the pro will submit an in-app Change Request below for your explicit approval before doing extra work.
            </p>
          </div>
        </div>
      ) : null}

      {job.status === "awaiting_confirm" ? (
        <div className="rounded-[20px] border border-emerald-300 bg-emerald-50/90 p-5 sm:p-6 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-title">
                    Contractor marked work 100% completed!
                  </h3>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    Action Required
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
                  Please inspect the completed work and test any fixtures/repairs. Once you are 100% satisfied, confirm completion to settle directly with zero platform markup.
                </p>
                {completion?.completionNotes ? (
                  <p className="mt-2 text-xs text-stone-700 italic border-l-2 border-emerald-500 pl-3">
                    Pro note: &ldquo;{completion.completionNotes}&rdquo;
                  </p>
                ) : null}
              </div>
            </div>
            {canHire ? (
              <Button
                type="button"
                size="md"
                onClick={() => setShowSettleModal(true)}
                className="shrink-0 rounded-full font-semibold shadow-xs"
              >
                Confirm &amp; Settle Direct →
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {job.status === "completed" ? (
        <div className="rounded-[20px] border border-emerald-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-base font-bold text-title">
                  Job Completed &amp; Settled
                </p>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                  $0 Platform Fee
                </span>
              </div>
              <p className="text-xs text-muted">
                Receipt #{booking?.paymentReceiptNumber || completion?.receiptNumber || "LHF-REC-842911"} · Protected by LocalHomeFix Guarantee
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowReceiptModal(true)}
              className="rounded-full gap-1.5 font-semibold border border-line hover:border-primary/40 hover:text-primary"
            >
              <FileCheck2 className="h-4 w-4 text-primary" />
              View Itemized Receipt &amp; PDF
            </Button>
          </div>
        </div>
      ) : null}

      {/* Booking panel */}
      {booking && (workActive || job.status === "completed") ? (
        <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
            <h2 className="font-display text-lg font-bold text-title">Appointment &amp; Booking</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> $1,000 Guarantee
            </span>
          </div>

          <dl className="mt-4 grid gap-3 text-sm text-copy sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted font-medium">Assigned Contractor</dt>
              <dd className="font-semibold text-title flex items-center gap-1.5 mt-0.5">
                <span>{hiredPro?.name ?? "Professional"}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Agreed Total Price</dt>
              <dd className="font-display text-lg font-bold text-title mt-0.5">${booking.agreedPrice}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Appointment &amp; Arrival Window</dt>
              <dd className="font-semibold text-title mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {booking.scheduledDate} · {booking.arrivalWindow || booking.scheduledTime}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Direct Settlement</dt>
              <dd className="text-xs text-muted mt-0.5">
                {booking.paymentMethod ? (
                  <span className="font-semibold text-emerald-700 capitalize">
                    Settled via {booking.paymentMethod} ($0 platform markup)
                  </span>
                ) : (
                  "Pay pro directly upon 100% completion ($0 platform markup)"
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-[12px] bg-smoke p-3.5 border border-line/60">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Agreed Scope Snapshot</p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-copy">{booking.scopeSnapshot}</p>
          </div>

          {/* Reschedule Option */}
          {(canHire || isProView) &&
          job.status !== "en_route" &&
          job.status !== "in_progress" &&
          job.status !== "awaiting_confirm" &&
          job.status !== "completed" ? (
            <div className="mt-5 border-t border-line/60 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Change Appointment Time</p>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
                <Field label="New Date">
                  <TextField
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </Field>
                <Field label="New 2-Hour Arrival Window">
                  <NativeSelect
                    value={rescheduleWindow}
                    onChange={(e) => setRescheduleWindow(e.target.value)}
                  >
                    {arrivalWindowsList.map((win) => (
                      <option key={win} value={win}>
                        {win}
                      </option>
                    ))}
                  </NativeSelect>
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
                          scheduledTime: rescheduleWindow,
                          arrivalWindow: rescheduleWindow,
                        }),
                      );
                      setSavedMsg("Appointment rescheduled successfully.");
                    }}
                    className="rounded-full border border-line"
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Pro & Customer Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line/60 pt-4">
            {/* Pro Operational Actions */}
            {isProView && (job.status === "scheduled" || job.status === "hired") ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "en_route" }));
                    dispatch(
                      addNotification({
                        title: "Contractor en route",
                        body: `${hiredPro?.name ?? "Your contractor"} has departed and is en route to your service location.`,
                        href: `/account/jobs/${id}`,
                        createdAt: "Just now",
                        role: "homeowner",
                      }),
                    );
                    setSavedMsg("Status updated: En Route. Homeowner notified.");
                  }}
                  className="rounded-full gap-1.5"
                >
                  <Truck className="h-4 w-4" />
                  On the way (En Route)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "in_progress" }));
                    dispatch(
                      addNotification({
                        title: "Work started on-site",
                        body: `${hiredPro?.name ?? "Your contractor"} has arrived on-site and started the diagnostic/repair.`,
                        href: `/account/jobs/${id}`,
                        createdAt: "Just now",
                        role: "homeowner",
                      }),
                    );
                    setSavedMsg("Marked in progress.");
                  }}
                  className="rounded-full gap-1.5 border border-line"
                >
                  <Wrench className="h-4 w-4" />
                  Start work directly
                </Button>
              </>
            ) : null}

            {isProView && job.status === "en_route" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(setJobStatus({ jobId: id, status: "in_progress" }));
                  dispatch(
                    addNotification({
                      title: "Contractor arrived on-site",
                      body: `${hiredPro?.name ?? "Your contractor"} arrived and started working.`,
                      href: `/account/jobs/${id}`,
                      createdAt: "Just now",
                      role: "homeowner",
                    }),
                  );
                  setSavedMsg("Marked in progress.");
                }}
                className="rounded-full gap-1.5"
              >
                <Wrench className="h-4 w-4" />
                Arrived on-site (Start Work)
              </Button>
            ) : null}

            {isProView && (job.status === "in_progress" || job.status === "en_route" || job.status === "scheduled") && !completion?.proMarkedAt ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowProCompleteModal(true)}
                className="rounded-full gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark work complete
              </Button>
            ) : null}

            {/* Homeowner Completion Action */}
            {canHire && job.status === "awaiting_confirm" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowSettleModal(true)}
                className="rounded-full gap-1.5 font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Inspect &amp; Confirm Completion
              </Button>
            ) : null}

            {/* View Receipt Button */}
            {job.status === "completed" ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowReceiptModal(true)}
                className="rounded-full gap-1.5 border border-line font-medium"
              >
                <FileCheck2 className="h-4 w-4 text-primary" />
                View Itemized Receipt
              </Button>
            ) : null}
          </div>

          {completion?.proMarkedAt && !completion.homeownerConfirmedAt ? (
            <p className="mt-3 text-xs font-medium text-amber-800">
              Pro marked complete. Homeowner inspection &amp; confirmation unlocks the review and receipt.
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
                  {pro.name} ({pro.trade})
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
        <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-title">
                Review {hiredPro?.name ?? "Your Contractor"}
              </h2>
              <p className="text-xs text-muted">
                Your verified review helps other homeowners find trustworthy pros.
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              Verified Hire
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Overall Rating">
              <NativeSelect value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>
                <option value="5">★★★★★ 5 — Excellent service, highly recommend</option>
                <option value="4">★★★★☆ 4 — Good work, satisfied</option>
                <option value="3">★★★☆☆ 3 — Average / okay</option>
                <option value="2">★★☆☆☆ 2 — Below expectations</option>
                <option value="1">★☆☆☆☆ 1 — Poor experience</option>
              </NativeSelect>
            </Field>

            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                What went well? (Select all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Punctual & on time",
                  "Fair & transparent pricing",
                  "Clean work area",
                  "High craftsmanship",
                  "Honest diagnosis",
                  "Wore boot covers indoors",
                ].map((tag) => {
                  const active = selectedReviewTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedReviewTags((prev) =>
                          active ? prev.filter((t) => t !== tag) : [...prev, tag],
                        )
                      }
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "bg-primary text-white shadow-xs"
                          : "bg-smoke border border-line text-copy hover:border-primary/40"
                      }`}
                    >
                      {active ? <Check className="h-3 w-3 stroke-[3]" /> : "+"} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Your Written Review">
              <TextArea
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                placeholder="Share specifics about communication, punctuality, and workmanship quality…"
                rows={3}
              />
            </Field>

            <Button
              type="button"
              size="sm"
              disabled={reviewBody.trim().length < 4 && selectedReviewTags.length === 0}
              onClick={() => {
                const combinedBody = [
                  selectedReviewTags.length
                    ? `[Highlights: ${selectedReviewTags.join(", ")}]`
                    : null,
                  reviewBody.trim(),
                ]
                  .filter(Boolean)
                  .join(" ");

                dispatch(
                  addReview({
                    jobId: id,
                    proId: hiredQuote?.proId ?? "pro-1",
                    author: job.homeownerName,
                    rating: Number(reviewRating),
                    body: combinedBody || "Excellent professional service.",
                    createdAt: "Just now",
                  }),
                );
                setReviewBody("");
                setSelectedReviewTags([]);
                setSavedMsg("Review published on contractor's profile!");
              }}
              className="rounded-full font-semibold"
            >
              Submit Verified Review
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

      {/* MODAL 1: WORK ORDER & RECEIPT MODAL */}
      {showReceiptModal ? (
        <WorkOrderReceipt
          job={job}
          booking={booking}
          pro={hiredPro}
          completion={completion}
          changeRequests={changeRequests}
          onClose={() => setShowReceiptModal(false)}
        />
      ) : null}

      {/* MODAL 2: HOMEOWNER DIRECT SETTLEMENT MODAL */}
      {showSettleModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSettleModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-smoke text-muted hover:text-title"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-title">Confirm Work Completion</h2>
                <p className="text-xs text-muted">Direct contractor settlement ($0 platform middleman fee)</p>
              </div>
            </div>

            <div className="mt-4 rounded-[14px] bg-smoke/80 p-4 border border-line/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-title">
                <span className="text-muted font-medium">Total direct settlement:</span>
                <span className="font-display text-lg font-bold text-title">${booking?.agreedPrice}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Assigned Contractor:</span>
                <span className="font-semibold text-title">{hiredPro?.name ?? "Professional"}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Direct Payment Method Used">
                <NativeSelect
                  value={settlePaymentMethod}
                  onChange={(e) =>
                    setSettlePaymentMethod(
                      e.target.value as "zelle" | "card" | "cash" | "check" | "bank_transfer",
                    )
                  }
                >
                  <option value="zelle">Zelle (Bank-to-Bank Transfer)</option>
                  <option value="card">Credit / Debit Card (Card Reader / Square)</option>
                  <option value="cash">Cash Settlement</option>
                  <option value="check">Personal or Bank Check</option>
                  <option value="bank_transfer">Direct ACH / Wire Transfer</option>
                </NativeSelect>
              </Field>

              <label className="flex items-start gap-2.5 pt-1 text-xs text-copy cursor-pointer">
                <input
                  type="checkbox"
                  checked={settleInspected}
                  onChange={(e) => setSettleInspected(e.target.checked)}
                  className="mt-0.5 rounded border-line text-primary focus:ring-primary"
                />
                <span>
                  I have inspected the finished work, tested all repaired fixtures, and confirm 100% satisfaction under the LocalHomeFix Workmanship Guarantee.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSettleModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!settleInspected}
                onClick={() => {
                  dispatch(
                    homeownerConfirmComplete({
                      jobId: id,
                      paymentMethod: settlePaymentMethod,
                    }),
                  );
                  dispatch(setJobStatus({ jobId: id, status: "completed" }));
                  dispatch(
                    addNotification({
                      title: "Job completed & settled",
                      body: `${job.homeownerName} confirmed completion and settlement via ${settlePaymentMethod.toUpperCase()}.`,
                      href: `/pro/jobs/${id}`,
                      createdAt: "Just now",
                      role: "pro",
                    }),
                  );
                  setShowSettleModal(false);
                  setShowReceiptModal(true);
                  setSavedMsg("Completion confirmed! Your official receipt is ready.");
                }}
                className="rounded-full font-semibold"
              >
                Confirm &amp; Generate Receipt
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 3: PRO COMPLETION SUMMARY MODAL */}
      {showProCompleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowProCompleteModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-smoke text-muted hover:text-title"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-title">Mark Work Complete</h2>
                <p className="text-xs text-muted">Notify homeowner to inspect and confirm direct settlement</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Field
                label="Completion Summary &amp; Notes (optional)"
                hint="Describe what was executed, tested, and cleaned"
              >
                <TextArea
                  value={proCompletionNote}
                  onChange={(e) => setProCompletionNote(e.target.value)}
                  placeholder="e.g. Replaced shutoff valve, tested supply line under full pressure for 15 mins, zero leaks detected. Cleaned and swept workspace."
                  rows={3}
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowProCompleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(
                    proMarkComplete({
                      jobId: id,
                      completionNotes: proCompletionNote.trim() || undefined,
                    }),
                  );
                  dispatch(setJobStatus({ jobId: id, status: "awaiting_confirm" }));
                  dispatch(
                    addNotification({
                      title: "Work marked complete",
                      body: `${hiredPro?.name ?? "Contractor"} finished the job. Inspect and confirm completion to settle.`,
                      href: `/account/jobs/${id}`,
                      createdAt: "Just now",
                      role: "homeowner",
                    }),
                  );
                  setShowProCompleteModal(false);
                  setSavedMsg("Work marked complete. Waiting for homeowner inspection & confirmation.");
                }}
                className="rounded-full font-semibold"
              >
                Send Completion Notice
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
