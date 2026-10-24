import { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "../../Styling/MethodModal.module.css";
import { parseProfitInput } from "../../utils";
import Icon from "../Icon";

const emptyForm = {
  method: "",
  hourlyProfit: "",
  intensity: "",
  skillOrArea: [],
  customSkillOrArea: "",
  videoLink: "EDIT LATER",
  notes: "",
};

export default function MethodModal({
  isOpen,
  onClose,
  onSave,
  defaultValues,
  intensityOptions,
  skillOptions,
}) {
  const [form, setForm] = useState(emptyForm);
  const [customOptions, setCustomOptions] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("skillOrAreaCustomOptions") || "[]",
      );
      return Array.isArray(saved)
        ? saved.filter((option) => typeof option === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [newCustomInput, setNewCustomInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) Modal.setAppElement(root);
  }, []);

  useEffect(() => {
    setForm(
      defaultValues
        ? {
            method: defaultValues.method || "",
            hourlyProfit: defaultValues.hourlyProfit?.toString() || "",
            intensity:
              defaultValues.intensity?.intensityId ??
              defaultValues.intensity ??
              "",
            skillOrArea: defaultValues.skillOrArea
              ? defaultValues.skillOrArea.split("/")
              : [],
            customSkillOrArea: defaultValues.customSkillOrArea || "",
            videoLink: defaultValues.videoLink || "EDIT LATER",
            notes: defaultValues.notes || "",
          }
        : { ...emptyForm, skillOrArea: [] },
    );
    setNewCustomInput("");
    setSaveError("");
  }, [defaultValues, isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "skillOrAreaCustomOptions",
        JSON.stringify(customOptions),
      );
    } catch {
      /* Custom tags remain available in this session. */
    }
  }, [customOptions]);

  const toggleSkill = (option) =>
    setForm((previous) => ({
      ...previous,
      skillOrArea: previous.skillOrArea.includes(option)
        ? previous.skillOrArea.filter((skill) => skill !== option)
        : [...previous.skillOrArea, option],
    }));
  const existingOptions = defaultValues?.skillOrArea
    ? defaultValues.skillOrArea.split("/")
    : [];
  const allOptions = [
    ...new Set([...skillOptions, ...customOptions, ...existingOptions]),
  ];
  const addCustom = () => {
    const option = newCustomInput.trim();
    if (!option) return;
    if (!allOptions.includes(option)) {
      setCustomOptions((previous) => [...previous, option]);
      toggleSkill(option);
    } else if (!form.skillOrArea.includes(option)) {
      toggleSkill(option);
    }
    setNewCustomInput("");
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    const payload = {
      ...form,
      hourlyProfit: parseProfitInput(form.hourlyProfit),
      intensity: Number(form.intensity),
      skillOrArea: form.skillOrArea.join("/"),
    };
    try {
      await onSave(
        defaultValues
          ? { methodId: defaultValues.methodId, ...payload }
          : payload,
      );
    } catch {
      setSaveError("We couldn't save this method. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={isSaving ? undefined : onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnEsc={!isSaving}
      shouldCloseOnOverlayClick={!isSaving}
      aria={{
        labelledby: "method-modal-title",
        describedby: "method-modal-description",
      }}
    >
      <div className={styles.modalHeading}>
        <div>
          <h2 id="method-modal-title">
            {defaultValues ? "Edit method" : "Add a method"}
          </h2>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close method dialog"
          onClick={onClose}
          disabled={isSaving}
        >
          <Icon name="close" />
        </button>
      </div>
      <p id="method-modal-description" className={styles.description}>
        Fields marked * are required.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="method-name">Method name *</label>
          <input
            className={styles.input}
            id="method-name"
            name="method"
            value={form.method}
            onChange={handleChange}
            placeholder="What will we be doing?"
            required
          />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="method-profit">Hourly profit</label>
            <input
              className={styles.input}
              id="method-profit"
              name="hourlyProfit"
              value={form.hourlyProfit}
              onChange={handleChange}
              placeholder="e.g. 4.5M or 750K"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="method-intensity">Intensity *</label>
            <select
              className={styles.select}
              id="method-intensity"
              name="intensity"
              value={form.intensity}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose intensity
              </option>
              {intensityOptions.map(({ intensityId, shortDescription }) => (
                <option key={intensityId} value={intensityId}>
                  {shortDescription}
                </option>
              ))}
            </select>
          </div>
        </div>
        <fieldset className={styles.skillField}>
          <legend>Skills &amp; area</legend>
          <p className={styles.hint}>Choose all that apply.</p>
          <div className={styles.optionsList}>
            {allOptions.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={form.skillOrArea.includes(option)}
                className={
                  form.skillOrArea.includes(option)
                    ? styles.optionSelected
                    : styles.option
                }
                onClick={() => toggleSkill(option)}
              >
                {form.skillOrArea.includes(option) ? (
                  <Icon name="check" />
                ) : null}
                {option}
              </button>
            ))}
          </div>
          <div className={styles.customInputRow}>
            <input
              className={styles.input}
              aria-label="Add a custom skill or area"
              placeholder="Add a custom skill or area"
              value={newCustomInput}
              onChange={(event) => setNewCustomInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustom();
                }
              }}
            />
            <button
              type="button"
              className={styles.addButton}
              aria-label="Add custom skill"
              onClick={addCustom}
            >
              <Icon name="plus" />
            </button>
          </div>
        </fieldset>
        {form.skillOrArea.includes("Custom") ? (
          <div className={styles.field}>
            <label htmlFor="method-custom">Custom skill or area *</label>
            <input
              className={styles.input}
              id="method-custom"
              name="customSkillOrArea"
              value={form.customSkillOrArea}
              onChange={handleChange}
              required
            />
          </div>
        ) : null}
        <div className={styles.field}>
          <label htmlFor="method-video">Video guide</label>
          <input
            className={styles.input}
            id="method-video"
            name="videoLink"
            value={form.videoLink}
            onChange={handleChange}
            placeholder="Link to a video guide"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="method-notes">Notes</label>
          <textarea
            className={styles.textarea}
            id="method-notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Requirements, tips, or anything worth knowing…"
            rows="3"
          />
        </div>
        {saveError ? (
          <p className={styles.error} role="alert">
            <Icon name="alert" />
            {saveError}
          </p>
        ) : null}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save method"}
            <Icon name="arrow" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
