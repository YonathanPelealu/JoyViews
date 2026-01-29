"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { getAllProviders } from "@/lib/ai/providers";

interface ProviderSelectorProps {
  provider: string;
  model: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
  disabled,
}: ProviderSelectorProps) {
  const providers = getAllProviders();
  const selectedProvider = providers.find((p) => p.id === provider);

  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    const newProviderData = providers.find((p) => p.id === newProvider);
    if (newProviderData && newProviderData.models.length > 0) {
      onModelChange(newProviderData.models[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <Select
            value={provider}
            onValueChange={handleProviderChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={model} onValueChange={onModelChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{selectedProvider?.name || "Models"}</SelectLabel>
                {selectedProvider?.models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProvider && (
        <p className="text-xs text-muted-foreground">
          {selectedProvider.models.find((m) => m.id === model)?.description}
        </p>
      )}
    </div>
  );
}
