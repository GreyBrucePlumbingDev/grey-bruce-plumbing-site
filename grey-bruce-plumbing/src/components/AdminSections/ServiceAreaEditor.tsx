"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import TipTap from "../../components/TipTap"

// Define the schema for service area form
const serviceAreaSchema = z.object({
  name: z.string().min(2, "Area name must be at least 2 characters"),
  address: z.string().optional(),
  is_main_address: z.boolean().default(false),
  description: z.string().optional(),
  meta_description: z.string().max(160, "Meta description should be 160 characters or less").optional(),
  hero_image: z.string().optional(),
})

type ServiceAreaFormValues = z.infer<typeof serviceAreaSchema>

interface ServiceArea {
  id: string
  name: string
  address?: string
  is_main_address: boolean
  description?: string
  meta_description?: string
  hero_image?: string
}

const ServiceAreaEditor = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [richContent, setRichContent] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ServiceAreaFormValues>({
    resolver: zodResolver(serviceAreaSchema),
    defaultValues: {
      name: "",
      address: "",
      is_main_address: false,
      description: "",
      meta_description: "",
      hero_image: "",
    },
  })

  // Fetch service areas
  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("service_areas").select("*").order("name", { ascending: true })

        if (error) throw error
        setServiceAreas(data || [])
      } catch (err) {
        console.error("Error fetching service areas:", err)
        showNotification("error", "Failed to load service areas")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceAreas()
  }, [])

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle edit service area
  const handleEdit = (area: ServiceArea) => {
    setEditingId(area.id)
    reset({
      name: area.name,
      address: area.address || "",
      is_main_address: area.is_main_address,
      description: area.description || "",
      meta_description: area.meta_description || "",
      hero_image: area.hero_image || "",
    })
    setRichContent(area.description || "")
  }

  // Handle new service area
  const handleNew = () => {
    setEditingId(null)
    reset({
      name: "",
      address: "",
      is_main_address: false,
      description: "",
      meta_description: "",
      hero_image: "",
    })
    setRichContent("")
  }

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null)
    reset()
    setRichContent("")
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service area?")) {
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.from("service_areas").delete().eq("id", id)

      if (error) throw error

      setServiceAreas(serviceAreas.filter((area) => area.id !== id))
      showNotification("success", "Service area deleted successfully")
    } catch (err) {
      console.error("Error deleting service area:", err)
      showNotification("error", "Failed to delete service area")
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: ServiceAreaFormValues) => {
    try {
      setSaving(true)

      // Include the rich text content
      const formData = {
        ...data,
        description: richContent,
      }

      let result

      if (editingId) {
        // Update existing service area
        result = await supabase.from("service_areas").update(formData).eq("id", editingId)
      } else {
        // Create new service area
        result = await supabase.from("service_areas").insert([formData]).select()
      }

      if (result.error) throw result.error

      // Refresh the service areas list
      const { data: refreshedData, error: refreshError } = await supabase
        .from("service_areas")
        .select("*")
        .order("name", { ascending: true })

      if (refreshError) throw refreshError

      setServiceAreas(refreshedData || [])
      showNotification("success", editingId ? "Service area updated successfully" : "Service area created successfully")

      // Reset form
      handleCancel()
    } catch (err) {
      console.error("Error saving service area:", err)
      showNotification("error", "Failed to save service area")
    } finally {
      setSaving(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      const file = e.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `service-area-${Date.now()}.${fileExt}`
      const filePath = `service-areas/${fileName}`

      setLoading(true)

      // Upload file to storage
      const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from("assets").getPublicUrl(filePath)

      setValue("hero_image", data.publicUrl)
      showNotification("success", "Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      showNotification("error", "Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#152f59]">Service Areas</h2>
        <button onClick={handleNew} className="btn btn-primary bg-[#7ac144] hover:bg-[#6aad39] border-none">
          Add New Area
        </button>
      </div>

      {notification && (
        <div className={`alert ${notification.type === "success" ? "alert-success" : "alert-error"} mb-6`}>
          <div>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {(editingId !== null || (editingId === null && richContent !== "")) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">{editingId ? "Edit Service Area" : "Add New Service Area"}</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Area Name *</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                  placeholder="e.g., Collingwood"
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="input input-bordered w-full"
                  placeholder="e.g., 123 Main St, Collingwood, ON"
                />
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label cursor-pointer justify-start">
                <input type="checkbox" {...register("is_main_address")} className="checkbox mr-2" />
                <span className="label-text">This is the main address</span>
              </label>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Meta Description</span>
                <span className="label-text-alt">Max 160 characters</span>
              </label>
              <textarea
                {...register("meta_description")}
                className={`textarea textarea-bordered w-full h-20 ${errors.meta_description ? "textarea-error" : ""}`}
                placeholder="Brief description for search engines"
              ></textarea>
              {errors.meta_description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.meta_description.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Hero Image</span>
              </label>
              <div className="flex items-center space-x-4">
                <Controller
                  name="hero_image"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Image URL"
                        readOnly
                      />
                      {field.value && (
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
                            <img src={field.value || "/placeholder.svg"} alt="Preview" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered"
                />
              </div>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Area Description</span>
              </label>
              <TipTap initialContent={richContent} onSave={setRichContent} editorHeight="min-h-[300px]" />
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={handleCancel} className="btn btn-ghost">
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-[#7ac144] hover:bg-[#6aad39] border-none"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Service Area"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service Areas Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Address</th>
              <th>Main Address</th>
              <th>Has Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && serviceAreas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : serviceAreas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No service areas found. Add your first service area using the button above.
                </td>
              </tr>
            ) : (
              serviceAreas.map((area) => (
                <tr key={area.id}>
                  <td>{area.name}</td>
                  <td>{area.address || "—"}</td>
                  <td>
                    {area.is_main_address ? (
                      <span className="badge badge-success">Yes</span>
                    ) : (
                      <span className="badge badge-ghost">No</span>
                    )}
                  </td>
                  <td>
                    {area.description ? (
                      <span className="badge badge-info">Yes</span>
                    ) : (
                      <span className="badge badge-ghost">No</span>
                    )}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(area)} className="btn btn-sm btn-outline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(area.id)} className="btn btn-sm btn-error btn-outline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SEO Tips */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">SEO Tips for Service Areas</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-900">
          <li>Include the area name in the meta description</li>
          <li>Add relevant keywords like "plumbing services in [area name]"</li>
          <li>Keep meta descriptions between 120-160 characters</li>
          <li>Use descriptive, keyword-rich content in the area description</li>
          <li>Add high-quality, relevant images with descriptive file names</li>
        </ul>
      </div>
    </div>
  )
}

export default ServiceAreaEditor

