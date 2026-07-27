import { VENDOR_INFO, type VendorKey } from "../it-setup/data";
import { OptionCard, OptionGrid } from "./OptionCard";

type VendorPickerProps = {
  selected: VendorKey;
  onSelect: (vendor: VendorKey) => void;
};

// The shared 4-vendor grid. All three getting-started flows reference a vendor,
// so this lives in the flow-kit.
export function VendorPicker({ selected, onSelect }: VendorPickerProps) {
  return (
    <OptionGrid>
      {(Object.keys(VENDOR_INFO) as VendorKey[]).map((key) => (
        <OptionCard
          key={key}
          name={VENDOR_INFO[key].name}
          desc={VENDOR_INFO[key].appName}
          selected={key === selected}
          onClick={() => onSelect(key)}
        />
      ))}
    </OptionGrid>
  );
}
