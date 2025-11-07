import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Link as LinkIcon, AlertTriangle } from "lucide-react";
import type { LinkListTheme } from "@shared/schema";

interface LinkListEntry {
  label: string;
  url: string;
}

interface LinkListData {
  id: string;
  theme: LinkListTheme;
  links: LinkListEntry[];
  createdAt: string;
}

interface LinkListPageProps {
  id: string;
}

const themeClasses: Record<LinkListTheme, { container: string; item: string; title: string; description: string }> = {
  minimal: {
    container: "space-y-4",
    item: "block rounded-lg border border-border bg-background px-4 py-3 transition hover:border-primary",
    title: "text-base font-semibold",
    description: "text-sm text-muted-foreground",
  },
  cards: {
    container: "space-y-4",
    item: "block rounded-xl border border-primary/40 bg-primary/5 px-5 py-4 shadow-sm transition hover:bg-primary/10",
    title: "text-base font-semibold text-primary",
    description: "text-sm text-primary/80",
  },
  spotlight: {
    container: "space-y-3",
    item: "block rounded-full bg-primary px-6 py-3 text-center font-medium text-primary-foreground shadow transition hover:shadow-lg",
    title: "text-base font-semibold",
    description: "hidden",
  },
};

export default function LinkListPage({ id }: LinkListPageProps) {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<LinkListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/link-lists/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("This link list no longer exists.");
          }
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Unable to load link list");
        }

        const payload = await response.json();
        if (active) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load link list");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!loading && error) {
      const timeout = window.setTimeout(() => setLocation("/"), 3500);
      return () => window.clearTimeout(timeout);
    }
  }, [error, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md space-y-3">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">We couldn't load that link list</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground">You'll be redirected shortly.</p>
        </div>
      </div>
    );
  }

  const classes = themeClasses[data.theme];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="mb-10 text-center space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
            <LinkIcon className="w-3.5 h-3.5" /> Curated Links
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Explore this link collection</h1>
          <p className="text-sm text-muted-foreground">
            Access the resources curated just for you. Tap any link below to open it instantly.
          </p>
        </div>

        <div className={`rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur ${classes.container}`}>
          {data.links.map((link, index) => (
            <a key={`${link.url}-${index}`} href={link.url} className={classes.item} target="_blank" rel="noopener noreferrer">
              <span className={classes.title}>{link.label}</span>
              {classes.description !== "hidden" && (
                <span className={classes.description}>{link.url}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
