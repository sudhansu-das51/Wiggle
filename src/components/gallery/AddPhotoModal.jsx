import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

const PRESET_IMAGES = [
  { label: 'Finger Painting', src: '/images/HM1.png' },
  { label: 'Sandbox Play', src: '/images/HM2.png' },
  { label: 'Lantern Festival', src: '/images/HM3.png' },
  { label: 'Clay Art', src: '/images/HM5.png' },
];

const TINTS = [
  { id: 'yellow', label: 'Sunny', color: '#FFC93C' },
  { id: 'mint', label: 'Mint', color: '#5BB381' },
  { id: 'pink', label: 'Bubblegum', color: '#FF8FB1' },
  { id: 'sky', label: 'Sky Blue', color: '#5CC8FF' },
];

const CATEGORIES = ['Art and craft', 'Play', 'Celebrations', 'Campus'];

/**
 * Resizes and compresses an image file to a lightweight data URL for localStorage.
 */
function compressImage(file, maxDimension = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * AddPhotoModal: Allows teachers to upload or choose a photo,
 * specify event details, title, category, and polaroid tint to hang on the clothesline.
 */
export function AddPhotoModal({ isOpen, onClose, onAddPhoto }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Art and craft');
  const [caption, setCaption] = useState('');
  const [tint, setTint] = useState('yellow');
  const [imageSrc, setImageSrc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle('');
    setCategory('Art and craft');
    setCaption('');
    setTint('yellow');
    setImageSrc('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      const compressed = await compressImage(file);
      setImageSrc(compressed);
    } catch (err) {
      setError('Could not process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a title for this moment.');
      return;
    }

    if (!imageSrc) {
      setError('Please upload a photo or pick a sample image.');
      return;
    }

    const newPhoto = {
      id: `gal-teacher-${Date.now()}`,
      title: title.trim(),
      category: category,
      image: imageSrc,
      alt: title.trim(),
      ratio: 'square',
      tint: tint,
      caption: caption.trim() || title.trim(),
      date: new Date().toISOString().slice(0, 7),
      isUserAdded: true,
    };

    onAddPhoto(newPhoto);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add a School Memory 📸"
      className="gal-add-photo-modal"
    >
      <p className="note gal-modal-subtitle" style={{ marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
        Add a photo from today's classroom activity, festival, or playground fun.
      </p>

      {error && (
        <div className="gal-modal-error" role="alert" style={{ marginBottom: '1rem' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="gal-add-form">
        {/* Photo Upload / Image Selection */}
        <div className="gal-form-group">
          <label className="gal-form-label">
            Photo <span className="gal-req">*</span>
          </label>

          {imageSrc ? (
            <div className="gal-preview-card">
              <div
                className="gal-preview-img-wrap"
                style={{
                  backgroundColor: TINTS.find((t) => t.id === tint)?.color || '#FFC93C',
                }}
              >
                <img src={imageSrc} alt="Preview" className="gal-preview-img" />
              </div>
              <div className="gal-preview-actions">
                <span className="gal-preview-tag">Photo ready</span>
                <button
                  type="button"
                  className="gal-preview-change-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>
              </div>
            </div>
          ) : (
            <div
              className="gal-dropzone"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <div className="gal-dropzone-icon">
                <Icon name="camera" size={32} />
              </div>
              <p className="gal-dropzone-title">Click to upload photo from your device</p>
              <p className="gal-dropzone-sub note">Supports JPG, PNG, WEBP (auto-compressed)</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Quick presets if teacher has no local photo handy */}
          <div className="gal-presets-wrap">
            <span className="gal-presets-label note">Or pick a preschool photo preset:</span>
            <div className="gal-presets-list">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.src}
                  type="button"
                  className={`gal-preset-chip ${imageSrc === preset.src ? 'active' : ''}`}
                  onClick={() => {
                    setImageSrc(preset.src);
                    if (!title) setTitle(preset.label);
                    setError('');
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Title */}
        <div className="gal-form-group">
          <label htmlFor="photo-title-input" className="gal-form-label">
            Event / Photo Title <span className="gal-req">*</span>
          </label>
          <input
            id="photo-title-input"
            type="text"
            className="gal-input"
            placeholder="e.g. Diwali Diya Decoration or Sandbox Castle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
          />
        </div>

        {/* Category & Tint selection row */}
        <div className="gal-form-row">
          {/* Category */}
          <div className="gal-form-group gal-form-group--half">
            <label htmlFor="photo-category-select" className="gal-form-label">
              Category / Activity <span className="gal-req">*</span>
            </label>
            <select
              id="photo-category-select"
              className="gal-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Polaroid Tape / Frame Tint */}
          <div className="gal-form-group gal-form-group--half">
            <label className="gal-form-label">Polaroid Color</label>
            <div className="gal-tint-picker" role="radiogroup" aria-label="Polaroid color tint">
              {TINTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`gal-tint-swatch ${tint === t.id ? 'active' : ''}`}
                  style={{ backgroundColor: t.color }}
                  onClick={() => setTint(t.id)}
                  aria-label={t.label}
                  title={t.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Story / Caption */}
        <div className="gal-form-group">
          <label htmlFor="photo-caption-input" className="gal-form-label">
            What happened in this moment? <span className="note" style={{ fontWeight: 400 }}>(Handwritten caption)</span>
          </label>
          <textarea
            id="photo-caption-input"
            className="gal-textarea note"
            placeholder="e.g. Children mixed yellow and red clay to shape playful sea turtles..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            maxLength={140}
          />
          <span className="gal-char-count note">{140 - caption.length} characters left</span>
        </div>

        {/* Modal Buttons */}
        <div className="gal-form-actions">
          <Button
            variant="primary"
            type="submit"
            disabled={isProcessing}
            icon={<Icon name="plus" size={18} />}
          >
            {isProcessing ? 'Processing photo...' : 'Pin to Clothesline 📎'}
          </Button>
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddPhotoModal;
