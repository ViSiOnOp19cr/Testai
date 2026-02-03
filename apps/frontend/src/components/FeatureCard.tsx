/**
 * FeatureCard Component
 * 
 * A reusable card component for displaying features or key points.
 * Simple and clean design with title and description.
 * 
 * Usage:
 * <FeatureCard 
 *   title="Fast Testing" 
 *   description="Run tests in seconds with AI-powered execution" 
 * />
 */

interface FeatureCardProps {
  title: string
  description: string
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
