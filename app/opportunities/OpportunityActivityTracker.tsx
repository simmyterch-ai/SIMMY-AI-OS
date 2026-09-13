"use client";

import { useEffect } from "react";

type OpportunityActivityTrackerProps = {
  opportunityId: number;
  opportunitySlug: string;
  opportunityTitle: string;
};

export default function OpportunityActivityTracker({
  opportunityId,
  opportunitySlug,
  opportunityTitle,
}: OpportunityActivityTrackerProps) {
  useEffect(() => {
    async function recordActivity() {
      try {
        const response = await fetch("/api/accounts/activity", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "OPPORTUNITY_VIEWED",
            module: "Opportunities",
            title: opportunityTitle,
            description: "You viewed this opportunity.",
            itemId: opportunityId,
            itemSlug: opportunitySlug,
            itemUrl: `/opportunities/${opportunitySlug}`,
          }),
        });

        // A visitor who is not logged in will receive 401.
        // That is expected and should not affect the public page.
        if (!response.ok && response.status !== 401) {
          console.error(
            "Failed to record opportunity activity:",
            await response.text()
          );
        }
      } catch (error) {
        console.error(
          "Opportunity activity recording error:",
          error
        );
      }
    }

    recordActivity();
  }, [opportunityId, opportunitySlug, opportunityTitle]);

  return null;
}