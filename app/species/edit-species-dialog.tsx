"use client"; // Make this a client component

// Import necessary components and libraries.
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define type
type Species = Database["public"]["Tables"]["species"]["Row"];

// Define kingdom enum for use in Zod schema and displaying dropdown options in the form
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// Use Zod to define the shape + requirements of a Species entry; used in form validation
const speciesSchema = z.object({
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .optional()
    .transform((val) => val?.trim()),
  common_name: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().min(1).optional(),
  image: z
    .string()
    .url()
    .nullable()
    .optional()
    .transform((val) => val?.trim()),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
});

type FormData = z.infer<typeof speciesSchema>;

// Default form values
const defaultValues: Partial<FormData> = {
    scientific_name: "",
    common_name: null,
    kingdom: "Animalia",
    total_population: 1,
    image: "",
    description: null,
};

// Edit species function
export default function EditSpeciesDialog({ species, userID }: { species: Species; userID: string }) {
    // Initialize router
    const router = useRouter();
    // Control open/closed state of the dialog
    const [open, setOpen] = useState<boolean>(false);

    // Instantiate form functionality with React Hook Form, passing in the Zod schema (for validation) and default values
    const form = useForm<FormData>({
        resolver: zodResolver(speciesSchema),
        defaultValues,
        mode: "onChange",
    });

    // Handle form submission
    const onSubmit = async (input: FormData) => {
        // Connect to Supabase client
        const supabase = createBrowserSupabaseClient();
        const { error } = await supabase
        .from("species")
        .update({
            author: userID,
            common_name: input.common_name,
            description: input.description,
            kingdom: input.kingdom,
            scientific_name: input.scientific_name,
            total_population: input.total_population,
            image: input.image,
        })
        .eq("id", species.id);

        // Catch and report errors from Supabase and exit the onSubmit function with an early 'return' if an error occurred.
        if (error) {
        return toast({
            title: "Something went wrong.",
            description: error.message,
            variant: "destructive",
        });
        }

        // Reset form values to the default (empty) values.
        form.reset(input);

        // Close dialog
        setOpen(false);

        // Refresh all server components in the current route
        router.refresh();

        return toast({
            title: "Species edited!",
            description: "Successfully edited " + species.scientific_name + ".",
          });
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Button to open dialog */}
        <Button className="ml-1 mr-1 w-1 flex-auto">Edit Species</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        {/* Edit species description */}
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>
            Edit an existing species here. Click &quot;Edit Species&quot; below when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* Render form with form fields values prefilled */}
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
              {/* Scientific name */}
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input placeholder={species.scientific_name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Common name */}
              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        {/* Sets defaultValue of 'null' to "" because inputs can't be null */}
                        <Input value={value ?? ""} placeholder={species.common_name!} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Kingdom */}
              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                      defaultValue={species.kingdom}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a kingdom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {/* Render kingdom options */}
                          {kingdoms.options.map((kingdom, index) => (
                            <SelectItem key={index} value={kingdom}>
                              {kingdom}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Total population */}
              <FormField
                control={form.control}
                name="total_population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total population</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={species.total_population?.toString()}
                        {...field}
                        onChange={(event) => field.onChange(+event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Image url */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder={species.image!} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        {/* Sets defaultValue of 'null' to "" because inputs can't be null */}
                        <Textarea value={value ?? ""} placeholder={species.description!} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex">
                {/* Submit edit */}
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Edit Species
                </Button>
                {/* Cancel edit */}
                <Button
                  type="button"
                  className="ml-1 mr-1 flex-auto"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}