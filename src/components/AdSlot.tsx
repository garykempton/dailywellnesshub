"use client";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className={`ad-slot ${className}`} data-ad-slot={slot}>
        <span>Ad Space — {format}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
