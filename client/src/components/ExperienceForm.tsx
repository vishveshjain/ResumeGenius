import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Experience, experienceSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { KeywordChip } from "@/components/ui/keyword-chip";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface ExperienceFormProps {
  onSave: (experience: Experience) => void;
  suggestedKeywords?: string[];
  initialData?: Experience;
  isSimulated?: boolean;
}

export default function ExperienceForm({
  onSave,
  suggestedKeywords = [],
  initialData,
  isSimulated = false,
}: ExperienceFormProps) {
  const [keySkills, setKeySkills] = useState<string[]>(initialData?.keySkills || []);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      id: uuidv4(),
      companyName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: "",
      keySkills: [],
      isSimulated: isSimulated,
    },
  });

  const isCurrentJob = form.watch("isCurrentJob");

  const handleSubmit = (data: Experience) => {
    // Add key skills to the form data
    data.keySkills = keySkills;
    data.isSimulated = isSimulated;
    onSave(data);
    
    if (!initialData) {
      // Reset form after submit if creating new experience
      form.reset({
        id: uuidv4(),
        companyName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
        description: "",
        keySkills: [],
        isSimulated: isSimulated,
      });
      setKeySkills([]);
      setSkillInput("");
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !keySkills.includes(skillInput.trim())) {
      setKeySkills([...keySkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addSuggestedSkill = (skill: string) => {
    if (!keySkills.includes(skill)) {
      setKeySkills([...keySkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setKeySkills(keySkills.filter((s) => s !== skill));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Company Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Acme Corporation"
                  className="border border-gray-300 rounded-md p-3 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Job Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Senior Software Engineer"
                  className="border border-gray-300 rounded-md p-3 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Start Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="month"
                    className="border border-gray-300 rounded-md p-3 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">End Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="month"
                      disabled={isCurrentJob}
                      className="border border-gray-300 rounded-md p-3 focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-1 flex items-center">
              <FormField
                control={form.control}
                name="isCurrentJob"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", "");
                          }
                        }}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-xs text-gray-700">I currently work here</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Job Description and Achievements
                {suggestedKeywords.length > 0 && (
                  <span className="ml-1 text-xs text-accent">
                    (ATS optimization suggestions available)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe your responsibilities and achievements..."
                  className="border border-gray-300 rounded-md p-3 h-40 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills Used</label>
          <div className="flex">
            <Input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. Project Management, Agile, React"
              className="border border-gray-300 rounded-md p-3 focus:ring-primary focus:border-primary"
            />
            <Button
              type="button"
              onClick={addSkill}
              className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Add
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap">
            {keySkills.map((skill) => (
              <KeywordChip
                key={skill}
                keyword={skill}
                removable
                onRemove={removeSkill}
                className="bg-gray-100 text-gray-800"
              />
            ))}
          </div>

          {/* Keyword suggestions */}
          {suggestedKeywords.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Suggested keywords from job description:</p>
              <div className="flex flex-wrap">
                {suggestedKeywords.map((keyword) => (
                  <KeywordChip
                    key={keyword}
                    keyword={keyword}
                    highlighted
                    onClick={addSuggestedSkill}
                    className={cn(
                      "bg-accent/10 text-accent cursor-pointer",
                      keySkills.includes(keyword) && "opacity-50"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
            {initialData ? "Update Experience" : "Add Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
