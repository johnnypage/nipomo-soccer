import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addKidSchema } from "@shared/challengeValidation";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";

const formSchema = z.object({
  kids: z.array(addKidSchema).min(1, "Add at least one kid"),
});

type FormData = z.infer<typeof formSchema>;

const inputClasses =
  "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";

export default function AddKidForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kids: [{ firstName: "", lastName: "", birthdate: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "kids",
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      for (const kid of data.kids) {
        await apiRequest("POST", "/api/kids", kid);
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: `Added ${data.kids.length} kid${data.kids.length > 1 ? "s" : ""} to your account`,
      });
      reset();
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-warmwhite/55 text-sm font-medium">
              Kid {index + 1}
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-warmwhite/30 hover:text-crimson transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-warmwhite/70 text-sm mb-1.5">First name</label>
              <input
                type="text"
                placeholder="First name"
                className={inputClasses}
                {...register(`kids.${index}.firstName`)}
              />
              {errors.kids?.[index]?.firstName && (
                <p className="text-crimson text-sm mt-1">
                  {errors.kids[index]?.firstName?.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-warmwhite/70 text-sm mb-1.5">Last name</label>
              <input
                type="text"
                placeholder="Last name"
                className={inputClasses}
                {...register(`kids.${index}.lastName`)}
              />
              {errors.kids?.[index]?.lastName && (
                <p className="text-crimson text-sm mt-1">
                  {errors.kids[index]?.lastName?.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-warmwhite/70 text-sm mb-1.5">Birthdate</label>
            <input
              type="date"
              className={inputClasses}
              {...register(`kids.${index}.birthdate`)}
            />
            {errors.kids?.[index]?.birthdate && (
              <p className="text-crimson text-sm mt-1">
                {errors.kids[index]?.birthdate?.message}
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ firstName: "", lastName: "", birthdate: "" })}
        className="flex items-center gap-2 text-gold hover:text-gold/80 text-sm font-semibold transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add another kid
      </button>

      {errors.kids?.root && (
        <p className="text-crimson text-sm">{errors.kids.root.message}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Kids"
        )}
      </button>
    </form>
  );
}
