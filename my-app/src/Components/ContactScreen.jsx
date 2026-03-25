import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  CirclePlus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const normalizeContact = (c) => ({
  id: c.id || crypto.randomUUID(),
  name: c.name?.trim() || "Unnamed Contact",
  email: c.email?.trim() || "vanshika@example.com",
  mobile: c.mobile?.trim() || "N/A",
  address: c.address?.trim() || "Antarctica",
});

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-500",
];

const getAvatarColor = (name) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/BitcotDev/fresher-machin-test/main/json/sample.json",
    )
      .then((res) => res.json())
      .then((data) => {
        const saved = localStorage.getItem("contacts");
        const source =
          saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : data;
        setContacts((source || []).map(normalizeContact));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", mobile: "", address: "" });
    setEditingContact(null);
    setViewingContact(null);
    setIsViewing(false);
    setErrors({});
  };

  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setMessage("Contact deleted successfully");
    setDeleteConfirm(null);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsViewing(false);
    setForm(contact);
    setErrors({});
    setOpenDialog(true);
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
    setIsViewing(true);
    setForm(contact);
    setErrors({});
    setOpenDialog(true);
  };

  const handleSaveContact = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    else {
      const emailExists = contacts.some(
        (c) =>
          c.email.toLowerCase() === form.email.toLowerCase() &&
          c.id !== editingContact?.id,
      );
      if (emailExists) newErrors.email = "Email already exists";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const contactToSave = normalizeContact({
      ...form,
      id: editingContact?.id || crypto.randomUUID(),
    });

    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? contactToSave : c)),
      );
      setMessage("Contact updated successfully");
    } else {
      setContacts((prev) => [...prev, contactToSave]);
      setMessage("Contact added successfully");
    }

    resetForm();
    setOpenDialog(false);
    setSearch("");
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const viewData = viewingContact || form;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Toast */}
      {message && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-800 border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Contacts
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                {contacts.length} {contacts.length === 1 ? "person" : "people"}{" "}
                saved
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all duration-200 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CirclePlus size={16} />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />

          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Contact List */}
        <div className="space-y-2.5">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <User size={40} className="mx-auto mb-4 opacity-40" />
              <p className="text-sm font-medium">No contacts found</p>
              {search && (
                <p className="text-xs mt-1 text-slate-700">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            filteredContacts.map((c) => (
              <div
                key={c.id}
                className="group flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(c.name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg`}
                  >
                    {getInitials(c.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">
                      {c.name}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.email}</p>
                    {c.mobile !== "N/A" && (
                      <p className="text-slate-500 text-xs">{c.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleViewContact(c)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-sky-400 transition-colors"
                    title="View"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleEditContact(c)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-violet-400 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c.id)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-rose-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Delete contact?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteContact(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit / View Dialog */}
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-md p-0 overflow-hidden">
          {/* Dialog Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-800">
            <DialogTitle className="text-lg font-bold text-white">
              {isViewing
                ? "Contact Details"
                : editingContact
                  ? "Edit Contact"
                  : "New Contact"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm mt-0.5">
              {isViewing
                ? "Viewing saved information"
                : editingContact
                  ? "Update the contact's details"
                  : "Fill in the details below"}
            </DialogDescription>
          </div>

          <div className="px-6 py-5">
            {isViewing ? (
              /* View Mode */
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(viewData.name)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                  >
                    {getInitials(viewData.name)}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {viewData.name}
                    </p>
                    <p className="text-slate-400 text-sm">{viewData.email}</p>
                  </div>
                </div>
                {[
                  { icon: Mail, label: "Email", value: viewData.email },
                  { icon: Phone, label: "Phone", value: viewData.mobile },
                  { icon: MapPin, label: "Address", value: viewData.address },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/50"
                  >
                    <Icon
                      size={15}
                      className="text-slate-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="text-white text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Edit / Add Mode */
              <div className="space-y-4">
                {[
                  {
                    name: "name",
                    label: "Full Name",
                    icon: User,
                    placeholder: "Enter Name",
                    type: "text",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                    icon: Mail,
                    placeholder: "Enter Email",
                    type: "email",
                  },
                  {
                    name: "mobile",
                    label: "Mobile Number",
                    icon: Phone,
                    placeholder: "Enter Mobile Number",
                    type: "tel",
                  },
                  {
                    name: "address",
                    label: "Address",
                    icon: MapPin,
                    placeholder: "Enter Address",
                    type: "text",
                  },
                ].map(({ name, label, icon: Icon, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <Input
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                        error={!!errors[name]}
                        className="pl-9"
                      />
                    </div>
                    {errors[name] && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-rose-400" />
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end gap-3">
            {isViewing ? (
              <>
                <Button
                  onClick={() => {
                    setIsViewing(false);
                    setEditingContact(viewingContact);
                    setForm(viewingContact);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveContact}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {editingContact ? "Save Changes" : "Add Contact"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactScreen;
