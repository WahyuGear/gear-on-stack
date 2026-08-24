type Props = {
    params: Promise<{
      id: string;
    }>;
  };
  
  export default async function BusinessDetailPage({ params }: Props) {
    const { id } = await params;
  
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <h1 className="text-3xl font-bold">
          Business Detail
        </h1>
  
        <p className="mt-4">
          ID: {id}
        </p>
      </main>
    );
  }