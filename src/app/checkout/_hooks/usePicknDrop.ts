"use client";
import { useState, useEffect } from "react";
import {
  getBranches,
  getVendorBranch,
  getDeliveryRate,
} from "@/lib/pickndropService";
import type { PndDestination } from "@/lib/pickndropService";
import { PND_CONCURRENCY, PND_CACHE_TTL } from "@/lib/constants";

// Pick & Drop's `area` array isn't reliably one locality per entry — an
// account can have it configured as a single entry containing every
// locality comma-joined together (confirmed from a live response:
// area: ["Thamel,Basantapur,New Road,Swayambhu,Lazimpat,...Kathmandu Valley"]).
// This normalizes any shape (clean array OR comma-blob OR mixed) into a
// flat, deduplicated list of real locality names.
function parseAreaNames(rawArea: string[] | undefined): string[] {
  const names = new Set<string>();
  (rawArea ?? []).forEach((entry) => {
    entry
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((name) => names.add(name));
  });
  return Array.from(names);
}

export const usePicknDrop = () => {
  const [destinations, setDestinations] = useState<PndDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const vendor = await getVendorBranch();
        const allBranches = await getBranches();

        const CACHE_KEY = `pnd_destinations_v6_${vendor.branch_name}`;

        // Try cache first
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const { timestamp, destinations: cached } = JSON.parse(raw);
            if (Date.now() - timestamp < PND_CACHE_TTL) {
              setDestinations(cached);
              setScanProgress(100);
              setLoading(false);
              return;
            }
          }
        } catch {
          /* ignore */
        }

        // Cache miss — scan all branches
        const deliverable: {
          branch_name: string;
          area?: string[];
          deliveryAmount: number;
        }[] = [];
        const failed: { branch: string; reason: string }[] = [];
        const candidates = allBranches.filter(
          (b) => b.branch_name !== vendor.branch_name,
        );
        let done = 0;

        for (let i = 0; i < candidates.length; i += PND_CONCURRENCY) {
          const batch = candidates.slice(i, i + PND_CONCURRENCY);
          const results = await Promise.allSettled(
            batch.map(async (branch) => {
              // location/city_area here describe the PICKUP side (this
              // vendor), not the destination — that's how Pick & Drop's
              // get_delivery_rate expects them, confirmed against
              // https://pickndrop.apidog.io/delivery-charge-calculator-20525651e0
              const rate = await getDeliveryRate({
                pickupBranch: vendor.branch_name,
                destinationBranch: branch.branch_name,
                location: vendor.location || vendor.branch_name,
                cityArea: vendor.branch_name,
              });
              return { branch, rate };
            }),
          );

          for (let j = 0; j < results.length; j++) {
            const r = results[j];
            if (r.status === "fulfilled") {
              deliverable.push({
                branch_name: r.value.branch.branch_name,
                area: r.value.branch.area,
                deliveryAmount:
                  r.value.rate.deliveryAmount ??
                  r.value.rate.totalDelivery ??
                  0,
              });
            } else {
              // Previously swallowed entirely — now surfaced so it's
              // possible to tell "branch genuinely unavailable" apart from
              // "delivery-rate lookup failed for some other reason" (e.g.
              // a test-account quirk) instead of guessing.
              failed.push({
                branch: batch[j].branch_name,
                reason:
                  r.reason instanceof Error
                    ? r.reason.message
                    : String(r.reason),
              });
            }
            done++;
            setScanProgress(Math.round((done / candidates.length) * 100));
          }
        }

        if (failed.length > 0) {
          console.warn(
            `[PND] ${failed.length} branch(es) excluded from delivery options (rate lookup failed):`,
            failed,
          );
        }

        // One destination per BRANCH (not per locality) — the "Delivery
        // Branch" dropdown should only ever show branch names like
        // "Kathmandu Valley". The individual localities under that branch
        // (Thamel, Basantapur, New Road, ...) are parsed separately into
        // `areas`, which feeds a distinct "Area / Locality" field once a
        // branch is picked.
        const flattened: PndDestination[] = deliverable.map((b) => ({
          key: b.branch_name,
          label: b.branch_name,
          branchName: b.branch_name,
          areas: parseAreaNames(b.area),
          deliveryAmount: b.deliveryAmount,
        }));

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), destinations: flattened }),
          );
        } catch {
          /* ignore */
        }

        setDestinations(flattened);
      } catch (err) {
        console.error("[PND] Init failed:", err);
        setError(
          "Could not load delivery options. Check your API credentials.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { destinations, loading, error, scanProgress };
};
