"use client"; // Renders a client component

// Import necessary types and components.
import type { Database } from "@/lib/schema";
import Image from "next/image";
import DescriptionDialog from "./species-description";

// Function to render species card
export default function SpeciesCard({ species, userID, }: {
  species: Database["public"]["Tables"]["species"]["Row"];
  userID: string;
  }) {
  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image
            className="rounded-sm"
            src={species.image}
            alt={species.scientific_name}
            fill style={{ objectFit: "cover" }}
          />
        </div>
      )}
      {/* Display name and some description */}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Renders "Learn More" to show species description */}
      <DescriptionDialog key={species.id} userID={userID} species={species}></DescriptionDialog>
    </div>
  );
}