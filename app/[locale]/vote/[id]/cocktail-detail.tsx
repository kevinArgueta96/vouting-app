"use client";

import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import { characteristicService } from "../../../services/supabase";
import { Database } from "../../../types/supabase";
import { useTranslations } from "next-intl";

const RATING_EMOJIS = [
  { value: 1, emoji: "🙁" },
  { value: 2, emoji: "🙂" },
  { value: 3, emoji: "😊" },
  { value: 4, emoji: "😁" },
];

type RatingCharacteristic =
  Database["public"]["Tables"]["rating_characteristics"]["Row"];

type Rating = {
  [key: string]: number | string | undefined;
  user_email?: string;
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
}) {
  const t = useTranslations("Vote");
  const [characteristics, setCharacteristics] = useState<RatingCharacteristic[]>([]);
  const [ratings, setRatings] = useState<Rating>({});
  const [emailError, setEmailError] = useState("");
  const [wantRecipe, setWantRecipe] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const chars = await characteristicService.getAllCharacteristics();
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
      } catch (error) {
        console.error("Error loading rating characteristics:", error);
      }
    };
    loadCharacteristics();
  }, []);

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

  const canSubmit = () => {
    const hasAllRatings = characteristics.every(
      (char) => (ratings[char.id] as number) > 0
    );
    if (!wantRecipe) {
      return hasAllRatings;
    }
    return hasAllRatings && validateEmail(ratings.user_email || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wantRecipe && !validateEmail(ratings.user_email || "")) {
      setEmailError(t("invalidEmail"));
      return;
    }
    setEmailError("");

    if (canSubmit()) {
      onSubmit(ratings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center overflow-hidden">
      {/* Cocktail Image - Large at the top */}
      <div className="w-full max-w-[500px] px-4 relative z-10 mb-[-100px]">
        <img
          src="/images/cocktail-image-vote.png"
          alt="Cocktail"
          className="w-full h-auto"
        />
      </div>

      {/* Content with background circle */}
      <div className="relative w-full flex-1 bg-[#3B4992] rounded-t-[50px] pt-24 px-4">
        <div className="max-w-[600px] mx-auto">
          {/* Cocktail Info */}
          <div className="text-white space-y-2 mb-12">
            <h2 className="text-4xl font-bold uppercase text-center">
              {cocktail.name}
            </h2>
            <h3 className="text-xl uppercase tracking-wide text-center">
              {cocktail.brand}
            </h3>
            <p className="text-sm leading-relaxed text-center max-w-[500px] mx-auto">
              {cocktail.description}
            </p>
          </div>

          {/* Rating Sections */}
          <div className="space-y-2">
            {characteristics.map((characteristic) => (
              <div key={characteristic.id} className="text-center">
                <h4 className="text-2xl uppercase mb-2 tracking-wide text-white">
                  {characteristic.label}
                </h4>
                <div className="flex justify-center gap-6 sm:gap-8">
                  {RATING_EMOJIS.map((rating) => (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRatingChange(characteristic.id, rating.value);
                      }}
                      className={`w-12 h-12 rounded-full bg-[#FFD4D4] flex items-center justify-center text-xl transition-transform ${
                        ratings[characteristic.id] === rating.value
                          ? "transform scale-110 ring-2 ring-[#FFD4D4]"
                          : "opacity-60 hover:opacity-90"
                      }`}
                    >
                      {rating.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Email and Recipe Options */}
          <div className="mt-12 space-y-4 text-white">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <input
                  type="radio"
                  id="recipe-checkbox"
                  name="options"
                  checked={wantRecipe}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWantRecipe(true);
                    }
                  }}
                  className="w-4 h-4 rounded-full border-2 border-[#FFD4D4] checked:bg-[#FFD4D4] accent-[#FFD4D4]"
                />
                <label htmlFor="recipe-checkbox" className="text-sm">
                  {t("sendRecipe")}
                </label>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <input
                  type="radio"
                  id="draffle-checkbox"
                  name="options"
                  checked={!wantRecipe}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWantRecipe(false);
                    }
                  }}
                  className="w-4 h-4 rounded-full border-2 border-[#FFD4D4] checked:bg-[#FFD4D4] accent-[#FFD4D4]"
                />
                <label htmlFor="draffle-checkbox" className="text-sm">
                  Participate to the draffle.
                </label>
              </div>
            </div>

            {wantRecipe && (
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
          <div className="mt-8 pb-8">
            <Button
              type="submit"
              className="w-full bg-[#FF8B9C] text-white hover:bg-[#ff7c8f] transition-colors duration-200 rounded-lg py-3 font-bold uppercase tracking-wider"
              disabled={!canSubmit()}
            >
              Send Vote
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
