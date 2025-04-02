import type React from "react"
import { Link } from "react-router-dom"
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"
import Container from "../common/Container"

const EmergencyCallout: React.FC = () => {
  const { settings, loading } = useSitewideSettings() as {
    settings: SitewideSettings | null
    loading: boolean
  }

  // Parse business hours from the settings
  const parseBusinessHours = () => {
    if (!settings || !settings.business_hours || settings.business_hours.trim() === "") {
      return []
    }

    const daysFullNames: Record<string, string> = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    }

    // Split by comma to get each day's schedule
    const days = settings.business_hours.toLowerCase().split(",")

    return days
      .filter((daySchedule) => daySchedule && daySchedule.includes(":")) // Make sure item exists and has the right format
      .map((daySchedule) => {
        // Split by colon to separate day from hours
        const [day, hours] = daySchedule.split(":")

        // Ensure day exists and is valid
        if (!day || !hours) {
          return { day: "Unknown", hours: "Invalid Format" }
        }

        const dayName = daysFullNames[day.trim()] || "Unknown"

        // Format the hours or return "Closed" if specified
        const formattedHours =
          hours.trim().toLowerCase() === "closed"
            ? "Closed"
            : hours.trim().replace("am", " AM").replace("pm", " PM").replace("-", " - ")

        return {
          day: dayName,
          hours: formattedHours,
        }
      })
  }

  // Default hours to show while loading or if parsing fails
  const defaultHours = [
    { day: "Monday", hours: "Loading..." },
    { day: "Tuesday", hours: "Loading..." },
    { day: "Wednesday", hours: "Loading..." },
    { day: "Thursday", hours: "Loading..." },
    { day: "Friday", hours: "Loading..." },
    { day: "Saturday", hours: "Loading..." },
    { day: "Sunday", hours: "Loading..." },
  ]

  // Get operating hours or use fallback
  let operatingHours

  try {
    const parsedHours = !loading && settings?.business_hours ? parseBusinessHours() : []

    // If parsing successful and we have hours for all days, use them
    // Otherwise fall back to defaults
    operatingHours = parsedHours.length === 7 ? parsedHours : defaultHours
  } catch (error) {
    console.error("Error parsing business hours:", error)
    operatingHours = defaultHours
  }

  return (
    <div className="py-8 bg-secondary-700 text-white">
      <Container>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Title, Call-to-action text, and Book Now button */}
            <div className="flex flex-col space-y-4">
              <h2 className="text-3xl font-bold">Need Plumbing Help ASAP?</h2>

              <div>
                <p className="mb-2">
                  Call us today at{" "}
                  <span className="text-2xl font-bold text-primary-500">
                    {loading || !settings?.emergency_phone ? "(555) 123-4567" : settings.emergency_phone}
                  </span>
                </p>
                <p>Our team will take care of your call anytime, 24/7.</p>
              </div>

              <div className="pt-2">
                <Link
                  to={settings?.booking_link || "#"}
                  className="inline-block px-6 py-3 bg-[#7ac144] hover:bg-[#69a83a] text-white font-bold rounded-lg transition-colors duration-300 shadow-md"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Right Column: Hours of operation */}
            <div className="bg-white text-[#152f59] rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-bold mb-3 text-center !text-[#152f59]">Hours of Operation</h3>
              <div className="grid grid-cols-1 gap-1">
                {operatingHours.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between items-center border-b border-gray-200 py-1 last:border-0"
                  >
                    <span className="font-medium !text-[#152f59]">{item.day}</span>
                    <span className="!text-[#152f59]">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default EmergencyCallout

