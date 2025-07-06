// src/components/Money Making Page/RS_MMM.js
import { useEffect, useState } from "react";
import "../../App.css";
import { backgroundImages } from "../../config/images";
import { useCreateMethod } from "../../hooks/useCreateMethod";
import { useIntensity } from "../../hooks/useIntensity";
import { useMethods } from "../../hooks/useMethods";
import { useUpdateMethod } from "../../hooks/useUpdateMethod";
import styles from "../../Styling/MethodsTable.module.css";
import Footer from "../Footer";
import MethodModal from "./MethodModal";
import MethodsTable from "./MethodsTable";

function RS_MMM() {
  // 1) fetch + refetch
  const {
    data: methodsData,
    isLoading: methodsLoading,
    error: methodsError,
    refetch,                         // ← pulled in
  } = useMethods();
  const {
    data: intensityData,
    isLoading: intensityLoading,
    error: intensityError,
  } = useIntensity();

  // background image setup (unchanged)
  useEffect(() => {
    const randomImage =
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.classList.add("custom-background");
    document.body.style.backgroundImage = `url(${randomImage})`;
    return () =>
      document.body.classList.remove("custom-background");
  }, []);

  // modal open + which row we're editing (null => add)
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // our POST + PUT hooks (no onSuccess here)
  const createMethod = useCreateMethod();
  const updateMethod = useUpdateMethod();

  if (methodsLoading || intensityLoading) return <div>Loading...</div>;
  if (methodsError || intensityError)
    return <div>Error: {methodsError?.message || intensityError?.message}</div>;

  const methodsWithIntensity = methodsData.map((m) => ({
    ...m,
    intensity: intensityData.find(i => i.intensityId === m.intensity),
  }));

  // 2) unified save handler
  const handleSave = async (formPayload) => {
    try {
      if (editing) {
        // NEW: spread in the original createdDatetime too, so you don’t clobber it
        await updateMethod.mutateAsync({
          methodId: editing.methodId,
          createdDatetime: editing.createdDatetime,
          ...formPayload
        });
      } else {
        await createMethod.mutateAsync(formPayload);
      }
      await refetch();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save method");
    }
  };

  return (
    <div className="App">
      <div className="tableContainer">
        <button
          className={styles.primaryButton}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add Method
        </button>

        <h1 className="title">Money Making Methods</h1>

        <MethodsTable
          data={methodsWithIntensity}
          onEdit={(method) => {
            setEditing(method);
            setModalOpen(true);
          }}
        />
      </div>

      <MethodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        defaultValues={editing}
        intensityOptions={intensityData}
        skillOptions={["Skilling", "Bossing", "Combat", "AFK", "Custom"]}
      />

      <Footer />
    </div>
  );
}

export default RS_MMM;
