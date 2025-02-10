"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CocktailDetail from "./cocktail-detail";
import {
  cocktailService,
  ratingService,
  featureFlagService,
  userSessionService,
} from "../../../services/supabase";
import { getUserUuid, createUserSession } from "../../../lib/user-session";
import { Modal } from "../../../components/ui/modal";
import { Database } from "../../../types/supabase";
import { useTranslations, useLocale } from "next-intl";
import { routes, getRoute } from "../../../config/routes";

type Rating = {
  [key: string]: number | string | boolean | undefined;
  appearance?: number;
  taste?: number;
  innovativeness?: number;
  user_email?: string;
  wantRecipe?: boolean;
  wantRaffle?: boolean;
};

type Cocktail = Database["public"]["Tables"]["cocktails"]["Row"];

interface Props {
  id: string;
}

export default function CocktailVotePage({ id }: Props) {
  const router = useRouter();
  const t = useTranslations("Vote");
  const locale = useLocale();
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [cocktailData, _votes] = await Promise.all([
          cocktailService.getCocktailById(Number(id)),
          cocktailService.getCocktailVotes(Number(id))
        ]);

        if (mounted) {
          setCocktail(cocktailData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleRatingSubmit = async (ratings: Rating) => {
    try {
      const userUuid = await getUserUuid();
      
      // Check if user session exists
      const sessionExists = await userSessionService.checkUserSession(userUuid);
      if (!sessionExists) {
        // Create user session if it doesn't exist
        await createUserSession(userUuid);
      }

      // Check if repeat vote validation is enabled
      const isValidateRepeatVoteEnabled = await featureFlagService.isFeatureEnabled("VALIDATE_REPEAT_VOUTE");
      
      if (isValidateRepeatVoteEnabled) {
        // Check if user has already voted for this cocktail
        const hasVoted = await ratingService.checkExistingVote(Number(id), userUuid);
        if (hasVoted) {
          throw new Error('alreadyVoted');
        }
      }

      // Submit the rating
      await ratingService.submitRating({
        cocktail_id: Number(id),
        appearance: ratings.appearance as number,
        taste: ratings.taste as number,
        innovativeness: ratings.innovativeness as number,
        user_email: ratings.user_email || null,
        user_uuid: userUuid,
      });

      // Send email if user provided their email
      if (ratings.user_email && cocktail) {
        try {
          console.log("Sending email to:", ratings.user_email);
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: ratings.user_email as string,
              cocktail,
              wantRecipe: ratings.wantRecipe,
              wantRaffle: ratings.wantRaffle
            }),
          });

          const emailResult = await emailResponse.json();
          
          if (!emailResponse.ok) {
            console.error("Failed to send email:", {
              status: emailResponse.status,
              statusText: emailResponse.statusText,
              result: emailResult
            });
            
            let errorMessage = t("modal.emailError");
            if (emailResult.error) {
              errorMessage += ` - ${emailResult.error}`;
              if (emailResult.details) {
                errorMessage += `\nDetails: ${JSON.stringify(emailResult.details, null, 2)}`;
              }
            }
            
            setErrorModal({
              isOpen: true,
              title: t("modal.errorTitle"),
              message: errorMessage,
            });
            return;
          }

          console.log("Email sent successfully:", emailResult);
        } catch (error) {
          console.error("Error sending email:", error);
          setErrorModal({
            isOpen: true,
            title: t("modal.errorTitle"),
            message: `${t("modal.emailError")} - ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
          return;
        }
      }

      await router.push(getRoute(routes.thanks, locale));
    } catch (error: unknown) {
      console.error("Error submitting rating:", error);
      if (error instanceof Error && error.message === 'alreadyVoted') {
        setErrorModal({
          isOpen: true,
          title: t("modal.alreadyVotedTitle"),
          message: t("modal.alreadyVotedMessage"),
        });
      } else {
        setErrorModal({
          isOpen: true,
          title: t("modal.errorTitle"),
          message: t("modal.errorMessage"),
        });
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F6F0] text-black flex items-center justify-center">
        <div className="text-center text-xl">{t("loading")}</div>
      </main>
    );
  }

  if (!cocktail) {
    return (
      <main className="min-h-screen bg-[#F9F6F0] text-black p-6">
        <div className="text-center text-xl mt-16">{t("notFound")}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F6F0] relative">
      {/* Main Content */}
      <CocktailDetail 
        cocktail={cocktail} 
        onSubmit={handleRatingSubmit}
      />
      
      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={t("modal.closeButton")}
      />
    </main>
  );
}
