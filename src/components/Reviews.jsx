import { useState, useEffect } from 'react';
import { getReviews } from '../lib/productService';
import './Reviews.css';

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? 'star--filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews]);

  if (loading || reviews.length === 0) return null;

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  function prev() {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }

  function next() {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }

  const visibleReviews = [];
  for (let i = 0; i < Math.min(5, reviews.length); i++) {
    visibleReviews.push(reviews[(currentIndex + i) % reviews.length]);
  }

  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews__header">
          <span className="reviews__eyebrow">✦ Opiniones reales</span>
          <h2 className="reviews__title">Testimonios REALES</h2>
          <div className="reviews__summary">
            <span className="reviews__avg">{avgRating}</span>
            <div>
              <StarRating rating={Math.round(avgRating)} />
              <p className="reviews__count">{reviews.length} reseñas verificadas</p>
            </div>
          </div>
        </div>

        <div className="reviews__carousel">
          <button className="reviews__arrow reviews__arrow--left" onClick={prev}>‹</button>

          <div className="reviews__track">
            {visibleReviews.map((review, i) => (
              <div key={`${review.id}-${i}`} className="review-card">
                {review.image_url ? (
                  <img src={review.image_url} alt={review.name} className="review-card__photo" />
                ) : (
                  <div className="review-card__avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <StarRating rating={review.rating} />
                <p className="review-card__name">{review.name}</p>
                <p className="review-card__text">"{review.review}"</p>
                {review.product_name && (
                  <p className="review-card__product">🧴 {review.product_name}</p>
                )}
              </div>
            ))}
          </div>

          <button className="reviews__arrow reviews__arrow--right" onClick={next}>›</button>
        </div>

        <div className="reviews__dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`reviews__dot ${i === currentIndex ? 'reviews__dot--active' : ''}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;