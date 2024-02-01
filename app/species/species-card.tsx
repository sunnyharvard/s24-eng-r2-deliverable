"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SpeciesCard({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);
  const[openEdit, setEditOpen] = useState<boolean>(false);
  const handleLearnMoreClick = () => {
    setOpen(true);
  };
  const handleEdit = () => {
    setOpen(false);
    setEditOpen(true);
  };
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace the button with the detailed view dialog. */}
      <Button className="mt-3 w-full" onClick={handleLearnMoreClick}>Learn More</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><h1 className="mt-3 text-3xl font-bold">Species Information</h1></DialogTitle>
            <DialogTitle><h3 className="mt-3 text-2xl font-semibold">Scientific Name: {species.scientific_name}</h3></DialogTitle>
            <DialogTitle><h4 className="text-lg font-light italic">Common Name: {species.common_name}</h4></DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <h5 className="text-lg font-light">Kingdom: {species.kingdom}</h5>
              <h5 className="text-lg font-light">Total Population: {species.total_population}</h5>
              <h5 className="text-lg font-light">Description: {species.description}</h5>
              <Button className="mt-2 w-full" onClick={handleEdit}>Edit</Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={openEdit} onOpenChange={setEditOpen}>
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>

    </div>
  );
}