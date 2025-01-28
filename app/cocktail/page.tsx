'use client';

import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";

interface VoteOption {
  appearance: number | null;
  taste: number | null;
  innovativeness: number | null;
}

const VotingPage = () => {
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<VoteOption>({
    appearance: null,
    taste: null,
    innovativeness: null,
  });
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [email, setEmail] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    const allOptionsSelected = Object.values(selectedOptions).every(
      (value) => value !== null
    );
    if (!allOptionsSelected) return false;
    if (emailEnabled && !isValidEmail(email)) return false;
    return true;
  };

  const handleVoteSelect = (category: keyof VoteOption, value: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your vote has been submitted successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-[#3B4992] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Rate Our Cocktail</h1>
        
        <div className="space-y-8">
          {/* Voting Options */}
          {Object.keys(selectedOptions).map((category) => (
            <div key={category} className="bg-white/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
              <div className="flex justify-center gap-6">
                {[1, 2, 3, 4].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleVoteSelect(category as keyof VoteOption, value)}
                    className={`p-4 rounded-full transition-transform hover:scale-110 ${
                      selectedOptions[category as keyof VoteOption] === value
                        ? 'ring-4 ring-white'
                        : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        value === 1
                          ? 'bg-red-500'
                          : value === 2
                          ? 'bg-orange-500'
                          : value === 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {/* Face SVG */}
                      <svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7zm8-4c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-6 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Email Section */}
          <div className="bg-white/10 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="email"
                checked={emailEnabled}
                onCheckedChange={(checked) => setEmailEnabled(checked as boolean)}
              />
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I want to receive updates about new flavors
              </label>
            </div>
            {emailEnabled && (
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="px-8 py-2 bg-white text-[#3B4992] hover:bg-white/90 disabled:opacity-50"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
