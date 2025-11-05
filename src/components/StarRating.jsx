import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
};

export default StarRating;