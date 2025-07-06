// File: src/components/MethodModal.jsx

import { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "../../Styling/MethodModal.module.css";

import { parseProfitInput } from "../../utils";

Modal.setAppElement("#root");

export default function MethodModal({
  isOpen,
  onClose,
  onSave,
  defaultValues,
  intensityOptions,
  skillOptions
}) {
  const [form, setForm] = useState({
    method: "",
    hourlyProfit: "",
    intensity: "",
    skillOrArea: [],
    customSkillOrArea: "",
    videoLink: "EDIT LATER",
    notes: ""
  });

  
  // NEW: track custom options persisted in localStorage
  const [customOptions, setCustomOptions] = useState(() => {
    const saved = localStorage.getItem("skillOrAreaCustomOptions");
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: input for a new custom option
  const [newCustomInput, setNewCustomInput] = useState("");

  // when modal opens or defaultValues change
  useEffect(() => {
    if (defaultValues) {
      setForm({
        method: defaultValues.method || "",
        hourlyProfit: defaultValues.hourlyProfit?.toString() || "",
        intensity: defaultValues.intensity || "",
        skillOrArea: defaultValues.skillOrArea
          ? defaultValues.skillOrArea.split("/")
          : [],
        videoLink: defaultValues.videoLink || "EDIT LATER",
        notes: defaultValues.notes || ""
      });
    } else {
      setForm({
        method: "",
        hourlyProfit: "",
        intensity: "",
        skillOrArea: [],
        videoLink: "EDIT LATER",
        notes: ""
      });
    }
  }, [defaultValues, isOpen]);

    // NEW: persist customOptions whenever they change
  useEffect(() => {
    localStorage.setItem(
      "skillOrAreaCustomOptions",
      JSON.stringify(customOptions)
    );
  }, [customOptions]);

  // helper to toggle a selection on/off
  const toggleSkill = (opt) => {
    setForm((f) => {
      const has = f.skillOrArea.includes(opt);
      const arr = has
        ? f.skillOrArea.filter((x) => x !== opt)
        : [...f.skillOrArea, opt];
      return { ...f, skillOrArea: arr };
    });
  };

  // NEW: handle adding a new custom option
  const addCustom = () => {
    const val = newCustomInput.trim();
    if (!val) return;
    const all = [...skillOptions, ...customOptions];
    if (!all.includes(val)) {
      setCustomOptions((prev) => [...prev, val]);
      toggleSkill(val);
    }
    setNewCustomInput("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      hourlyProfit: parseProfitInput(form.hourlyProfit),
      intensity: Number(form.intensity),
      skillOrArea: form.skillOrArea.join("/")  // slash-delimited
    };

    try {
      await onSave(
        defaultValues
          ? { methodId: defaultValues.methodId, ...payload }
          : payload
      );
    } catch (err) {
      console.error(err);
      alert("Failed to save method");
    }
  };

  // combine base + custom options
  const allOptions = [...skillOptions, ...customOptions];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.title}>
        {defaultValues ? "Edit Method" : "Add Method"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* NEW: each field wrapped in styled label */}
        <div className={styles.label}>
          Method *
          <input
            className={styles.input}
            name="method"
            value={form.method}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.label}>
          Hourly Profit
          <input
            className={styles.input}
            name="hourlyProfit"
            value={form.hourlyProfit}
            onChange={handleChange}
            placeholder="e.g. 4.5M or 750K"
          />
        </div>

        <div className={styles.label}>
          Intensity *
          <select
            className={styles.select}
            name="intensity"
            value={form.intensity}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Choose…</option>
            {intensityOptions.map(({ intensityId, shortDescription, longDescription }) => (
              <option key={intensityId} value={intensityId}>
                {shortDescription} – {longDescription}
              </option>
            ))}
          </select>
        </div>

        {/* UPDATED: Skill or Area as tag buttons */}
        <div className={styles.label}>
          Skill or Area *
          <div className={styles.optionsList}>
            {allOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={
                  form.skillOrArea.includes(opt)
                    ? styles.optionSelected
                    : styles.option
                }
                onClick={() => toggleSkill(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* NEW: allow entering a new custom option */}
          <div className={styles.customInputRow}>
            <input
              className={styles.input}
              placeholder="Custom skill or area"
              value={newCustomInput}
              onChange={(e) => setNewCustomInput(e.target.value)}
            />
            <button
              type="button"
              className={styles.addButton}
              onClick={addCustom}
            >
              +
            </button>
          </div>
        </div>

        {/* NEW: show this field only when “Custom” selected */}
        {form.skillOrArea.includes("Custom") && (
          <div className={styles.label}>
            Custom Skill or Area *
            <input
              className={styles.input}
              type="text"
              name="customSkillOrArea"
              placeholder="Enter custom skill or area"
              value={form.customSkillOrArea}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={styles.label}>
          Video Link
          <input
            className={styles.input}
            name="videoLink"
            value={form.videoLink}
            onChange={handleChange}
          />
        </div>

        <div className={styles.label}>
          Notes
          <textarea
            className={styles.textarea}
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveButton}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
