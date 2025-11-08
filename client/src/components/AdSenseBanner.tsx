import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface AdSenseBannerProps {
  slot?: string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  className?: string;
  bordered?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseBanner({
  slot,
  format = "auto",
  layout,
  layoutKey,
  className,
  bordered = true,
}: AdSenseBannerProps) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
  const slotId = slot ?? import.meta.env.VITE_ADSENSE_DEFAULT_SLOT_ID;
  const bannerId = useId();

  useEffect(() => {
    if (!client || !slotId || typeof window === "undefined") {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-adsbygoogle-script]",
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-adsbygoogle-script", "true");
      document.head.appendChild(script);
    }

    const timeout = window.setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn("AdSense banner failed to render", error);
      }
    }, 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [client, slotId]);

  if (!client || !slotId) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        bordered && "rounded-xl border border-border bg-muted/40 px-4 py-3",
        className,
      )}
    >
      <ins
        key={`${bannerId}-${slotId}`}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
}
