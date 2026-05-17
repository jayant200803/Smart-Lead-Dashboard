import { useState } from 'react';
import { Button, Input, Select } from '../ui';
import { CreateLeadData, Lead, LeadSource, LeadStatus, UpdateLeadData } from '../../types';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: CreateLeadData | UpdateLeadData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const statusOptions = Object.values(LeadStatus).map((s) => ({ value: s, label: s }));
const sourceOptions = Object.values(LeadSource).map((s) => ({ value: s, label: s }));

export default function LeadForm({ initialData, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    status: initialData?.status ?? LeadStatus.NEW,
    source: initialData?.source ?? '' as LeadSource | '',
    notes: initialData?.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.source) {
      newErrors.source = 'Source is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      status: form.status,
      source: form.source as LeadSource,
      notes: form.notes.trim() || undefined,
    });
  };

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
        disabled={isLoading}
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="rahul@example.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        disabled={isLoading}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={form.status}
          onChange={handleChange('status')}
          options={statusOptions}
          disabled={isLoading}
        />

        <Select
          label="Source"
          value={form.source}
          onChange={handleChange('source')}
          options={sourceOptions}
          placeholder="Select source"
          error={errors.source}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={handleChange('notes')}
          placeholder="Add any relevant notes..."
          rows={3}
          maxLength={500}
          disabled={isLoading}
          className="input resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-slate-600 mt-1 text-right">{form.notes.length}/500</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
