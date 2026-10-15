"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextArea } from "@/components/ui/field";
import { replyToReview, addNotification } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function ProReviewsPage() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => state.features.reviews.filter((item) => item.proId === "pro-1"));
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [requested, setRequested] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Reviews</h1>
          <p className="mt-1 text-sm text-copy">Project-based feedback from homeowners.</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setRequested(true);
            dispatch(
              addNotification({
                title: "Review requested",
                body: "A review request was sent to a past client in this demo.",
                href: "/pro/reviews",
                createdAt: "Just now",
                role: "pro",
              }),
            );
          }}
        >
          Request a review
        </Button>
      </div>
      {requested ? <p className="mt-3 text-sm text-success">Review request queued.</p> : null}
      <div className="mt-6 space-y-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-sm font-bold text-title">{review.author}</p>
              <p className="text-sm font-semibold text-primary">{review.rating.toFixed(1)} / 5</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-copy">{review.body}</p>
            <p className="mt-2 text-[12px] text-muted">{review.createdAt}</p>
            {review.reply ? (
              <p className="mt-3 rounded-[10px] bg-smoke px-3 py-2 text-sm text-copy">
                <span className="font-semibold text-title">Your reply: </span>
                {review.reply}
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                <TextArea
                  value={replyDraft[review.id] ?? ""}
                  onChange={(event) => setReplyDraft((prev) => ({ ...prev, [review.id]: event.target.value }))}
                  placeholder="Reply to this review"
                  className="min-h-20"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!(replyDraft[review.id] ?? "").trim()}
                  onClick={() => {
                    dispatch(replyToReview({ id: review.id, reply: replyDraft[review.id].trim() }));
                    setReplyDraft((prev) => ({ ...prev, [review.id]: "" }));
                  }}
                >
                  Post reply
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
