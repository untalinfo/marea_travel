"use client";

import { StoreImage } from "@/components/store/StoreImage";
import { PRODUCT_FALLBACK_SRC } from "@/lib/brand-assets";
import {
  type CategoryOption,
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getCategories,
  toggleProductStatus,
  updateAdminProduct,
  uploadProductImage,
} from "@/lib/supabase/admin";
import { formatCOP } from "@/lib/utils";
import type { AdminProduct } from "@/types";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  PlusCircle,
  ShieldAlert,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "MAREA2026";
const SESSION_KEY = "marea_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

interface GalleryImageDraft {
  id: string;
  url: string;
  isUploading?: boolean;
  objectUrl?: string;
}

function isValidImageUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function revokeObjectUrlSet(urlSet: Set<string>) {
  for (const url of urlSet) {
    URL.revokeObjectURL(url);
  }
  urlSet.clear();
}

interface ProductGalleryEditorProps {
  idPrefix: string;
  items: GalleryImageDraft[];
  urlInput: string;
  urlError: string | null;
  isUploading: boolean;
  emptyHint: string;
  onUrlInputChange: (value: string) => void;
  onAddUrl: () => void;
  onUploadFiles: (files: FileList) => void;
  onSetPrimary: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}

function ProductGalleryEditor({
  idPrefix,
  items,
  urlInput,
  urlError,
  isUploading,
  emptyHint,
  onUrlInputChange,
  onAddUrl,
  onUploadFiles,
  onSetPrimary,
  onMove,
  onRemove,
}: ProductGalleryEditorProps) {
  const fileInputId = `${idPrefix}-files`;
  const urlInputId = `${idPrefix}-url`;

  return (
    <div className="p-5 border border-dashed border-control-border rounded-2xl bg-canvas space-y-4">
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-hairline bg-surface p-2 space-y-2"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-surface-alt border border-hairline">
                <StoreImage
                  src={item.url}
                  alt={`Imagen ${idx + 1} del producto`}
                  fill
                  sizes="160px"
                  unoptimized
                  className="object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-ink text-canvas text-[10px] font-semibold">
                    Principal
                  </span>
                )}
                {item.isUploading && (
                  <div className="absolute inset-0 bg-canvas/75 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-ocean animate-spin" aria-hidden="true" />
                    <span className="sr-only">Subiendo imagen...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onMove(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`Mover imagen ${idx + 1} a la izquierda`}
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-canvas disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label={`Mover imagen ${idx + 1} a la derecha`}
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-canvas disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(idx)}
                      aria-label={`Marcar imagen ${idx + 1} como principal`}
                      title="Marcar como principal"
                      className="p-1.5 rounded-md text-ink-muted hover:text-ocean hover:bg-canvas transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    aria-label={`Eliminar imagen ${idx + 1}`}
                    className="p-1.5 rounded-md text-ink-muted hover:text-red-700 hover:bg-canvas transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-hairline flex items-center justify-center text-ink-muted mx-auto">
            <ImageIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-xs text-ink-muted">{emptyHint}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <label
          htmlFor={fileInputId}
          className="relative cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink hover:bg-ocean text-canvas font-semibold text-xs transition-colors focus-within:outline-2 focus-within:outline-ink focus-within:outline-offset-2"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            id={fileInputId}
            name={fileInputId}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUploadFiles(e.target.files);
                e.target.value = "";
              }
            }}
            className="sr-only"
          />
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Subiendo a Supabase...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" aria-hidden="true" />
              Subir fotos
            </>
          )}
        </label>
      </div>

      <p className="text-xs text-ink-muted text-center">
        Se almacenan en el bucket <code>product-images</code>. La primera foto será la principal.
      </p>

      <div className="pt-3 border-t border-hairline text-left space-y-1.5">
        <label htmlFor={urlInputId} className="block text-xs font-semibold text-ink">
          Agregar imagen por URL
        </label>
        <div className="flex items-center gap-2">
          <input
            id={urlInputId}
            name={urlInputId}
            type="text"
            inputMode="url"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            value={urlInput}
            onChange={(e) => onUrlInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddUrl();
              }
            }}
            placeholder="https://..."
            className="flex-1 min-w-0 bg-surface border border-control-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-ink-muted"
          />
          <button
            type="button"
            onClick={onAddUrl}
            className="px-3.5 py-2 rounded-xl bg-surface border border-control-border text-ink text-xs font-semibold hover:border-ink transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Agregar
          </button>
        </div>
        {urlError && (
          <p role="alert" className="text-xs text-red-700 pt-0.5">
            {urlError}
          </p>
        )}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"nuevo" | "inventario">("nuevo");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Formulario nuevo producto
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [material, setMaterial] = useState("Acero Inoxidable 316L (Grado Marino)");
  const [waterproof, setWaterproof] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(12);
  const [sku, setSku] = useState("");

  // Galería de imágenes (Nuevo accesorio)
  const [createImages, setCreateImages] = useState<GalleryImageDraft[]>([]);
  const [createUrlInput, setCreateUrlInput] = useState("");
  const [createUrlError, setCreateUrlError] = useState<string | null>(null);
  const createObjectUrlsRef = useRef<Set<string>>(new Set());
  const createRemovedDraftIdsRef = useRef<Set<string>>(new Set());
  const createUploadSeqRef = useRef(0);

  // Modal de edición de producto
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | "">("");
  const [editImages, setEditImages] = useState<GalleryImageDraft[]>([]);
  const [editUrlInput, setEditUrlInput] = useState("");
  const [editUrlError, setEditUrlError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const isSavingEditRef = useRef(false);
  const editObjectUrlsRef = useRef<Set<string>>(new Set());
  const editRemovedDraftIdsRef = useRef<Set<string>>(new Set());
  const editUploadSeqRef = useRef(0);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const editTriggerRef = useRef<HTMLButtonElement | null>(null);

  const tabNuevoRef = useRef<HTMLButtonElement>(null);
  const tabInventarioRef = useRef<HTMLButtonElement>(null);

  const isUploadingCreateImages = createImages.some((item) => item.isUploading);
  const isUploadingEditImages = editImages.some((item) => item.isUploading);

  useEffect(() => {
    isSavingEditRef.current = isSavingEdit;
  }, [isSavingEdit]);

  useEffect(() => {
    const createSet = createObjectUrlsRef.current;
    const editSet = editObjectUrlsRef.current;
    return () => {
      revokeObjectUrlSet(createSet);
      revokeObjectUrlSet(editSet);
    };
  }, []);

  // Sincronizar modal nativo <dialog> de edición
  useEffect(() => {
    const dialog = editDialogRef.current;
    if (!dialog) return;

    if (editingProduct && !dialog.open) {
      dialog.showModal();
    } else if (!editingProduct && dialog.open) {
      dialog.close();
    }
  }, [editingProduct]);

  // Fallback light-dismiss para navegadores sin soporte de `closedBy` (ej. Safari)
  useEffect(() => {
    if (isCheckingAuth || !isAuthenticated) return;
    const dialog = editDialogRef.current;
    if (!dialog) return;
    if ("closedBy" in HTMLDialogElement.prototype) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (!dialog.open || isSavingEditRef.current) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [isAuthenticated, isCheckingAuth]);

  const handleCloseEditDialog = useCallback(() => {
    editUploadSeqRef.current += 1;
    revokeObjectUrlSet(editObjectUrlsRef.current);
    editRemovedDraftIdsRef.current.clear();
    isSavingEditRef.current = false;
    setEditingProduct(null);
    setEditImages([]);
    setEditUrlInput("");
    setEditUrlError(null);
    setEditError(null);
    setIsSavingEdit(false);

    const trigger = editTriggerRef.current;
    if (trigger?.isConnected && !trigger.disabled) {
      trigger.focus();
    }
  }, []);

  // Feedback accesible
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  // Validar sesión de 24 horas al montar
  useEffect(() => {
    try {
      localStorage.removeItem("marea_admin_auth");

      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.auth === true &&
          typeof parsed.expiresAt === "number" &&
          Number.isFinite(parsed.expiresAt) &&
          Date.now() < parsed.expiresAt
        ) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
          setIsAuthenticated(false);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput("");
      try {
        const sessionData = {
          auth: true,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      } catch {
        // Ignorar errores de almacenamiento
      }
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    createUploadSeqRef.current += 1;
    editUploadSeqRef.current += 1;
    revokeObjectUrlSet(createObjectUrlsRef.current);
    revokeObjectUrlSet(editObjectUrlsRef.current);
    createRemovedDraftIdsRef.current.clear();
    editRemovedDraftIdsRef.current.clear();
    isSavingEditRef.current = false;
    setCreateImages([]);
    setCreateUrlInput("");
    setCreateUrlError(null);
    setEditingProduct(null);
    setEditImages([]);
    setIsSavingEdit(false);
    setIsAuthenticated(false);
    setPinInput("");
    setPinError(false);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignorar errores de almacenamiento
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextTab: "nuevo" | "inventario" | null = null;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        nextTab = activeTab === "nuevo" ? "inventario" : "nuevo";
        break;
      case "Home":
        nextTab = "nuevo";
        break;
      case "End":
        nextTab = "inventario";
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(nextTab);
    if (nextTab === "nuevo") {
      tabNuevoRef.current?.focus();
    } else {
      tabInventarioRef.current?.focus();
    }
  };

  // Cargar categorías e inventario al autenticarse
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }

      setLoadingProducts(true);
      const prods = await getAdminProducts();
      setProducts(prods);
      setLoadingProducts(false);
    }

    loadData();
  }, [isAuthenticated]);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);

    if (!sku) {
      const cleanCode = val
        .substring(0, 3)
        .toUpperCase()
        .replace(/[^A-Z]/g, "MT");
      setSku(`MT-${cleanCode}-${Math.floor(10 + Math.random() * 90)}`);
    }
  };

  const uploadFilesToGallery = useCallback(
    async (
      files: FileList,
      seqRef: React.MutableRefObject<number>,
      objectUrlsRef: React.MutableRefObject<Set<string>>,
      removedDraftIdsRef: React.MutableRefObject<Set<string>>,
      setItems: React.Dispatch<React.SetStateAction<GalleryImageDraft[]>>,
      onUploadError: (message: string) => void,
    ) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      const sessionSeq = seqRef.current;
      const drafts = fileArray.map((file) => {
        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(objectUrl);
        return {
          file,
          draft: {
            id: crypto.randomUUID(),
            url: objectUrl,
            objectUrl,
            isUploading: true,
          } satisfies GalleryImageDraft,
        };
      });

      setItems((prev) => [...prev, ...drafts.map((entry) => entry.draft)]);

      let failedCount = 0;
      let firstErrorMessage: string | null = null;

      await Promise.all(
        drafts.map(async ({ file, draft }) => {
          try {
            const { url: uploadedUrl, error: uploadError } = await uploadProductImage(file);
            if (draft.objectUrl) {
              URL.revokeObjectURL(draft.objectUrl);
              objectUrlsRef.current.delete(draft.objectUrl);
            }

            if (seqRef.current !== sessionSeq) return;
            if (removedDraftIdsRef.current.has(draft.id)) {
              removedDraftIdsRef.current.delete(draft.id);
              return;
            }

            if (uploadedUrl) {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === draft.id
                    ? { ...item, url: uploadedUrl, objectUrl: undefined, isUploading: false }
                    : item,
                ),
              );
            } else {
              failedCount += 1;
              if (!firstErrorMessage && uploadError) {
                firstErrorMessage = uploadError;
              }
              setItems((prev) => prev.filter((item) => item.id !== draft.id));
            }
          } catch (err) {
            if (draft.objectUrl) {
              URL.revokeObjectURL(draft.objectUrl);
              objectUrlsRef.current.delete(draft.objectUrl);
            }
            if (seqRef.current !== sessionSeq) return;
            if (removedDraftIdsRef.current.has(draft.id)) {
              removedDraftIdsRef.current.delete(draft.id);
              return;
            }
            failedCount += 1;
            if (!firstErrorMessage && err instanceof Error && err.message) {
              firstErrorMessage = err.message;
            }
            setItems((prev) => prev.filter((item) => item.id !== draft.id));
          }
        }),
      );

      if (seqRef.current === sessionSeq && failedCount > 0) {
        const detail = firstErrorMessage ? ` (${firstErrorMessage})` : "";
        onUploadError(
          failedCount === 1
            ? `No se pudo subir la imagen al Storage de Supabase${detail}. Puedes agregar una URL externa.`
            : `No se pudieron subir ${failedCount} imágenes al Storage de Supabase${detail}. Puedes agregar URLs externas.`,
        );
      }
    },
    [],
  );

  const setPrimaryGalleryItem = useCallback(
    (setItems: React.Dispatch<React.SetStateAction<GalleryImageDraft[]>>, index: number) => {
      setItems((prev) => {
        if (index <= 0 || index >= prev.length) return prev;
        const next = [...prev];
        const [selected] = next.splice(index, 1);
        return [selected, ...next];
      });
    },
    [],
  );

  const moveGalleryItem = useCallback(
    (
      setItems: React.Dispatch<React.SetStateAction<GalleryImageDraft[]>>,
      index: number,
      direction: -1 | 1,
    ) => {
      setItems((prev) => {
        const target = index + direction;
        if (target < 0 || target >= prev.length) return prev;
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
    },
    [],
  );

  const removeGalleryItem = useCallback(
    (
      setItems: React.Dispatch<React.SetStateAction<GalleryImageDraft[]>>,
      objectUrlsRef: React.MutableRefObject<Set<string>>,
      removedDraftIdsRef: React.MutableRefObject<Set<string>>,
      index: number,
    ) => {
      setItems((prev) => {
        const target = prev[index];
        if (target) {
          if (target.isUploading) {
            removedDraftIdsRef.current.add(target.id);
          }
          if (target.objectUrl) {
            URL.revokeObjectURL(target.objectUrl);
            objectUrlsRef.current.delete(target.objectUrl);
          }
        }
        return prev.filter((_, idx) => idx !== index);
      });
    },
    [],
  );

  const handleAddCreateImageUrl = () => {
    const trimmed = createUrlInput.trim();
    if (!isValidImageUrl(trimmed) || trimmed === PRODUCT_FALLBACK_SRC) {
      setCreateUrlError("Ingresa una URL de imagen válida (https://... o /...).");
      return;
    }
    if (createImages.some((item) => item.url.trim() === trimmed)) {
      setCreateUrlError("Esa imagen ya está en la galería.");
      return;
    }
    setCreateUrlError(null);
    setCreateImages((prev) => [...prev, { id: crypto.randomUUID(), url: trimmed }]);
    setCreateUrlInput("");
  };

  const handleAddEditImageUrl = () => {
    const trimmed = editUrlInput.trim();
    if (!isValidImageUrl(trimmed) || trimmed === PRODUCT_FALLBACK_SRC) {
      setEditUrlError("Ingresa una URL de imagen válida (https://... o /...).");
      return;
    }
    if (editImages.some((item) => item.url.trim() === trimmed)) {
      setEditUrlError("Esa imagen ya está en la galería.");
      return;
    }
    setEditUrlError(null);
    setEditImages((prev) => [...prev, { id: crypto.randomUUID(), url: trimmed }]);
    setEditUrlInput("");
  };

  const handleOpenEditModal = (prod: AdminProduct, trigger: HTMLButtonElement) => {
    editTriggerRef.current = trigger;
    editUploadSeqRef.current += 1;
    revokeObjectUrlSet(editObjectUrlsRef.current);
    editRemovedDraftIdsRef.current.clear();

    const initialUrls = (
      prod.imageRecords !== undefined
        ? prod.imageRecords.map((record) => record.imageUrl)
        : prod.images
    ).filter((url) => Boolean(url?.trim()) && url.trim() !== PRODUCT_FALLBACK_SRC);

    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPrice(prod.price);
    setEditOriginalPrice(prod.originalPrice ?? "");
    setEditImages(
      initialUrls.map((url) => ({
        id: crypto.randomUUID(),
        url,
      })),
    );
    setEditUrlInput("");
    setEditUrlError(null);
    setEditError(null);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditError(null);

    if (isUploadingEditImages) {
      setEditError("Espera a que terminen de subir las imágenes antes de guardar.");
      return;
    }

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditError("El nombre del producto es obligatorio.");
      return;
    }

    const numericPrice = Number(editPrice);
    if (editPrice === "" || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setEditError("Ingresa un precio de venta válido mayor a $0 COP.");
      return;
    }

    const hasOriginalPrice = String(editOriginalPrice).trim() !== "";
    const numericOriginalPrice = hasOriginalPrice ? Number(editOriginalPrice) : null;
    if (
      hasOriginalPrice &&
      (!Number.isFinite(numericOriginalPrice) || (numericOriginalPrice ?? 0) <= numericPrice)
    ) {
      setEditError("El precio anterior debe ser mayor al precio de venta.");
      return;
    }

    const finalImageUrls = Array.from(
      new Set(
        editImages
          .filter((item) => !item.isUploading)
          .map((item) => item.url.trim())
          .filter((url) => url.length > 0 && url !== PRODUCT_FALLBACK_SRC),
      ),
    );

    const hadExistingPhotos =
      editingProduct.imageRecords !== undefined
        ? editingProduct.imageRecords.length > 0
        : editingProduct.images.some(
            (url) => Boolean(url?.trim()) && url.trim() !== PRODUCT_FALLBACK_SRC,
          );

    if (finalImageUrls.length === 0 && hadExistingPhotos) {
      setEditError("Agrega al menos una imagen real del producto.");
      return;
    }

    const saveSeq = editUploadSeqRef.current;
    const targetProductId = editingProduct.id;

    isSavingEditRef.current = true;
    setIsSavingEdit(true);

    const result = await updateAdminProduct({
      id: targetProductId,
      name: trimmedName,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      imageUrls: finalImageUrls,
    });

    if (editUploadSeqRef.current !== saveSeq) return;

    isSavingEditRef.current = false;
    setIsSavingEdit(false);

    if (result.success) {
      const updatedProducts = await getAdminProducts();
      setProducts(updatedProducts);
      if (editUploadSeqRef.current !== saveSeq) return;
      setFeedback({
        type: "success",
        message: `Producto "${trimmedName}" actualizado con éxito.`,
      });
      editDialogRef.current?.close();
    } else {
      setEditError(result.error || "No se pudieron guardar los cambios del producto.");
      void getAdminProducts().then((refreshed) => {
        setProducts(refreshed);
      });
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (isUploadingCreateImages) {
      setFeedback({
        type: "error",
        message: "Espera a que terminen de subir las imágenes antes de publicar.",
      });
      return;
    }

    if (!name.trim() || !slug.trim() || !categoryId) {
      setFeedback({
        type: "error",
        message: "Por favor completa los campos obligatorios (Nombre, Slug y Categoría).",
      });
      return;
    }

    if (price === "" || Number(price) <= 0 || !Number.isFinite(Number(price))) {
      setFeedback({
        type: "error",
        message: "Ingresa un precio válido mayor a $0 COP.",
      });
      return;
    }

    if (
      String(originalPrice).trim() !== "" &&
      (!Number.isFinite(Number(originalPrice)) || Number(originalPrice) < 0)
    ) {
      setFeedback({
        type: "error",
        message: "El precio anterior debe ser un número válido mayor o igual a $0 COP.",
      });
      return;
    }

    const finalImageUrls = Array.from(
      new Set(
        createImages
          .filter((item) => !item.isUploading)
          .map((item) => item.url.trim())
          .filter((url) => url.length > 0 && url !== PRODUCT_FALLBACK_SRC),
      ),
    );

    setIsSubmitting(true);

    const result = await createAdminProduct({
      name: name.trim(),
      slug: slug.trim(),
      categoryId,
      description:
        description.trim() ||
        `${name} en acero inoxidable 316L. Resistente al agua de mar y sudor.`,
      price: Number(price),
      originalPrice: String(originalPrice).trim() !== "" ? Number(originalPrice) : undefined,
      material: material.trim() || "Acero Inoxidable 316L (Grado Marino)",
      waterproof,
      isFeatured,
      isActive,
      imageUrls: finalImageUrls,
      stockQuantity: Math.max(0, Number(stockQuantity) || 0),
      sku: sku.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setFeedback({
        type: "success",
        message: `Producto "${name}" publicado con éxito en Supabase.`,
      });

      createUploadSeqRef.current += 1;
      revokeObjectUrlSet(createObjectUrlsRef.current);
      createRemovedDraftIdsRef.current.clear();
      setCreateImages([]);
      setCreateUrlInput("");
      setCreateUrlError(null);
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setSku("");

      const updated = await getAdminProducts();
      setProducts(updated);
    } else {
      setFeedback({
        type: "error",
        message: result.error || "No se pudo guardar el producto.",
      });
    }
  };

  const handleConfirmDelete = async (id: string, prodName: string) => {
    const ok = await deleteAdminProduct(id);
    setPendingDeleteId(null);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({
        type: "success",
        message: `Producto "${prodName}" eliminado del catálogo.`,
      });
    } else {
      setFeedback({
        type: "error",
        message: `No se pudo eliminar "${prodName}". Verifica los permisos RLS en Supabase.`,
      });
    }
  };

  const handleToggleActive = async (id: string, currentIsActive: boolean) => {
    const ok = await toggleProductStatus(id, currentIsActive);
    if (ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !currentIsActive } : p)),
      );
      setFeedback({
        type: "success",
        message: currentIsActive
          ? "El producto quedó oculto en la tienda."
          : "El producto está visible en la tienda.",
      });
    } else {
      setFeedback({
        type: "error",
        message: "No se pudo actualizar la visibilidad del producto.",
      });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <h1 className="sr-only">Panel de administración</h1>
        <output className="flex items-center justify-center" aria-live="polite">
          <Loader2 className="w-7 h-7 text-ocean animate-spin" aria-hidden="true" />
          <span className="sr-only">Verificando sesión administrativa...</span>
        </output>
      </div>
    );
  }

  // Pantalla de acceso por PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-surface rounded-2xl border border-hairline p-8 space-y-6 shadow-sm"
        >
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-alt border border-hairline flex items-center justify-center text-ocean mx-auto">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold text-ink">
                Panel de administración
              </h1>
              <p className="text-xs text-ink-muted">
                Ingresa tu PIN de acceso para gestionar el catálogo de Marea Travel.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="admin-pin" className="block text-xs font-semibold text-ink">
              PIN de acceso
            </label>
            <input
              id="admin-pin"
              name="pin"
              type="password"
              required
              autoComplete="current-password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError(false);
              }}
              placeholder="Ingresa tu PIN"
              aria-invalid={pinError}
              aria-describedby={pinError ? "admin-pin-error" : undefined}
              className="w-full bg-canvas border border-control-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted"
            />
            {pinError && (
              <p
                id="admin-pin-error"
                role="alert"
                className="text-xs text-red-700 flex items-center gap-1.5 pt-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                PIN incorrecto. Verifica e intenta nuevamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-5 rounded-full bg-ink hover:bg-ocean text-canvas font-semibold text-sm transition-colors"
          >
            Acceder al panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-hairline pb-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-text">
            Gestión de catálogo y stock
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            Panel Marea Travel
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-surface border border-control-border text-ink text-xs font-semibold inline-flex items-center gap-1.5 hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Ir a la tienda
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-surface border border-red-700 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs accesibles */}
      <div
        role="tablist"
        aria-label="Secciones del panel administrativo"
        className="flex flex-wrap gap-2 border-b border-hairline pb-4"
      >
        <button
          ref={tabNuevoRef}
          id="tab-nuevo"
          type="button"
          role="tab"
          tabIndex={activeTab === "nuevo" ? 0 : -1}
          aria-selected={activeTab === "nuevo"}
          aria-controls="panel-nuevo"
          onClick={() => setActiveTab("nuevo")}
          onKeyDown={handleTabKeyDown}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-2 border ${
            activeTab === "nuevo"
              ? "bg-ink text-canvas border-ink"
              : "bg-surface text-ink-muted border-control-border hover:text-ink"
          }`}
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          Nuevo accesorio
        </button>

        <button
          ref={tabInventarioRef}
          id="tab-inventario"
          type="button"
          role="tab"
          tabIndex={activeTab === "inventario" ? 0 : -1}
          aria-selected={activeTab === "inventario"}
          aria-controls="panel-inventario"
          onClick={() => setActiveTab("inventario")}
          onKeyDown={handleTabKeyDown}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-2 border ${
            activeTab === "inventario"
              ? "bg-ink text-canvas border-ink"
              : "bg-surface text-ink-muted border-control-border hover:text-ink"
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          Inventario ({products.length})
        </button>
      </div>

      {/* Banner de feedback */}
      {feedback && (
        <output
          aria-live="polite"
          className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-4 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline underline-offset-4 shrink-0"
          >
            Cerrar
          </button>
        </output>
      )}

      {/* Tab 1: Nuevo accesorio */}
      <section
        id="panel-nuevo"
        role="tabpanel"
        aria-labelledby="tab-nuevo"
        hidden={activeTab !== "nuevo"}
      >
        <form
          onSubmit={handleSubmitProduct}
          className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-8"
        >
          <h2 className="font-display text-2xl font-semibold text-ink border-b border-hairline pb-4">
            Cargar nuevo accesorio
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Columna izquierda */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-semibold text-ink">
                  Nombre del accesorio <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Cadena Dije Ancla Marina 316L"
                  className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="slug" className="block text-xs font-semibold text-ink">
                    Slug URL <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cadena-ancla-marina-316l"
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="categoryId" className="block text-xs font-semibold text-ink">
                    Categoría <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="price" className="block text-xs font-semibold text-ink">
                    Precio de venta (COP) <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={1}
                    step="any"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="Ej: 79000"
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink tabular-nums placeholder:text-ink-muted"
                  />
                  {price !== "" && Number.isFinite(Number(price)) && Number(price) > 0 && (
                    <p className="text-xs text-ocean font-medium tabular-nums">
                      Vista previa: {formatCOP(Number(price))}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="originalPrice" className="block text-xs font-semibold text-ink">
                    Precio anterior (opcional)
                  </label>
                  <input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    min={0}
                    step="any"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value !== "" ? Number(e.target.value) : "")
                    }
                    placeholder="Ej: 95000"
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink tabular-nums placeholder:text-ink-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="stockQuantity" className="block text-xs font-semibold text-ink">
                    Cantidad en stock
                  </label>
                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink tabular-nums"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="sku" className="block text-xs font-semibold text-ink">
                    Código SKU
                  </label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    autoCorrect="off"
                    spellCheck={false}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MT-ANC-01"
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="material" className="block text-xs font-semibold text-ink">
                  Material
                </label>
                <input
                  id="material"
                  name="material"
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-xs font-semibold text-ink">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de diseño, largo de cadena y resistencia al agua..."
                  className="w-full bg-canvas border border-control-border rounded-xl p-3 text-sm text-ink placeholder:text-ink-muted"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink">
                  Galería del producto (subir una o varias fotos o agregar URL)
                </p>

                <ProductGalleryEditor
                  idPrefix="create-product"
                  items={createImages}
                  urlInput={createUrlInput}
                  urlError={createUrlError}
                  isUploading={isUploadingCreateImages}
                  emptyHint="Aún no has agregado fotos. Si publicas sin fotos se usará la imagen por defecto."
                  onUrlInputChange={(val) => {
                    setCreateUrlInput(val);
                    if (createUrlError) setCreateUrlError(null);
                  }}
                  onAddUrl={handleAddCreateImageUrl}
                  onUploadFiles={(files) => {
                    setFeedback(null);
                    setCreateUrlError(null);
                    uploadFilesToGallery(
                      files,
                      createUploadSeqRef,
                      createObjectUrlsRef,
                      createRemovedDraftIdsRef,
                      setCreateImages,
                      (message) => setFeedback({ type: "error", message }),
                    );
                  }}
                  onSetPrimary={(index) => setPrimaryGalleryItem(setCreateImages, index)}
                  onMove={(index, direction) => moveGalleryItem(setCreateImages, index, direction)}
                  onRemove={(index) =>
                    removeGalleryItem(
                      setCreateImages,
                      createObjectUrlsRef,
                      createRemovedDraftIdsRef,
                      index,
                    )
                  }
                />
              </div>

              {/* Configuración */}
              <fieldset className="p-5 rounded-2xl bg-canvas border border-hairline space-y-3.5">
                <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-sand-text">
                  Configuración del producto
                </legend>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="waterproof"
                    checked={waterproof}
                    onChange={(e) => setWaterproof(e.target.checked)}
                    className="mt-0.5 accent-ocean"
                  />
                  <span className="text-xs text-ink-muted">
                    <strong className="text-ink">Apto para agua:</strong> Resiste mar, piscina y uso
                    diario.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mt-0.5 accent-ocean"
                  />
                  <span className="text-xs text-ink-muted">
                    <strong className="text-ink">Destacado:</strong> Mostrar con prioridad en el
                    catálogo.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="mt-0.5 accent-ocean"
                  />
                  <span className="text-xs text-ink-muted">
                    <strong className="text-ink">Activo en tienda:</strong> Visible de inmediato
                    para compradores.
                  </span>
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingCreateImages}
                className="w-full py-3.5 px-6 rounded-full bg-ink hover:bg-ocean text-canvas font-semibold text-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Guardando en Supabase...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Publicar accesorio
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Tab 2: Inventario */}
      <section
        id="panel-inventario"
        role="tabpanel"
        aria-labelledby="tab-inventario"
        hidden={activeTab !== "inventario"}
        className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
          <h2 className="font-display text-2xl font-semibold text-ink">Accesorios en Supabase</h2>
          <span className="text-xs font-semibold text-ink-muted tabular-nums">
            Total: {products.length} productos
          </span>
        </div>

        {loadingProducts ? (
          <output className="py-12 flex justify-center text-ocean" aria-live="polite">
            <Loader2 className="w-7 h-7 animate-spin" aria-hidden="true" />
            <span className="sr-only">Cargando inventario...</span>
          </output>
        ) : products.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-8">
            No hay productos registrados todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => {
              const realPhotoCount =
                prod.imageRecords !== undefined
                  ? prod.imageRecords.length
                  : prod.images.filter(
                      (url) => Boolean(url?.trim()) && url.trim() !== PRODUCT_FALLBACK_SRC,
                    ).length;

              return (
                <article
                  key={prod.id}
                  className="p-4 rounded-2xl bg-canvas border border-hairline space-y-3"
                >
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0 border border-hairline">
                        <StoreImage
                          src={prod.images[0]}
                          alt={prod.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-sand-text">
                            {prod.categoryName}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              prod.isActive
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                : "bg-surface-alt border-hairline text-ink-muted"
                            }`}
                          >
                            {prod.isActive ? "Activo" : "Oculto"}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-ink truncate">{prod.name}</h3>
                        <p className="text-xs text-ink-muted tabular-nums">
                          {formatCOP(prod.price)}
                          {prod.originalPrice ? ` (antes ${formatCOP(prod.originalPrice)})` : ""} ·
                          Stock: {prod.stockQuantity} · {realPhotoCount}{" "}
                          {realPhotoCount === 1 ? "foto" : "fotos"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(prod, e.currentTarget)}
                        aria-label={`Editar ${prod.name}`}
                        className="px-2.5 py-1.5 rounded-lg border border-control-border bg-surface text-ink hover:border-ink hover:bg-surface-alt text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </button>

                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver ${prod.name} en tienda`}
                        className="p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-surface transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(prod.id, prod.isActive)}
                        aria-label={
                          prod.isActive
                            ? `Ocultar ${prod.name} de la tienda`
                            : `Mostrar ${prod.name} en la tienda`
                        }
                        className="p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-surface transition-colors"
                      >
                        {prod.isActive ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(prod.id)}
                        aria-label={`Eliminar ${prod.name}`}
                        className="p-2 text-ink-muted hover:text-red-700 rounded-lg hover:bg-surface transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Confirmación inline de eliminación (sin confirm/alert nativos) */}
                  {pendingDeleteId === prod.id && (
                    <div
                      role="alert"
                      className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <span className="text-ink font-medium">
                        ¿Eliminar &ldquo;{prod.name}&rdquo;?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="px-3 py-1.5 rounded-full border border-control-border bg-surface text-ink font-semibold hover:bg-surface-alt transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(prod.id, prod.name)}
                          className="px-3 py-1.5 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal nativo <dialog> para editar producto */}
      <dialog
        ref={editDialogRef}
        {...({ closedby: isSavingEdit ? "none" : "any" } as Record<string, string>)}
        aria-labelledby="edit-product-dialog-title"
        onCancel={(e) => {
          if (isSavingEdit) {
            e.preventDefault();
          }
        }}
        onClose={handleCloseEditDialog}
        className="m-auto w-[min(94vw,42rem)] max-h-[90dvh] rounded-2xl bg-surface text-ink border border-hairline p-0 shadow-2xl open:flex flex-col"
      >
        {editingProduct && (
          <form onSubmit={handleSaveEditProduct} className="flex flex-col max-h-[90dvh] w-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-hairline flex items-center justify-between gap-3 bg-canvas rounded-t-2xl">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sand-text">
                  Editar producto
                </p>
                <h2
                  id="edit-product-dialog-title"
                  className="font-display text-2xl font-semibold text-ink truncate"
                >
                  {editingProduct.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => editDialogRef.current?.close()}
                disabled={isSavingEdit}
                aria-label="Cerrar modal de edición"
                className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-surface">
              {editError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="edit-product-name" className="block text-xs font-semibold text-ink">
                  Nombre del producto <span aria-hidden="true">*</span>
                </label>
                <input
                  id="edit-product-name"
                  name="editName"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-product-price"
                    className="block text-xs font-semibold text-ink"
                  >
                    Precio de venta (COP) <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="edit-product-price"
                    name="editPrice"
                    type="number"
                    min={1}
                    step="any"
                    required
                    value={editPrice}
                    onChange={(e) =>
                      setEditPrice(e.target.value !== "" ? Number(e.target.value) : "")
                    }
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink tabular-nums placeholder:text-ink-muted"
                  />
                  {editPrice !== "" &&
                    Number.isFinite(Number(editPrice)) &&
                    Number(editPrice) > 0 && (
                      <p className="text-xs text-ocean font-medium tabular-nums">
                        Vista previa: {formatCOP(Number(editPrice))}
                      </p>
                    )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-product-original-price"
                    className="block text-xs font-semibold text-ink"
                  >
                    Precio anterior / antes (COP, opcional)
                  </label>
                  <input
                    id="edit-product-original-price"
                    name="editOriginalPrice"
                    type="number"
                    min={0}
                    step="any"
                    value={editOriginalPrice}
                    onChange={(e) =>
                      setEditOriginalPrice(e.target.value !== "" ? Number(e.target.value) : "")
                    }
                    placeholder="Dejar vacío si no aplica"
                    className="w-full bg-canvas border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink tabular-nums placeholder:text-ink-muted"
                  />
                  {editOriginalPrice !== "" &&
                    Number.isFinite(Number(editOriginalPrice)) &&
                    Number(editOriginalPrice) > 0 && (
                      <p className="text-xs text-ink-muted font-medium tabular-nums">
                        Antes: {formatCOP(Number(editOriginalPrice))}
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink">
                  Galería de imágenes ({editImages.length})
                </p>

                <ProductGalleryEditor
                  idPrefix="edit-product"
                  items={editImages}
                  urlInput={editUrlInput}
                  urlError={editUrlError}
                  isUploading={isUploadingEditImages}
                  emptyHint="Agrega al menos una foto para guardar los cambios."
                  onUrlInputChange={(val) => {
                    setEditUrlInput(val);
                    if (editUrlError) setEditUrlError(null);
                  }}
                  onAddUrl={handleAddEditImageUrl}
                  onUploadFiles={(files) => {
                    setEditError(null);
                    setEditUrlError(null);
                    uploadFilesToGallery(
                      files,
                      editUploadSeqRef,
                      editObjectUrlsRef,
                      editRemovedDraftIdsRef,
                      setEditImages,
                      (message) => setEditError(message),
                    );
                  }}
                  onSetPrimary={(index) => setPrimaryGalleryItem(setEditImages, index)}
                  onMove={(index, direction) => moveGalleryItem(setEditImages, index, direction)}
                  onRemove={(index) =>
                    removeGalleryItem(
                      setEditImages,
                      editObjectUrlsRef,
                      editRemovedDraftIdsRef,
                      index,
                    )
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-hairline bg-canvas rounded-b-2xl flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => editDialogRef.current?.close()}
                disabled={isSavingEdit}
                className="px-5 py-2.5 rounded-full border border-control-border bg-surface text-ink text-xs font-semibold hover:border-ink transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSavingEdit || isUploadingEditImages}
                className="px-5 py-2.5 rounded-full bg-ink hover:bg-ocean text-canvas text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
