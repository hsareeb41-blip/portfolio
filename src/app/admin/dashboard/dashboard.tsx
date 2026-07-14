"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  FolderKanban,
  Star,
  Shield,
  Brain,
  Trash2,
  Edit2,
  ExternalLink,
  Plus,
  Loader2,
  MessageSquare,
  X,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  vercelLink: string;
}

interface Skill {
  _id: string;
  name: string;
}

interface Testimonial {
  _id: string;
  image: string;
  name?: string;
  message: string;
  createdAt?: string;
}

interface MessageItem {
  _id: string;
  name: string;
  contact?: string;
  email: string;
  comment: string;
  createdAt?: string;
}

type TabType = "projects" | "skills" | "testimonials" | "messages";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editProjectForm, setEditProjectForm] = useState({
    title: "",
    description: "",
    vercelLink: "",
  });
  const [editSkillName, setEditSkillName] = useState("");
  const [editTestimonialMessage, setEditTestimonialMessage] = useState("");
  const [editTestimonialName, setEditTestimonialName] = useState("");
  const [editTestimonialFile, setEditTestimonialFile] = useState<File | null>(
    null,
  );
  const [editTestimonialPreview, setEditTestimonialPreview] = useState<
    string | null
  >(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (activeTab === "projects") {
        const res = await fetch(`${apiUrl}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } else if (activeTab === "skills") {
        const res = await fetch(`${apiUrl}/api/skills`);
        if (res.ok) {
          const data = await res.json();
          setSkills(data.skills || []);
        }
      } else if (activeTab === "testimonials") {
        const res = await fetch(`${apiUrl}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.testimonials || []);
        }
      } else if (activeTab === "messages") {
        const res = await fetch(`${apiUrl}/api/messages`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      let deleteUrl = "";

      if (activeTab === "projects") {
        deleteUrl = `${apiUrl}/api/projects/${id}`;
      } else if (activeTab === "skills") {
        deleteUrl = `${apiUrl}/api/skills/${id}`;
      } else if (activeTab === "testimonials") {
        deleteUrl = `${apiUrl}/api/testimonials/${id}`;
      } else if (activeTab === "messages") {
        deleteUrl = `${apiUrl}/api/messages/${id}`;
      }

      const res = await fetch(deleteUrl, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item.");
      }

      alert("Item deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item.");
    }
  };

  // Open Edit Dialog
  const handleEditClick = (item: any) => {
    setEditingItem(item);
    if (activeTab === "projects") {
      setEditProjectForm({
        title: item.title,
        description: item.description,
        vercelLink: item.vercelLink,
      });
    } else if (activeTab === "skills") {
      setEditSkillName(item.name);
    } else if (activeTab === "testimonials") {
      setEditTestimonialMessage(item.message);
      setEditTestimonialName(item.name || "");
      setEditTestimonialPreview(item.image);
      setEditTestimonialFile(null);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      let url = "";
      let options: RequestInit = {};

      if (activeTab === "projects") {
        url = `${apiUrl}/api/projects/${editingItem._id}`;
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProjectForm),
          credentials: "include",
        };
      } else if (activeTab === "skills") {
        url = `${apiUrl}/api/skills/${editingItem._id}`;
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editSkillName }),
          credentials: "include",
        };
      } else if (activeTab === "testimonials") {
        url = `${apiUrl}/api/testimonials/${editingItem._id}`;
        const formData = new FormData();
        formData.append("message", editTestimonialMessage);
        formData.append("name", editTestimonialName || "Anonymous");
        if (editTestimonialFile) {
          formData.append("image", editTestimonialFile);
        }
        options = {
          method: "PUT",
          body: formData,
          credentials: "include",
        };
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update item.");
      }

      alert("Item updated successfully!");
      setEditingItem(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <header className="h-20 bg-white border-b shadow-sm flex items-center justify-between px-8 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Admin Control Panel
          </h1>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "projects"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FolderKanban size={16} />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "skills"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Brain size={16} />
            <span>Skills</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "testimonials"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Star size={16} />
            <span>Testimonials</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "messages"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageSquare size={16} />
            <span>Messages</span>
          </button>
        </nav>

        <div>
          <Link
            href="/admin/add"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/10"
          >
            <Plus size={16} />
            <span>Create New</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px] relative">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {activeTab} Section
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-2">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium">Loading records...</span>
            </div>
          ) : (
            <>
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div>
                  {projects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <th className="pb-4 px-6">Title</th>
                            <th className="pb-4 px-6">Description</th>
                            <th className="pb-4 px-6">Vercel Link</th>
                            <th className="pb-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {projects.map((project) => (
                            <tr
                              key={project._id}
                              className="hover:bg-gray-50/50 transition"
                            >
                              <td className="py-4 px-6 font-bold text-gray-900">
                                {project.title}
                              </td>
                              <td className="py-4 px-6 text-gray-500 max-w-sm truncate text-sm">
                                {project.description}
                              </td>
                              <td className="py-4 px-6 text-sm">
                                <a
                                  href={project.vercelLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                                >
                                  <span>Open Site</span>
                                  <ExternalLink size={14} />
                                </a>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => handleEditClick(project)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit Project"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(project._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete Project"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-400 py-16 text-center text-sm font-medium">
                      No projects found. Add one in the creation panel!
                    </p>
                  )}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div>
                  {skills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {skills.map((skill) => (
                        <div
                          key={skill._id}
                          className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition"
                        >
                          <span className="font-semibold text-gray-700">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(skill)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Skill"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="p-1.5 text-red-600 hover:bg-red-150 rounded-lg transition"
                              title="Delete Skill"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 py-16 text-center text-sm font-medium">
                      No skills found. Add one in the creation panel!
                    </p>
                  )}
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === "testimonials" && (
                <div>
                  {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testi) => (
                        <div
                          key={testi._id}
                          className="border border-gray-100 rounded-2xl p-6 bg-gray-50/20 flex flex-col justify-between hover:shadow-sm transition"
                        >
                          <p className="italic text-gray-600 text-sm leading-relaxed mb-6">
                            &ldquo;{testi.message}&rdquo;
                          </p>
                          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-3">
                              {testi.image && (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-white">
                                  <Image
                                    src={testi.image}
                                    alt="Client Avatar"
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">
                                  {testi.name || "Client"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    testi.createdAt || Date.now(),
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditClick(testi)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Testimonial"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(testi._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete Testimonial"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 py-16 text-center text-sm font-medium">
                      No testimonials found. Add one in the creation panel!
                    </p>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div>
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((m) => (
                        <div
                          key={m._id}
                          className="bg-white rounded-xl border p-4 flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Mail size={18} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">
                                  {m.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {m.email} • {m.contact || "-"}
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-700">
                              {m.comment}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-xs text-gray-400">
                              {new Date(
                                m.createdAt || Date.now(),
                              ).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(m._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 py-16 text-center text-sm font-medium">
                      No messages yet. Contact form submissions will appear
                      here.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ================= Edit Modal Overlay ================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-150 animate-zoom-in">
            <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 capitalize">
                Edit {activeTab.slice(0, -1)}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Project Edit Inputs */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editProjectForm.title}
                      onChange={(e) =>
                        setEditProjectForm({
                          ...editProjectForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Project Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editProjectForm.description}
                      onChange={(e) =>
                        setEditProjectForm({
                          ...editProjectForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Vercel Link
                    </label>
                    <input
                      type="url"
                      required
                      value={editProjectForm.vercelLink}
                      onChange={(e) =>
                        setEditProjectForm({
                          ...editProjectForm,
                          vercelLink: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                    />
                  </div>
                </div>
              )}

              {/* Skill Edit Input */}
              {activeTab === "skills" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editSkillName}
                    onChange={(e) => setEditSkillName(e.target.value)}
                    className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                  />
                </div>
              )}

              {/* Testimonial Edit Inputs */}
              {activeTab === "testimonials" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border bg-gray-50">
                      {editTestimonialPreview && (
                        <Image
                          src={editTestimonialPreview}
                          alt="Avatar"
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Replace Image (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditTestimonialFile(file);
                            setEditTestimonialPreview(
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                        className="w-full border rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editTestimonialName}
                      onChange={(e) => setEditTestimonialName(e.target.value)}
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                    />

                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 mt-3">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editTestimonialMessage}
                      onChange={(e) =>
                        setEditTestimonialMessage(e.target.value)
                      }
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-850"
                    />
                  </div>
                </div>
              )}

              <footer className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {saving && <Loader2 className="animate-spin w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
