import { motion } from 'framer-motion'

export default function RewardImage({ 
  imageUrl, 
  emoji, 
  title, 
  rarity, 
  className = "", 
  containerClassName = "",
  padding = true 
}) {
  const isLegendary = rarity === 'LEGENDARY'

  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center ${containerClassName}`}>
        <span className="text-6xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
          {emoji}
        </span>
      </div>
    )
  }

  return (
    <div className={`product-image-container ${containerClassName}`}>
      {/* Blurred background for empty spaces */}
      <img 
        src={imageUrl} 
        alt="" 
        className="product-image-blur" 
        loading="lazy"
      />
      
      {/* Main contained image */}
      <img 
        src={imageUrl} 
        alt={title} 
        className={`product-image-main group-hover:scale-110 ${!padding ? '!p-0' : ''} ${className}`}
        loading="lazy"
      />
    </div>
  )
}
