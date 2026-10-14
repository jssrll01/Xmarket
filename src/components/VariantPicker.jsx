import React from 'react';
import { getVariantConfig, comboLabel } from '../lib/variants';

/**
 * Multi-dimension variant picker.
 * Usage: <VariantPicker product={product} selection={sel} onChange={setSel} error={bool} />
 *
 * - If product has variant_config → renders one chip row per dimension.
 * - If product only has legacy `variants` (flat array) → renders one chip row labelled "Variant".
 * - Selection is an object: { Color: 'Red', Size: 'M' } or { Variant: 'Red' }.
 */
export default function VariantPicker({ product, selection = {}, onChange, error = false }) {
  const config = getVariantConfig(product);
  const dims = Object.keys(config);

  if (dims.length === 0) return null;

  const handlePick = (dim, opt) => {
    const next = { ...selection, [dim]: opt };
    onChange(next);
  };

  return (
    <div className="variant-picker">
      {dims.map((dim) => (
        <div key={dim} className="variant-dim">
          <div className="variant-dim-label">
            {dim}
            {selection[dim] ? <span className="variant-dim-picked"> · {selection[dim]}</span> : null}
          </div>
          <div className="variant-dim-options">
            {config[dim].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handlePick(dim, opt)}
                className={'chip' + (selection[dim] === opt ? ' active' : '')}
                style={error && selection[dim] !== opt ? { border: '1px solid #DC2626' } : undefined}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      {error && (
        <div style={{ color: '#DC2626', fontSize: 12, marginTop: 6 }}>
          Please select all options
        </div>
      )}
    </div>
  );
}
