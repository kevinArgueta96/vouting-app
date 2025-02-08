"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CocktailDetail from "./cocktail-detail";
import {
  cocktailService,
  ratingService,
  featureFlagService,
} from "../../../services/supabase";
import { getUserUuid } from "../../../lib/user-session";
import { Modal } from "../../../components/ui/modal";
import { Database } from "../../../types/supabase";
import { useTranslations, useLocale } from "next-intl";
import { routes, getRoute } from "../../../config/routes";

type Rating = {
  [key: string]: number | string | undefined;
  appearance?: number;
  taste?: number;
  innovativeness?: number;
  user_email?: string;
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
  const [validationEnabled, setValidationEnabled] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [cocktailData, _votes, isValidationEnabled] =
          await Promise.all([
            cocktailService.getCocktailById(Number(id)),
            cocktailService.getCocktailVotes(Number(id)),
            featureFlagService.isFeatureEnabled("VALIDATE_REPEAT_VOUTE"),
          ]);

        if (mounted) {
          console.log(_votes)
          setCocktail(cocktailData);
          setValidationEnabled(isValidationEnabled);
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
      const userUuid = getUserUuid();

      // Always try to submit the rating - let the database constraint handle duplicates
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
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: ratings.user_email as string,
              subject: `${cocktail.name} - Cocktail Details`,
              text: `
Thank you for rating ${cocktail.name}!

Cocktail Details:
Name: ${cocktail.name}
Brand: ${cocktail.brand}
Description: ${cocktail.description}

We appreciate your participation!
              `,
              html: `
<h2>Thank you for rating ${cocktail.name}!</h2>

<h3>Cocktail Details:</h3>
<p><strong>Name:</strong> ${cocktail.name}</p>
<p><strong>Brand:</strong> ${cocktail.brand}</p>
<p><strong>Description:</strong> ${cocktail.description}</p>

<p>We appreciate your participation!</p>
              `,
            }),
          });

          if (!emailResponse.ok) {
            const emailResult = await emailResponse.json();
            console.error("Failed to send email:", emailResult.error);
            setErrorModal({
              isOpen: true,
              title: t("modal.errorTitle"),
              message: t("modal.emailError"),
            });
            return;
          }
        } catch (error) {
          console.error("Error sending email:", error);
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
