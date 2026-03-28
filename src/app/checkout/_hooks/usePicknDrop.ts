"use client";
import { useState, useEffect } from "react";
import {
  getBranches,
  getVendorBranch,
  getDeliveryRate,
} from "@/lib/pickndropService";
import type { PndBranch } from "@/lib/pickndropService";
import { PND_CONCURRENCY, PND_CACHE_TTL } from "@/lib/constants";

export const usePicknDrop = () => {
  const [deliverableBranches, setDeliverableBranches] = useState<PndBranch[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const vendor = await getVendorBranch();
        const allBranches = await getBranches();

        const CACHE_KEY = `pnd_deliverable_v3_${vendor.branch_name}`;

        // Try cache first
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const { timestamp, branches } = JSON.parse(raw);
            if (Date.now() - timestamp < PND_CACHE_TTL) {
              setDeliverableBranches(branches);
              setScanProgress(100);
              setLoading(false);
              return;
            }
          }
        } catch {
          /* ignore */
        }

        // Cache miss — scan all branches
        const deliverable: PndBranch[] = [];
        const candidates = allBranches.filter(
          (b) => b.branch_name !== vendor.branch_name,
        );
        let done = 0;

        for (let i = 0; i < candidates.length; i += PND_CONCURRENCY) {
          const batch = candidates.slice(i, i + PND_CONCURRENCY);
          const results = await Promise.allSettled(
            batch.map(async (branch) => {
              const rate = await getDeliveryRate({
                pickupBranch: vendor.branch_name,
                destinationBranch: branch.branch_name,
                location: vendor.location || vendor.branch_name,
                cityArea: vendor.branch_name,
              });
              return { branch, rate };
            }),
          );

          for (const r of results) {
            if (r.status === "fulfilled") {
              deliverable.push({
                ...r.value.branch,
                deliveryAmount:
                  r.value.rate.deliveryAmount ??
                  r.value.rate.totalDelivery ??
                  0,
              });
            }
            done++;
            setScanProgress(Math.round((done / candidates.length) * 100));
          }
        }

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), branches: deliverable }),
          );
        } catch {
          /* ignore */
        }

        setDeliverableBranches(deliverable);
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

  return { deliverableBranches, loading, error, scanProgress };
};
