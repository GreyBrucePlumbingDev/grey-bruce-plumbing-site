"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

interface DomainMapping {
  id?: string
  domain: string
  redirectTo: string
  serviceAreaId?: string
}

interface ServiceArea {
  id: string
  name: string
}

const DomainMappingEditor = () => {
  const [domainMappings, setDomainMappings] = useState<DomainMapping[]>([])
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMapping, setEditMapping] = useState<DomainMapping | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch domain mappings
        const { data: mappingsData, error: mappingsError } = await supabase
          .from("domain_mappings")
          .select("*")
          .order("domain", { ascending: true })

        if (mappingsError) throw mappingsError

        // Fetch service areas for dropdown
        const { data: areasData, error: areasError } = await supabase
          .from("service_areas")
          .select("id, name")
          .order("name", { ascending: true })

        if (areasError) throw areasError

        setDomainMappings(mappingsData || [])
        setServiceAreas(areasData || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEdit = (mapping: DomainMapping) => {
    setEditMapping({ ...mapping })
    setError(null)
    setSuccess(null)
  }

  const handleNew = () => {
    setEditMapping({
      domain: "",
      redirectTo: "",
    })
    setError(null)
    setSuccess(null)
  }

  const handleCancel = () => {
    setEditMapping(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editMapping) return

    const { name, value } = e.target
    setEditMapping({
      ...editMapping,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editMapping) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Validate inputs
      if (!editMapping.domain) {
        setError("Domain is required")
        return
      }

      if (!editMapping.redirectTo) {
        setError("Redirect path is required")
        return
      }

      // If serviceAreaId is empty string, set to null
      const formattedMapping = {
        ...editMapping,
        serviceAreaId: editMapping.serviceAreaId === "" ? null : editMapping.serviceAreaId,
      }

      let result

      if (editMapping.id) {
        // Update existing mapping
        result = await supabase
          .from("domain_mappings")
          .update({
            domain: formattedMapping.domain,
            redirectTo: formattedMapping.redirectTo,
            serviceAreaId: formattedMapping.serviceAreaId,
          })
          .eq("id", editMapping.id)
      } else {
        // Create new mapping
        result = await supabase.from("domain_mappings").insert([
          {
            domain: formattedMapping.domain,
            redirectTo: formattedMapping.redirectTo,
            serviceAreaId: formattedMapping.serviceAreaId,
          },
        ])
      }

      if (result.error) throw result.error

      // Refresh the data
      const { data: refreshedData, error: refreshError } = await supabase
        .from("domain_mappings")
        .select("*")
        .order("domain", { ascending: true })

      if (refreshError) throw refreshError

      setDomainMappings(refreshedData || [])
      setSuccess(editMapping.id ? "Domain mapping updated successfully" : "Domain mapping created successfully")
      setEditMapping(null)
    } catch (err) {
      console.error("Error saving domain mapping:", err)
      setError("Failed to save domain mapping")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this domain mapping?")) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const { error } = await supabase.from("domain_mappings").delete().eq("id", id)

      if (error) throw error

      // Update state
      setDomainMappings(domainMappings.filter((mapping) => mapping.id !== id))
      setSuccess("Domain mapping deleted successfully")
    } catch (err) {
      console.error("Error deleting domain mapping:", err)
      setError("Failed to delete domain mapping")
    } finally {
      setLoading(false)
    }
  }

  if (loading && domainMappings.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#152f59]">Domain Mappings</h2>
        <button
          onClick={handleNew}
          className="btn btn-primary bg-[#7ac144] hover:bg-[#6aad39] border-none"
          disabled={!!editMapping}
        >
          Add New Domain
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {editMapping && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            {editMapping.id ? "Edit Domain Mapping" : "Add Domain Mapping"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Domain Name *</span>
                </label>
                <input
                  type="text"
                  name="domain"
                  value={editMapping.domain}
                  onChange={handleChange}
                  placeholder="e.g., collingwoodplumbing.com"
                  className="input input-bordered w-full"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter domain without http:// or https://</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Redirect Path *</span>
                </label>
                <input
                  type="text"
                  name="redirectTo"
                  value={editMapping.redirectTo}
                  onChange={handleChange}
                  placeholder="e.g., /service-area/collingwood"
                  className="input input-bordered w-full"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Path should start with a forward slash</span>
                </label>
              </div>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Associated Service Area</span>
              </label>
              <select
                name="serviceAreaId"
                value={editMapping.serviceAreaId || ""}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">None</option>
                {serviceAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
              <label className="label">
                <span className="label-text-alt">Optional: Link this domain to a specific service area</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={handleCancel} className="btn btn-ghost" disabled={saving}>
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
                  "Save Domain Mapping"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Domain Mappings Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Redirects To</th>
              <th>Service Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domainMappings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No domain mappings found. Add your first domain mapping using the button above.
                </td>
              </tr>
            ) : (
              domainMappings.map((mapping) => {
                const associatedArea = serviceAreas.find((area) => area.id === mapping.serviceAreaId)

                return (
                  <tr key={mapping.id}>
                    <td>{mapping.domain}</td>
                    <td>{mapping.redirectTo}</td>
                    <td>{associatedArea ? associatedArea.name : "—"}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(mapping)}
                          className="btn btn-sm btn-outline"
                          disabled={!!editMapping}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(mapping.id!)}
                          className="btn btn-sm btn-error btn-outline"
                          disabled={!!editMapping}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Set Up Domain Redirection</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-900">
          <li>Add your domain mapping in the table above</li>
          <li>In your GoDaddy account, go to your domain's DNS settings</li>
          <li>Add a CNAME record pointing to your Vercel deployment (e.g., yoursite.vercel.app)</li>
          <li>In your Vercel project settings, add the domain as a custom domain</li>
          <li>Wait for DNS propagation (can take up to 48 hours)</li>
        </ol>
        <p className="mt-4 text-sm text-blue-700">
          Note: The domain redirection will automatically handle routing visitors to the correct page based on the
          mappings defined here.
        </p>
      </div>
    </div>
  )
}

export default DomainMappingEditor

