import { useState } from "react";
import Modal from "../../shared/components/Modal";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";

const INITIAL_FORM = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
};

export default function AddClientModal({ onSuccess, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function resetForm() {
    setForm(INITIAL_FORM);
    setErrors({});
  }

  function validate() {
    const nextErrors = {};
    if (!form.companyName.trim()) {
      nextErrors.companyName = "Company name is required";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!form.email.includes("@")) {
      nextErrors.email = "Enter a valid email address";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const clientData = {
      companyName: form.companyName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    onSuccess?.(clientData);
    setSuccess(true);
  }

  return (
    <Modal isOpen onClose={onClose} title="Add New Client" size="md">
      {success ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="text-5xl leading-none text-green-500" aria-hidden>
            ✓
          </div>
          <h3 className="mt-4 text-[18px] font-semibold text-green-600 dark:text-green-400">
            Client Added
          </h3>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
            You can now assign jobs to this client.
          </p>
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setSuccess(false);
              }}
            >
              Add Another Client
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <Input
            label="Company Name"
            required
            value={form.companyName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                companyName: event.target.value,
              }))
            }
            placeholder="e.g. Accra Business Centre"
            error={errors.companyName}
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="e.g. facilities@company.com"
            error={errors.email}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            placeholder="e.g. +233 24 000 0000"
          />
          <Input
            label="Site Address"
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            placeholder="e.g. 14 Independence Ave, Accra"
          />

          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Client
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
