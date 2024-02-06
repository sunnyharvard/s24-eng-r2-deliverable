"use client"; // Renders a client component

// Import libraries and components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define type
type Species = Database["public"]["Tables"]["species"]["Row"];

// Delete species function
export default function DeleteSpecies(species: Species) {
    // Initialize router
    const router = useRouter();

    // Delete species submission
    const submitDelete = async () => {
        // Initialize Supabase client
        const supabase = createBrowserSupabaseClient();

        // Attempt to delete the species with user ID
        const { error } = await supabase.from("species").delete().eq("id", species.id);

        // Display toast if error occurs
        if (error) {
            return toast({
                title: "Something went wrong.",
                description: error.message,
                variant: "destructive",
            });
        }

        // Close the dialog
        setIsOpen(false); 

        // Refresh all server components in the current route 
        router.refresh();

        return toast({
            title: "Species deleted!",
            description: "Successfully deleted " + species.scientific_name + ".",
          });
    };

  // Control open/closed state of the dialog
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div>
        {
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              {/* Open dialog with button */}
              <Button variant="destructive" className="mt-0 w-full">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                {/* Confirmation of deletion */}
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This card will be deleted immediately and permanently. You can not undo this action.
              </DialogDescription>
              <DialogFooter>
                <div className="flex">
                  {/* Cancel deletion */}
                  <Button
                    type="button"
                    className="ml-1 mr-1 flex-auto"
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {/* Confirm deletion */}
                  <Button
                    type="submit"
                    variant="destructive"
                    className="ml-1 mr-1 flex-auto"
                    onClick={() => void submitDelete()}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      </div>
    </div>
  );
}