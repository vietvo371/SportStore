'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward { code: number; name: string; }

const VAPI = 'https://provinces.open-api.vn/api';

function normalize(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function fuzzyMatch(a: string, b: string) {
    const na = normalize(a), nb = normalize(b);
    return na.includes(nb) || nb.includes(na);
}

// ── Searchable Combobox ────────────────────────────────────────────────────────
interface ComboItem { value: string; label: string; }
interface SearchableComboboxProps {
    items: ComboItem[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    loading?: boolean;
}

function SearchableCombobox({
    items, value, onChange, placeholder,
    searchPlaceholder = 'Tìm kiếm...', disabled, loading,
}: SearchableComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = items.find(i => i.value === value);
    const filtered = search
        ? items.filter(i => normalize(i.label).includes(normalize(search)))
        : items;

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleSelect = (val: string) => {
        onChange(val);
        setSearch('');
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                disabled={disabled || loading}
                onClick={() => setOpen(o => !o)}
                className={cn(
                    'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors',
                    'hover:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    !selected && 'text-muted-foreground',
                )}
            >
                {loading
                    ? <span className="flex items-center gap-1.5 text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Đang tải...</span>
                    : <span className="truncate text-left">{selected?.label ?? placeholder}</span>
                }
                <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-[9999] mt-1 min-w-full rounded-md border bg-popover shadow-md">
                    <div className="border-b p-1.5">
                        <Input
                            autoFocus
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="h-7 text-xs"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-0.5">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-3 text-center text-xs text-muted-foreground">
                                Không tìm thấy kết quả
                            </li>
                        ) : filtered.map(item => (
                            <li
                                key={item.value}
                                onMouseDown={() => handleSelect(item.value)}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    item.value === value && 'bg-primary/10 font-medium text-primary',
                                )}
                            >
                                <Check className={cn('h-3 w-3 shrink-0', item.value === value ? 'opacity-100' : 'opacity-0')} />
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


// ── Main Component ─────────────────────────────────────────────────────────────
interface VietnamAddressFieldsProps {
    initialProvince?: string;
    initialDistrict?: string;
    initialWard?: string;
    initialAddress?: string;
    resetKey?: string | number | boolean;
}

export function VietnamAddressFields({
    initialProvince, initialDistrict, initialWard, resetKey,
}: VietnamAddressFieldsProps) {
    const { control, setValue } = useFormContext();

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');

    const [loadingP, setLoadingP] = useState(false);
    const [loadingD, setLoadingD] = useState(false);
    const [loadingW, setLoadingW] = useState(false);

    // Load provinces once
    useEffect(() => {
        setLoadingP(true);
        fetch(`${VAPI}/p/`)
            .then(r => r.json())
            .then((data: Province[]) => setProvinces(data))
            .catch(console.error)
            .finally(() => setLoadingP(false));
    }, []);

    // Reset cascade when dialog opens fresh
    useEffect(() => {
        setProvinceCode('');
        setDistrictCode('');
        setDistricts([]);
        setWards([]);
    }, [resetKey]);

    // Edit mode: auto-select province
    useEffect(() => {
        if (!initialProvince || provinces.length === 0 || provinceCode) return;
        const found = provinces.find(p => fuzzyMatch(p.name, initialProvince));
        if (found) setProvinceCode(String(found.code));
    }, [initialProvince, provinces]);

    // Load districts on province change
    useEffect(() => {
        if (!provinceCode) { setDistricts([]); setWards([]); return; }
        setLoadingD(true);
        setDistrictCode('');
        setWards([]);
        fetch(`${VAPI}/p/${provinceCode}?depth=2`)
            .then(r => r.json())
            .then((data: { districts: District[] }) => {
                const list = data.districts ?? [];
                setDistricts(list);
                if (initialDistrict) {
                    const found = list.find(d => fuzzyMatch(d.name, initialDistrict));
                    if (found) setDistrictCode(String(found.code));
                }
            })
            .catch(console.error)
            .finally(() => setLoadingD(false));
    }, [provinceCode]);

    // Load wards on district change
    useEffect(() => {
        if (!districtCode) { setWards([]); return; }
        setLoadingW(true);
        fetch(`${VAPI}/d/${districtCode}?depth=2`)
            .then(r => r.json())
            .then((data: { wards: Ward[] }) => {
                const list = data.wards ?? [];
                setWards(list);
                if (initialWard) {
                    const found = list.find(w => fuzzyMatch(w.name, initialWard));
                    if (found) setValue('phuong_xa', found.name, { shouldValidate: true });
                }
            })
            .catch(console.error)
            .finally(() => setLoadingW(false));
    }, [districtCode]);

    const handleProvinceChange = (code: string) => {
        const p = provinces.find(x => String(x.code) === code);
        if (!p) return;
        setProvinceCode(code);
        setValue('tinh_thanh', p.name, { shouldValidate: true });
        setValue('quan_huyen', '', { shouldValidate: false });
        setValue('phuong_xa', '', { shouldValidate: false });
    };

    const handleDistrictChange = (code: string) => {
        const d = districts.find(x => String(x.code) === code);
        if (!d) return;
        setDistrictCode(code);
        setValue('quan_huyen', d.name, { shouldValidate: true });
        setValue('phuong_xa', '', { shouldValidate: false });
    };

    const handleWardChange = (name: string) => {
        setValue('phuong_xa', name, { shouldValidate: true });
    };

    const provinceItems = provinces.map(p => ({ value: String(p.code), label: p.name }));
    const districtItems = districts.map(d => ({ value: String(d.code), label: d.name }));
    const wardItems = wards.map(w => ({ value: w.name, label: w.name }));

    return (
        <div className="space-y-4">
            {/* Cascade selects */}
            <div className="grid grid-cols-3 gap-3">
                <FormField
                    control={control}
                    name="tinh_thanh"
                    rules={{ required: 'Bắt buộc' }}
                    render={() => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Tỉnh/Thành</FormLabel>
                            <SearchableCombobox
                                items={provinceItems}
                                value={provinceCode}
                                onChange={handleProvinceChange}
                                placeholder="Chọn tỉnh..."
                                searchPlaceholder="Tìm tỉnh/thành..."
                                loading={loadingP}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="quan_huyen"
                    rules={{ required: 'Bắt buộc' }}
                    render={() => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Quận/Huyện</FormLabel>
                            <SearchableCombobox
                                items={districtItems}
                                value={districtCode}
                                onChange={handleDistrictChange}
                                placeholder={provinceCode ? 'Chọn huyện...' : 'Chọn tỉnh trước'}
                                searchPlaceholder="Tìm quận/huyện..."
                                disabled={!provinceCode}
                                loading={loadingD}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="phuong_xa"
                    rules={{ required: 'Bắt buộc' }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Phường/Xã</FormLabel>
                            <SearchableCombobox
                                items={wardItems}
                                value={field.value || ''}
                                onChange={handleWardChange}
                                placeholder={districtCode ? 'Chọn phường...' : 'Chọn huyện trước'}
                                searchPlaceholder="Tìm phường/xã..."
                                disabled={!districtCode}
                                loading={loadingW}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Địa chỉ cụ thể */}
            <FormField
                control={control}
                name="dia_chi_cu_the"
                rules={{ required: 'Vui lòng nhập địa chỉ cụ thể' }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Địa chỉ cụ thể</FormLabel>
                        <FormControl>
                            <Input placeholder="Số nhà, tên đường, ngõ hẻm..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
