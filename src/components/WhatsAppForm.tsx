"use client";

import { useState, useEffect } from "react";
import { countries, type Country } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronDown, MessageCircle, Settings } from "lucide-react";

// Find Brazil in the countries list
const getDefaultCountry = (): Country => {
  const brazil = countries.find(country => country.code === "BR");
  return brazil || countries[0]; // Fallback to first country if Brazil not found
};

export default function WhatsAppForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultCountrySearchTerm, setDefaultCountrySearchTerm] = useState("");
  const [showDefaultCountrySettings, setShowDefaultCountrySettings] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedCountryCode = localStorage.getItem("defaultCountryCode");
    if (savedCountryCode) {
      const savedCountry = countries.find(country => country.code === savedCountryCode);
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    }
  }, []);

  // Save country selection to localStorage
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem("defaultCountryCode", country.code);
  };

  // Set default country
  const setDefaultCountry = (country: Country) => {
    localStorage.setItem("defaultCountryCode", country.code);
    setSelectedCountry(country);
    setShowDefaultCountrySettings(false);
  };

  const generateWhatsAppLink = () => {
    if (!phoneNumber.trim()) return "";

    // Remove any non-digit characters from phone number
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Combine country code with phone number
    const fullNumber = selectedCountry.phoneCode + cleanNumber;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${fullNumber}${
      message ? `?text=${encodedMessage}` : ""
    }`;
  };

  const handleSendMessage = () => {
    const link = generateWhatsAppLink();
    if (link) {
      window.open(link, "_blank");
    }
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDefaultCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(defaultCountrySearchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(defaultCountrySearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto bg-card rounded-xl shadow-lg p-6 space-y-6 border">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-2">Quick Zap</h1>
          <p className="text-muted-foreground">
            Send WhatsApp messages instantly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDefaultCountrySettings(true)}
            title="Set default country"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Country Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Select Country
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-muted-foreground">
                  ({selectedCountry.phoneCode})
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
            <div className="p-2">
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredCountries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                onClick={() => handleCountryChange(country)}
                className="flex items-center space-x-3"
              >
                <span className="text-xl">{country.flag}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-muted-foreground">
                  ({country.phoneCode})
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Phone Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
            {selectedCountry.phoneCode}
          </span>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="rounded-l-none"
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Message (Optional)
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSendMessage}
        disabled={!phoneNumber.trim()}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Send WhatsApp Message
      </Button>

      {/* Preview Link */}
      {phoneNumber.trim() && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <p className="text-xs text-muted-foreground break-all">
            {generateWhatsAppLink()}
          </p>
        </div>
      )}

      {/* Default Country Settings Modal */}
      {showDefaultCountrySettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Set Default Country
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDefaultCountrySettings(false)}
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose your default country for new sessions:
            </p>
            <div className="mb-4">
              <Input
                placeholder="Search countries..."
                value={defaultCountrySearchTerm}
                onChange={(e) => setDefaultCountrySearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredDefaultCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setDefaultCountry(country)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-muted-foreground">
                    ({country.phoneCode})
                  </span>
                  {selectedCountry.code === country.code && (
                    <span className="text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
