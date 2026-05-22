import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconUser, IconCamera, IconPhone, IconInfoCircle, 
  IconDeviceFloppy, IconX, IconLock, IconKey, IconEye, IconEyeOff,
  IconCopy, IconCheck, IconAlertCircle
} from '@tabler/icons-react';
import './ProfilePanel.scss';
import { ProfileSkeleton } from '../SkeletonLoader/SkeletonLoader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePanel = ({ adminInfo, onProfileUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    label: '',
    bio: '',
    phoneNumber: '',
    color: '#6366f1'
  });
  
  // Original data for comparison
  const [originalData, setOriginalData] = useState({
    label: '',
    bio: '',
    phoneNumber: '',
    color: '#6366f1'
  });
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  
  // Clear error when opening password modal
  useEffect(() => {
    if (showPasswordModal) {
      setError('');
    }
  }, [showPasswordModal]);
  
  // Hash viewer modal
  const [showHashModal, setShowHashModal] = useState(false);
  const [hashInfo, setHashInfo] = useState(null);
  const [showFullHash, setShowFullHash] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  
  // Hash generator
  const [showHashGenerator, setShowHashGenerator] = useState(false);
  const [hashGenInput, setHashGenInput] = useState('');
  const [generatedHash, setGeneratedHash] = useState(null);
  const [hashGenCopied, setHashGenCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        const profileData = {
          label: data.data.label || '',
          bio: data.data.bio || '',
          phoneNumber: data.data.phoneNumber || '',
          color: data.data.color || '#6366f1'
        };
        setFormData(profileData);
        setOriginalData(profileData);
        setPicturePreview(data.data.profilePicture);
        return data.data; // Return the profile data
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    checkForChanges({ ...formData, [name]: value });
  };

  const checkForChanges = (currentData = formData) => {
    const dataChanged = 
      currentData.label !== originalData.label ||
      currentData.bio !== originalData.bio ||
      currentData.phoneNumber !== originalData.phoneNumber ||
      currentData.color !== originalData.color;
    
    const pictureChanged = profilePicture !== null;
    
    setHasChanges(dataChanged || pictureChanged);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setPicturePreview(reader.result);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!hasChanges) {
      setSuccess('No changes to save');
      setTimeout(() => setSuccess(''), 2000);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Only send changed fields
      const changedFields = {};
      if (formData.label !== originalData.label) changedFields.label = formData.label;
      if (formData.bio !== originalData.bio) changedFields.bio = formData.bio;
      if (formData.phoneNumber !== originalData.phoneNumber) changedFields.phoneNumber = formData.phoneNumber;
      if (formData.color !== originalData.color) changedFields.color = formData.color;

      // Update profile info if any fields changed
      if (Object.keys(changedFields).length > 0) {
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(changedFields)
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.message);
          setSaving(false);
          return;
        }
      }

      // Update profile picture if changed
      if (profilePicture) {
        const picResponse = await fetch(`${API_URL}/api/profile/picture`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ profilePicture })
        });

        const picData = await picResponse.json();
        if (!picData.success) {
          setError(picData.message);
          setSaving(false);
          return;
        }
      }

      setSuccess('Profile updated successfully!');
      setProfilePicture(null);
      setHasChanges(false);
      
      // Refresh profile data
      const refreshedProfile = await fetchProfile();
      
      // Update admin info in parent component (for sidebar, etc.)
      if (onProfileUpdate) {
        onProfileUpdate(refreshedProfile || profile);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`${API_URL}/api/profile/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setError(''); // Clear any errors
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const checkPasswordStrength = async (password) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/profile/check-password-strength`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (data.success) {
        setPasswordStrength(data.data);
      }
    } catch (err) {
      console.error('Failed to check password strength');
    }
  };

  const fetchHashInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/hash-info`, {
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setHashInfo(data.data);
        setShowHashModal(true);
      }
    } catch (err) {
      setError('Failed to fetch hash info');
    }
  };

  const generateHash = async () => {
    if (!hashGenInput) return;

    try {
      const response = await fetch(`${API_URL}/api/profile/generate-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plainText: hashGenInput, saltRounds: 12 })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedHash(data.data);
      }
    } catch (err) {
      setError('Failed to generate hash');
    }
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <h2><IconUser size={24} /> My Profile</h2>
        <p>Manage your account settings and security</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <IconAlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <IconCheck size={20} />
          {success}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-section">
          <h3><IconCamera size={20} /> Profile Picture</h3>
          <div className="profile-picture-container">
            <div className="profile-picture-preview">
              {picturePreview ? (
                <img src={picturePreview} alt="Profile" />
              ) : (
                <div className="profile-picture-placeholder">
                  <IconUser size={48} />
                </div>
              )}
            </div>
            <div className="profile-picture-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
              />
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconCamera size={18} />
                Choose Image
              </button>
              <p className="help-text">Max 2MB • JPEG, PNG, WebP</p>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="profile-section">
          <h3><IconInfoCircle size={20} /> Basic Information</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={profile?.username || ''}
              disabled
              className="input-disabled"
            />
            <p className="help-text">Username cannot be changed</p>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="Enter display name"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="3"
              maxLength="500"
            />
            <p className="help-text">{formData.bio.length}/500 characters</p>
          </div>

          <div className="form-group">
            <label><IconPhone size={18} /> Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+63 XXX XXX XXXX"
            />
          </div>

          <div className="form-group">
            <label>Theme Color</label>
            <div className="color-picker">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
              <span>{formData.color}</span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="profile-section">
          <h3><IconLock size={20} /> Security</h3>
          <div className="security-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowPasswordModal(true)}
            >
              <IconKey size={18} />
              Change Password
            </button>
            <button
              className="btn btn-secondary"
              onClick={fetchHashInfo}
            >
              <IconEye size={18} />
              View Hash
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowHashGenerator(true)}
            >
              <IconKey size={18} />
              Hash Generator
            </button>
          </div>
          <p className="help-text">
            Last password change: {profile?.passwordChangedAt 
              ? new Date(profile.passwordChangedAt).toLocaleDateString() 
              : 'Never'}
          </p>
        </div>

        {/* Save Button */}
        <div className="profile-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={handleSaveProfile}
            disabled={saving || !hasChanges}
            title={!hasChanges ? 'No changes to save' : 'Save your changes'}
          >
            {saving ? (
              <>Saving...</>
            ) : !hasChanges ? (
              <>
                <IconCheck size={20} />
                No Changes
              </>
            ) : (
              <>
                <IconDeviceFloppy size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3><IconLock size={24} /> Change Password</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <IconX size={20} />
                </button>
              </div>

              <form onSubmit={handlePasswordChange}>
                {error && (
                  <div className="alert alert-error">
                    <IconAlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData(prev => ({ 
                        ...prev, 
                        oldPassword: e.target.value 
                      }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ 
                          ...prev, 
                          newPassword: e.target.value 
                        }));
                        checkPasswordStrength(e.target.value);
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className={`password-strength strength-${passwordStrength.strength}`}>
                      <div className="strength-bar">
                        <div 
                          className="strength-fill" 
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      <p>{passwordStrength.strength.toUpperCase()}</p>
                      <ul>
                        {passwordStrength.feedback.map((fb, i) => (
                          <li key={i}>{fb}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ 
                        ...prev, 
                        confirmPassword: e.target.value 
                      }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hash Info Modal */}
      <AnimatePresence>
        {showHashModal && hashInfo && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHashModal(false)}
          >
            <motion.div
              className="modal-content hash-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3><IconKey size={24} /> Password Hash Information</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowHashModal(false)}
                >
                  <IconX size={20} />
                </button>
              </div>

              <div className="hash-info-content">
                <div className="info-row">
                  <label>Username:</label>
                  <span>{hashInfo.username}</span>
                </div>
                <div className="info-row">
                  <label>Algorithm:</label>
                  <span>{hashInfo.hashInfo.algorithm}</span>
                </div>
                <div className="info-row">
                  <label>Salt Rounds:</label>
                  <span>{hashInfo.hashInfo.saltRounds}</span>
                </div>
                <div className="info-row">
                  <label>Hash Length:</label>
                  <span>{hashInfo.hashInfo.hashLength} characters</span>
                </div>
                <div className="info-row">
                  <label>Last Changed:</label>
                  <span>
                    {hashInfo.hashInfo.passwordChangedAt 
                      ? new Date(hashInfo.hashInfo.passwordChangedAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>

                <div className="hash-display">
                  <label>Password Hash:</label>
                  <div className="hash-value">
                    <code>
                      {showFullHash ? hashInfo.fullHash : hashInfo.hashInfo.hashPreview}
                    </code>
                    <div className="hash-actions">
                      <button
                        className="btn btn-sm"
                        onClick={() => setShowFullHash(!showFullHash)}
                      >
                        {showFullHash ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        {showFullHash ? 'Hide' : 'Show Full'}
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => copyToClipboard(hashInfo.fullHash, setHashCopied)}
                      >
                        {hashCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        {hashCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="security-note">
                  <IconAlertCircle size={18} />
                  <p>{hashInfo.securityNote}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hash Generator Modal */}
      <AnimatePresence>
        {showHashGenerator && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHashGenerator(false)}
          >
            <motion.div
              className="modal-content hash-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3><IconKey size={24} /> Hash Generator (Educational)</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowHashGenerator(false)}
                >
                  <IconX size={20} />
                </button>
              </div>

              <div className="hash-generator-content">
                <div className="form-group">
                  <label>Text to Hash:</label>
                  <input
                    type="text"
                    value={hashGenInput}
                    onChange={(e) => setHashGenInput(e.target.value)}
                    placeholder="Enter any text..."
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={generateHash}
                  disabled={!hashGenInput}
                >
                  Generate Hash
                </button>

                {generatedHash && (
                  <div className="generated-hash-result">
                    <div className="info-row">
                      <label>Plain Text:</label>
                      <span>{generatedHash.plainText}</span>
                    </div>
                    <div className="info-row">
                      <label>Algorithm:</label>
                      <span>{generatedHash.algorithm}</span>
                    </div>
                    <div className="info-row">
                      <label>Salt Rounds:</label>
                      <span>{generatedHash.saltRounds}</span>
                    </div>
                    <div className="hash-display">
                      <label>Generated Hash:</label>
                      <div className="hash-value">
                        <code>{generatedHash.hash}</code>
                        <button
                          className="btn btn-sm"
                          onClick={() => copyToClipboard(generatedHash.hash, setHashGenCopied)}
                        >
                          {hashGenCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          {hashGenCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="security-note">
                      <IconAlertCircle size={18} />
                      <p>{generatedHash.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePanel;
