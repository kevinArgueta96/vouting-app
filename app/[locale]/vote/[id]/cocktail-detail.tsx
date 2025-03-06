"use client";

import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { characteristicService } from "../../../services/supabase";
import { Database } from "../../../types/supabase";
import { useTranslations, useLocale } from "next-intl";

const RATING_EMOJIS = [
  { value: 1, emoji: "/images/emoji_1.png" },
  { value: 2, emoji: "/images/emoji_2.png" },
  { value: 3, emoji: "/images/emoji_3.png" },
  { value: 4, emoji: "/images/emoji_4.png" },
];

type RatingCharacteristic =
  Database["public"]["Tables"]["rating_characteristics"]["Row"];

type Rating = {
  [key: string]: number | string | boolean | undefined;
  user_email?: string;
  wantRecipe?: boolean;
  wantRaffle?: boolean;
};

interface Cocktail {
  id: number;
  name: string;
  brand: string;
  description: string;
}

export default function CocktailDetail({
  cocktail,
  onSubmit,
}: {
  cocktail: Cocktail;
  onSubmit: (ratings: Rating) => void;
  onViewDetails?: () => void;
}) {
  const t = useTranslations("Vote");
  const tCocktail = useTranslations("CocktailDetail");
  const [characteristics, setCharacteristics] = useState<RatingCharacteristic[]>([]);
  const [ratings, setRatings] = useState<Rating>({});
  const [emailError, setEmailError] = useState("");
  const [wantRecipe, setWantRecipe] = useState(false);
  const [wantRaffle, setWantRaffle] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = useLocale();

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const chars = await characteristicService.getAllCharacteristics(locale);
        setCharacteristics(chars);
        setRatings(
          chars.reduce(
            (acc, char) => ({
              ...acc,
              [char.id]: 0,
            }),
            {}
          )
        );
      } catch {
        console.error("Error loading rating characteristics:");
      }
    };
    loadCharacteristics();
  }, [locale]);

  const handleRatingChange = (category: string, value: number | string) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    setShowEmailInput(wantRecipe || wantRaffle);
  }, [wantRecipe, wantRaffle]);

  const canSubmit = () => {
    const hasAllRatings = characteristics.every(
      (char) => (ratings[char.id] as number) > 0
    );
    if (!wantRecipe && !wantRaffle) {
      return hasAllRatings;
    }
    return hasAllRatings && validateEmail(ratings.user_email || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if ((wantRecipe || wantRaffle) && !validateEmail(ratings.user_email || "")) {
      setEmailError(t("invalidEmail"));
      return;
    }
    setEmailError("");

    if (canSubmit()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...ratings,
          wantRecipe,
          wantRaffle
        });
      } catch {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center overflow-hidden">
      {/* Cocktail Image - Large at the top */}
      <div className="w-full max-w-[500px] px-4 relative z-10 mb-[-100px]">
        <Image
          src="/images/cocktail-image-vote.png"
          alt="Cocktail"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>

      {/* Content with background circle */}
      <div className="relative w-full flex-1 bg-[#3B4992] rounded-t-[50px] pt-24 px-4">
        <div className="max-w-[600px] mx-auto">
          {/* Cocktail Info */}
          <div className="text-white space-y-2 mb-12">
            <h2 className="text-[41px] font-normal uppercase text-left text-[#F7F4EA] font-['Russo_One'] tracking-super-tight leading-custom-35">
              {cocktail.name}
            </h2>
            <h3 className="text-[18px] font-semibold uppercase text-left text-[#F7F4EA] font-['Montserrat'] leading-custom-34">
              {cocktail.brand}
            </h3>
            <p className="text-sm text-left ">
              {cocktail.description}
            </p>
          </div>
          {/* Rating Sections */}
          <div className="space-y-8">
            {characteristics.map((characteristic) => (
              <div key={characteristic.id} className="text-center">
                <h4 className="text-[12px] font-medium uppercase mb-4 text-[#F7F4EA] font-['Montserrat'] leading-custom-17">
                  {characteristic.label}
                </h4>
                <div className="relative h-16">
                  <div className={`flex justify-center gap-5 sm:gap-2 transition-all duration-700 ${(ratings[characteristic.id] as number) > 0 ? 'scale-0 opacity-0 transform translate-y-4' : 'scale-100 opacity-100 transform translate-y-0'
                    }`}>
                    {RATING_EMOJIS.map((rating) => (
                      <button
                        key={rating.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRatingChange(characteristic.id, rating.value);
                        }}
                        className="w-16 h-16 flex items-center justify-center transition-transform hover:scale-110"
                      >
                        <Image
                          src={rating.emoji}
                          alt={`Rating ${rating.value}`}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Selected Emoji */}
                  {(ratings[characteristic.id] as number) > 0 && (
                    <div className="absolute inset-0 flex justify-center items-center transition-all duration-700 transform scale-100 opacity-100 translate-y-0">
                      <Image
                        src={RATING_EMOJIS[(ratings[characteristic.id] as number) - 1].emoji}
                        alt={`Selected Rating ${ratings[characteristic.id]}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain animate-pulse"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Email and Recipe Options */}
          <div className="mt-12 space-y-4 text-white">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="recipe-checkbox"
                  checked={wantRecipe}
                  onChange={(e) => setWantRecipe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#FFD4D4] checked:bg-[#FFD4D4] accent-[#FFD4D4]"
                />
                <label htmlFor="recipe-checkbox" className="text-sm">
                  {t("sendRecipe")}
                </label>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="raffle-checkbox"
                  checked={wantRaffle}
                  onChange={(e) => setWantRaffle(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#FFD4D4] checked:bg-[#FFD4D4] accent-[#FFD4D4]"
                />
                <label htmlFor="raffle-checkbox" className="text-sm flex items-center flex-wrap">
                  <span>{t("participateRaffle")}</span>
                  <a 
                    href={`https://${t("drawRulesUrl")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#FFD4D4] hover:text-white hover:underline ml-1 inline-flex items-center group transition-colors duration-300"
                  >
                    <span className="relative">
                      {t("readMoreRules")}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD4D4] group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </label>
              </div>
            </div>

            {showEmailInput && (
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  placeholder={t("enterEmail")}
                  value={ratings.user_email || ""}
                  onChange={(e) => {
                    handleRatingChange("user_email", e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none text-white placeholder-white/50"
                />
                {emailError && <p className="text-red-300 text-sm">{emailError}</p>}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 pb-2">
            <Button
              type="submit"
              className="w-full bg-[#FF8B9C] text-white hover:bg-[#ff7c8f] transition-colors duration-200 rounded-lg py-3 font-bold uppercase tracking-wider"
              disabled={!canSubmit() || isSubmitting}
            >
              {isSubmitting ? t("submitting") : tCocktail("sendVote")}
            </Button>
          </div>
          
          {/* Privacy Policy Link */}
          <div className="text-center text-white text-xs pb-8">
            <a 
              href={`https://${t("conditionsUrl")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/70 hover:text-white hover:underline"
            >
              {t("privacyPolicy")}
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}
