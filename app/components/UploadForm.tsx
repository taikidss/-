"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { Venue } from "../data/venues";
import { SEAT_TAGS, type TagId } from "../lib/tags";
import StarRating from "./StarRating";
import PanoramaViewer from "./PanoramaViewer";

interface Props {
  venues: Venue[];
  defaultVenueId?: string;
  defaultSectionId?: string;
}

export default function UploadForm({ venues, defaultVenueId, defaultSectionId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [venueId, setVenueId] = useState(defaultVenueId ?? "");
  const [sectionId, setSectionId] = useState(defaultSectionId ?? "");
  const [seatLabel, setSeatLabel] = useState("");
  const [photoType, setPhotoType] = useState<"flat" | "panorama" | "video">("flat");
  const [event, setEvent] = useState("");
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<TagId[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVenue = venues.find((v) => v.id === venueId);

  function handleVenueChange(id: string) {
    setVenueId(id);
    setSectionId("");
  }

  function toggleTag(id: TagId) {
    setTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !venueId || !sectionId || !seatLabel) {
      setError("すべての必須項目を入力してください");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("venueId", venueId);
    formData.append("sectionId", sectionId);
    formData.append("seatLabel", seatLabel);
    formData.append("photoType", photoType);
    if (event) formData.append("event", event);
    if (rating > 0) formData.append("rating", String(rating));
    if (tags.length > 0) formData.append("tags", JSON.stringify(tags));

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "アップロードに失敗しました");
      setLoading(false);
      return;
    }

    localStorage.setItem("biewun_has_uploaded", "1");
    router.push(`/venue/${venueId}/seat/${json.photo.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 会場 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">会場 *</label>
        <select
          value={venueId}
          onChange={(e) => handleVenueChange(e.target.value)}
          required
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        >
          <option value="">選択してください</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* ブロック */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">ブロック *</label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          required
          disabled={!selectedVenue}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 disabled:opacity-40"
        >
          <option value="">選択してください</option>
          {selectedVenue?.sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* 座席番号 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">座席番号 *</label>
        <input
          type="text"
          value={seatLabel}
          onChange={(e) => setSeatLabel(e.target.value)}
          placeholder="例: 3列 15番"
          required
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* イベント名 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">
          イベント名 <span className="text-gray-500 font-normal">（任意）</span>
        </label>
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="例: RIZIN 50"
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* ★ 見やすさ評価 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">
          見やすさ評価 <span className="text-gray-500 font-normal">（任意）</span>
        </label>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          {rating > 0 && (
            <span className="text-sm text-zinc-400">
              {["", "悪い", "やや悪い", "普通", "良い", "最高"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* タグ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">
          気になる点 <span className="text-gray-500 font-normal">（複数選択可）</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SEAT_TAGS.map((tag) => {
            const selected = tags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
                  selected
                    ? "bg-zinc-700 border-zinc-500 text-white"
                    : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <span>{tag.emoji}</span>
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 写真の種類 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">種類 *</label>
        <div className="flex gap-2">
          {([
            { type: "flat", label: "📷 写真" },
            { type: "video", label: "🎬 動画" },
            { type: "panorama", label: "🌐 360°" },
          ] as const).map(({ type, label }) => (
            <label
              key={type}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm cursor-pointer transition-colors ${
                photoType === type
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="photoType"
                value={type}
                checked={photoType === type}
                onChange={() => { setPhotoType(type); setFile(null); setPreview(null); }}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ファイル選択 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">{photoType === "video" ? "動画を選択" : "写真を選択"} *</label>
        <input
          ref={fileInputRef}
          type="file"
          accept={photoType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          required
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-dashed border-gray-600 bg-gray-800/50 px-4 py-6 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors text-center"
        >
          {file ? file.name : "クリックして画像を選択（最大20MB）"}
        </button>
        {preview && photoType === "panorama" && (
          <div className="rounded-lg overflow-hidden border border-blue-800 mt-1 h-52">
            <PanoramaViewer imageUrl={preview} title="プレビュー" />
          </div>
        )}
        {preview && photoType === "flat" && (
          <div className="rounded-lg overflow-hidden border border-gray-700 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="プレビュー" className="w-full max-h-48 object-cover" />
          </div>
        )}
        {preview && photoType === "video" && (
          <div className="rounded-lg overflow-hidden border border-gray-700 mt-1">
            <video src={preview} controls className="w-full max-h-48" />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-900/30 border border-red-800 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "アップロード中..." : "写真を投稿する"}
      </button>
    </form>
  );
}
