import { useMemo, useState } from "react";
import "../../Styling/MethodsPage.css";
import { backgroundImages } from "../../config/images";
import { useCreateMethod } from "../../hooks/useCreateMethod";
import { useIntensity } from "../../hooks/useIntensity";
import { useMethods } from "../../hooks/useMethods";
import { useUpdateMethod } from "../../hooks/useUpdateMethod";
import Icon from "../Icon";
import MethodModal from "./MethodModal";
import MethodsTable from "./MethodsTable";

export default function RS_MMM() {
  const {
    data: methodsData,
    isLoading: methodsLoading,
    isFetching: methodsFetching,
    error: methodsError,
    refetch,
  } = useMethods();
  const {
    data: intensityData,
    isLoading: intensityLoading,
    isFetching: intensityFetching,
    error: intensityError,
    refetch: refetchIntensity,
  } = useIntensity();
  const [backgroundImage] = useState(
    () => backgroundImages[Math.floor(Math.random() * backgroundImages.length)],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const createMethod = useCreateMethod();
  const updateMethod = useUpdateMethod();
  const isLoading = methodsLoading || intensityLoading;
  const hasError = Boolean(methodsError || intensityError);
  const isFetching = methodsFetching || intensityFetching;
  const intensities = intensityData || [];
  const methodsWithIntensity = useMemo(
    () =>
      (methodsData || []).map((method) => ({
        ...method,
        intensity: (intensityData || []).find(
          (intensity) => intensity.intensityId === method.intensity,
        ),
      })),
    [methodsData, intensityData],
  );

  const handleSave = async (formPayload) => {
    if (editing) {
      await updateMethod.mutateAsync({
        methodId: editing.methodId,
        createdDatetime: editing.createdDatetime,
        ...formPayload,
      });
    } else {
      await createMethod.mutateAsync(formPayload);
    }
    await refetch();
    setModalOpen(false);
  };

  return (
    <div
      className="methods-page"
      style={{ "--scene-image": "url(" + backgroundImage + ")" }}
    >
      <div className="methods-scene" aria-hidden="true" />
      <div className="methods-content">
        <header className="methods-hero">
          <h1>Money Making Methods</h1>
        </header>
        <section className="methods-panel" aria-labelledby="method-board-title">
          <div className="methods-panel-heading">
            <div>
              <h2 id="method-board-title">Methods</h2>
            </div>
            <button
              className="button button--gold"
              disabled={isLoading || hasError}
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Icon name="plus" /> Add method
            </button>
          </div>
          {isLoading ? (
            <div className="methods-loading" role="status" aria-live="polite">
              <span className="loading-rune" aria-hidden="true">
                <Icon name="rune" />
              </span>
              <h3>Loading methods…</h3>
              <div className="skeleton-rows" aria-hidden="true">
                {[1, 2, 3, 4].map((row) => (
                  <span key={row} />
                ))}
              </div>
            </div>
          ) : hasError ? (
            <div className="methods-empty" role="alert">
              <span className="state-icon">
                <Icon name="alert" />
              </span>
              <h3>Unable to load methods</h3>
              <p>Please try again in a moment.</p>
              <button
                className="button button--outline"
                disabled={isFetching}
                onClick={() => {
                  refetch();
                  refetchIntensity();
                }}
              >
                <Icon name="refresh" />
                {isFetching ? "Trying again…" : "Try again"}
              </button>
            </div>
          ) : (
            <MethodsTable
              data={methodsWithIntensity}
              onEdit={(method) => {
                setEditing(method);
                setModalOpen(true);
              }}
            />
          )}
        </section>
      </div>
      <MethodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        defaultValues={editing}
        intensityOptions={intensities}
        skillOptions={["Skilling", "Bossing", "Combat", "AFK", "Custom"]}
      />
    </div>
  );
}
