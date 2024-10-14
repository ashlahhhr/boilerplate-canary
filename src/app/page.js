import PerfumeForm from "@/components/PerfumeForm";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfume Recommender</h1>
      <PerfumeForm />
    </main>
  );
}
