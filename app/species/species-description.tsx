"use client"; // Make this a client component

// Import libraries and components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import DeleteSpeciesDialog from "./delete-species-dialog";
import EditSpeciesDialog from "./edit-species-dialog";

// Define type
type Species = Database["public"]["Tables"]["species"]["Row"];

// Function to display species information in a dialog
export default function SpeciesInfo({ species, userID }: { species: Species; userID: string }) {
  // Control open/closed state of the dialog
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div>
        {
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              {/* Opens dialog */}
              <Button className="mt-3 w-full">Learn More</Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                {/* Species name */}
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-[1.9rem]">{species.common_name}</DialogTitle>
                </div>
              </DialogHeader>
              {/* Species image */}
              <div className="relative h-80 w-full">
                <Image
                  className="rounded-sm"
                  src={species.image!}
                  alt={species.scientific_name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <DialogHeader>
                    {/* Species description */}
                    <DialogTitle className="text-[1.5rem]">Species Details</DialogTitle>
                    <DialogDescription className="text-[0.9rem]">
                      <strong>Scientific Name:</strong> {species.scientific_name}
                    </DialogDescription>
                    <DialogDescription className="text-[0.9rem]">
                      <strong>Common Name:</strong> {species.common_name}
                    </DialogDescription>
                    <DialogDescription className="text-[0.9rem]">
                      <strong>Total Population:</strong> {species.total_population}
                    </DialogDescription>
                    <DialogDescription className="text-[0.9rem]">
                      <strong>Kingdom:</strong> {species.kingdom}
                    </DialogDescription>
                    <DialogDescription className="text-[0.9rem]">
                      <strong>Description:</strong> {species.description}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="flex">
                  {/* Edit species button - makes sure user ID matches with author */}
                  {userID === species.author && (
                    <EditSpeciesDialog key={species.id} userID={userID} species={species}></EditSpeciesDialog>
                  )}
                  {/* Close button */}
                  <Button
                    type="button"
                    className="ml-1 mr-1 w-1 flex-auto"
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
                <DialogHeader>
                <div className="items-center justify-between">
                  {/* Delete species button - makes sure user ID matches with author */}
                  {userID === species.author && (
                    <DeleteSpeciesDialog key={species.id} {...species}></DeleteSpeciesDialog>
                  )}
                </div>
              </DialogHeader>
              </div>
            </DialogContent>
          </Dialog>
        }
      </div>
    </div>
  );
}