/**
 * Live donation totals per programme, populated by the Zeffy webhook and
 * served from the same-origin PHP endpoint /api/donations.php.
 *
 * The site must never look broken when the backend is unavailable (local dev,
 * Airtable outage), so every failure resolves to an empty map and callers
 * simply render their static copy instead.
 */

import { useEffect, useState, useCallback } from "react";

export type ProgrammeDonations = {
  slug: string;
  raised: number;
  supporters: number;
  currency: string;
  lastGiftAt: string | null;
};

export type DonationSummary = Record<string, ProgrammeDonations>;

export async function fetchDonationSummary(): Promise<DonationSummary> {
  try {
    const res = await fetch("/api/donations.php", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return {};
    const body = (await res.json()) as { success?: boolean; programmes?: ProgrammeDonations[] };
    if (!body.success || !Array.isArray(body.programmes)) return {};
    return Object.fromEntries(body.programmes.map((p) => [p.slug, p]));
  } catch {
    return {};
  }
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Math.round(amount).toLocaleString()}`;
  }
}

export function formatGiftDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Fetches the summary once and exposes a refresh for post-donation updates. */
export function useDonationSummary() {
  const [summary, setSummary] = useState<DonationSummary>({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const next = await fetchDonationSummary();
    setSummary(next);
    setLoaded(true);
  }, []);

  useEffect(() => {
    let active = true;
    fetchDonationSummary().then((next) => {
      if (!active) return;
      setSummary(next);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return { summary, loaded, refresh };
}
