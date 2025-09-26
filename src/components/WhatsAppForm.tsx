"use client";

import { ChevronDown, MessageCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Country, countries } from "@/data/countries";

// Find Brazil in the countries list
const getDefaultCountry = (): Country => {
  const brazil = countries.find((country) => country.code === "BR");
  return brazil || countries[0]; // Fallback to first country if Brazil not found
};

export default function WhatsAppForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getDefaultCountry()
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultCountrySearchTerm, setDefaultCountrySearchTerm] = useState("");
  const [showDefaultCountrySettings, setShowDefaultCountrySettings] =
    useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedCountryCode = localStorage.getItem("defaultCountryCode");
    if (savedCountryCode) {
      const savedCountry = countries.find(
        (country) => country.code === savedCountryCode
      );
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
    if (!phoneNumber.trim()) {
      return "";
    }

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
      country.name
        .toLowerCase()
        .includes(defaultCountrySearchTerm.toLowerCase()) ||
      country.code
        .toLowerCase()
        .includes(defaultCountrySearchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-foreground">Quick Zap</h1>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowDefaultCountrySettings(true)}
            size="icon"
            title="Set default country"
            variant="outline"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <p className="text-center text-muted-foreground">
        Envie mensagens instantâneas para WhatsApp
      </p>

      {/* Country Selector */}
      <div className="space-y-2">
        <p className="font-medium text-foreground text-sm">Selecione o país</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center space-x-3">
                <span className="pb-1 text-xl">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-muted-foreground">
                  ({selectedCountry.phoneCode})
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 w-full overflow-y-auto">
            <div className="p-2">
              <Input
                className="mb-2"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                value={searchTerm}
              />
            </div>
            {filteredCountries.map((country) => (
              <DropdownMenuItem
                className="flex items-center"
                key={country.code}
                onClick={() => handleCountryChange(country)}
              >
                <span className="w-8 pb-1 text-xl">{country.flag}</span>
                <span className="min-w-0 flex-1">{country.name}</span>
                <span className="ml-auto text-muted-foreground">
                  ({country.phoneCode})
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <p className="font-medium text-foreground text-sm">
          Número de telefone
        </p>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-md border border-input border-r-0 bg-muted px-3 text-muted-foreground text-sm">
            {selectedCountry.phoneCode}
          </span>
          <Input
            className="rounded-l-none"
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Digite o número de telefone"
            type="tel"
            value={phoneNumber}
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <p className="font-medium text-foreground text-sm">
          Mensagem (Opcional)
        </p>
        <Textarea
          className="resize-none"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui..."
          rows={4}
          value={message}
        />
      </div>

      {/* Send Button */}
      <Button
        className="w-full bg-green-600 text-white hover:bg-green-700"
        disabled={!phoneNumber.trim()}
        onClick={handleSendMessage}
        size="lg"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Enviar Mensagem para WhatsApp
      </Button>

      {/* Preview Link */}
      {phoneNumber.trim() && (
        <div className="rounded-lg bg-muted p-3">
          <p className="mb-2 text-muted-foreground text-sm">Visualizar:</p>
          <p className="break-all text-muted-foreground text-xs">
            {generateWhatsAppLink()}
          </p>
        </div>
      )}

      {/* Default Country Settings Modal */}
      {showDefaultCountrySettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">
                Configurar País Padrão
              </h3>
              <Button
                onClick={() => setShowDefaultCountrySettings(false)}
                size="icon"
                variant="outline"
              >
                ×
              </Button>
            </div>
            <p className="mb-4 text-muted-foreground text-sm">
              Escolha seu país padrão para novas sessões:
            </p>
            <div className="mb-4">
              <Input
                className="w-full"
                onChange={(e) => setDefaultCountrySearchTerm(e.target.value)}
                placeholder="Pesquisar países..."
                value={defaultCountrySearchTerm}
              />
            </div>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {filteredDefaultCountries.map((country) => (
                <button
                  className="flex w-full items-center rounded-lg p-3 text-left transition-colors hover:bg-muted"
                  key={country.code}
                  onClick={() => setDefaultCountry(country)}
                  type="button"
                >
                  <span className="w-8 text-xl">{country.flag}</span>
                  <span className="min-w-0 flex-1">{country.name}</span>
                  <span className="ml-auto text-muted-foreground">
                    ({country.phoneCode})
                  </span>
                  {selectedCountry.code === country.code && (
                    <span className="ml-2 text-green-600">✓</span>
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
