"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

export default function Add() {
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [testimonialImage, setTestimonialImage] = useState<string | null>(null);
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);
  const [testimonialMessage, setTestimonialMessage] = useState<string>("");
  const [testimonialName, setTestimonialName] = useState<string>("");

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    vercelLink: "",
  });

  const [submittingProject, setSubmittingProject] = useState(false);
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [submittingSkills, setSubmittingSkills] = useState(false);

  // Add Skill to list
  const addSkill = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const value = skillInput.trim();

    if (!value) return;
    if (skills.includes(value)) return;

    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  // Keyboard Enter for skills
  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill(e);
    }
  };

  // Remove Skill from list
  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Image Preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestimonialFile(file);
      setTestimonialImage(URL.createObjectURL(file));
    }
  };

  // Project Submit
  const handleProjectSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingProject(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectForm),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add project");
      }

      alert("Project Added successfully!");
      setProjectForm({
        title: "",
        description: "",
        vercelLink: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add project");
    } finally {
      setSubmittingProject(false);
    }
  };

  // Testimonial Submit
  const handleTestimonialSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!testimonialFile) {
      alert("Please upload an image.");
      return;
    }
    setSubmittingTestimonial(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("image", testimonialFile);
      formData.append("name", testimonialName || "Anonymous");
      formData.append("message", testimonialMessage);

      const res = await fetch(`${apiUrl}/api/testimonials`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add testimonial");
      }

      alert("Testimonial Added successfully!");
      setTestimonialMessage("");
      setTestimonialName("");
      setTestimonialFile(null);
      setTestimonialImage(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add testimonial");
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  // Skills Submit
  const handleSkillSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (skills.length === 0) {
      alert("Please add at least one skill first.");
      return;
    }
    setSubmittingSkills(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Post skills sequentially or in parallel
      const promises = skills.map(async (name) => {
        const res = await fetch(`${apiUrl}/api/skills`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Failed to add skill: ${name}`);
        }
      });

      await Promise.all(promises);

      alert("Skills Added successfully!");
      setSkills([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add skills");
    } finally {
      setSubmittingSkills(false);
    }
  };

  return (
    <div className="h-screen md:h-164 overflow-y-auto bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ================= Project ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Project</h2>

          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              required
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({ ...projectForm, title: e.target.value })
              }
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Project Description"
              rows={5}
              required
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({ ...projectForm, description: e.target.value })
              }
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="url"
              placeholder="Vercel Link"
              required
              value={projectForm.vercelLink}
              onChange={(e) =>
                setProjectForm({ ...projectForm, vercelLink: e.target.value })
              }
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={submittingProject}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingProject && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
              <span>Add Project</span>
            </button>
          </form>
        </div>

        {/* ================= Testimonial ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add Testimonial
          </h2>

          <form onSubmit={handleTestimonialSubmit} className="space-y-5">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                {testimonialImage ? (
                  <>
                    <Image
                      src={testimonialImage}
                      alt="Preview"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTestimonialImage(null);
                        setTestimonialFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Preview</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                required={!testimonialImage}
                onChange={handleImageChange}
                className="flex-1 border rounded-lg p-3 text-gray-800"
              />
            </div>

            <input
              type="text"
              placeholder="Client name"
              value={testimonialName}
              onChange={(e) => setTestimonialName(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Message"
              rows={5}
              required
              value={testimonialMessage}
              onChange={(e) => setTestimonialMessage(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={submittingTestimonial}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingTestimonial && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
              <span>Add Testimonial</span>
            </button>
          </form>
        </div>

        {/* ================= Skills ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Skills</h2>

          <form onSubmit={handleSkillSubmit} className="space-y-5">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={addSkill}
                className="px-6 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
              >
                Enter
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                >
                  <span>{skill}</span>

                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X size={16} className="cursor-pointer" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submittingSkills}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingSkills && <Loader2 className="animate-spin w-4 h-4" />}
              <span>Save Skills to Database</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
