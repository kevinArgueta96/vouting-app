"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingEmojis } from "../../../components/ui/loading-emojis";
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

// Full database type

// Simplified translation type for email purposes
type EmailTranslation = {
  locale: string;
  recipe: string | null;
};

type Cocktail = Database["public"]["Tables"]["cocktails"]["Row"] & {
  translations?: EmailTranslation[];
};

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
        // Agregamos un delay artificial para mostrar la animación
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const cocktailData = await cocktailService.getCocktailById(Number(id), locale);

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
  }, [id, locale]);

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
          
          // Ensure the cocktail has the translations property with the recipe
          // This is important because the email templates expect this structure
          const emailCocktail = {
            ...cocktail,
            translations: cocktail.translations || [
              {
                locale: locale,
                recipe: cocktail.description // Fallback to description if recipe is not available
              }
            ]
          };
          
          // Make sure the translations array has the current locale
          if (emailCocktail.translations && 
              !emailCocktail.translations.some(t => t.locale === locale)) {
            emailCocktail.translations.push({
              locale: locale,
              recipe: cocktail.description // Fallback to description if recipe is not available
            });
          }
          
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: ratings.user_email as string,
              cocktail: emailCocktail,
              wantRecipe: ratings.wantRecipe,
              wantRaffle: ratings.wantRaffle,
              locale
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

  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!loading && cocktail) {
      // Add a small delay to start the animation after the emojis disappear
      const timer = setTimeout(() => {
        setShowDetail(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, cocktail]);

  if (loading) {
    return <LoadingEmojis />;
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
      <div 
        className={`transition-all duration-700 ease-out transform ${
          showDetail ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
        }`}
      >
        <CocktailDetail 
          cocktail={cocktail} 
          onSubmit={handleRatingSubmit}
        />
      </div>
      
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
