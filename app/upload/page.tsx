import Link from "next/link";
import { venues } from "../data/venues";
import UploadForm from "../components/UploadForm";

interface Props {
  searchParams: Promise<{ venue?: string; section?: string }>;
}

export default async function UploadPage({ searchParams }: Props) {
  const { venue, section } = await searchParams;

  return (
    <main className="max-w-lg mx-auto px-4 py-10 w-full">
      <div className="mb-2">
        <Link
          href={venue ? `/venue/${venue}` : "/"}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          ← 戻る
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">座席写真を投稿</h1>
      <p className="text-gray-400 text-sm mb-8">
        普通のスマホ写真でOK。360度カメラがあれば360度写真も投稿できます。
      </p>

      <UploadForm
        venues={venues}
        defaultVenueId={venue}
        defaultSectionId={section}
      />
    </main>
  );
}
