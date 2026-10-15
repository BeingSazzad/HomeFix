import { Card } from "@/components/ui/card";
import { threads } from "@/Mockdata";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-[28px]">Messages</h1>
      <p className="mt-1 text-sm text-copy">Each thread stays attached to a request.</p>
      <div className="mt-6 space-y-3">
        {threads.map((thread) => (
          <Card key={thread.id}>
            <p className="font-display text-sm font-semibold text-primary">{thread.jobTitle}</p>
            <h2 className="mt-1 text-lg">{thread.otherParty}</h2>
            <p className="mt-2 text-sm text-copy">{thread.lastMessage}</p>
            <p className="mt-2 text-xs text-muted">{thread.updatedAt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
